/**
 * Hook that auto-syncs Redux state with Supabase when the user is authenticated.
 *
 * - On sign-in: fetches cloud data (including tombstones), merges with local
 *   using the rules in services/syncMerge, then uploads anything newer locally.
 * - On local data change: after a 2s debounce, uploads only records that
 *   changed and writes tombstones for records deleted locally.
 * - If the first sync fails (offline, backend down), the next local change
 *   retries it.
 * - On sign-out: stops syncing, keeps local data intact.
 *
 * Call this once at the app root level alongside usePersistence(), passing its
 * hydrated flag: syncing before local data loads would treat cloud records as
 * locally deleted.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'react-redux';

import { useAppDispatch, useAppSelector, type RootState } from '@/store/store';
import { setDecks } from '@/store/decksSlice';
import { setPlaylists } from '@/store/playlistsSlice';
import {
  syncDecks,
  fetchDecks,
  syncPlaylists,
  fetchPlaylists,
  markDeleted,
} from '@/services/cloudSync';
import {
  mergeDecks,
  mergePlaylists,
  findChanged,
  findDeletedIds,
  deckTimestamp,
  playlistTimestamp,
  type CloudRecord,
} from '@/services/syncMerge';
import type { Deck, Playlist } from '@/engine/types';

/** Debounce delay before syncing local changes to cloud (ms). */
const SYNC_DEBOUNCE_MS = 2000;

interface CloudSyncResult {
  /** Whether a sync operation is currently in progress. */
  isSyncing: boolean;
  /** Timestamp of the last successful sync, or null if never synced. */
  lastSyncedAt: Date | null;
  /** Manually trigger a full sync cycle. */
  syncNow: () => Promise<void>;
}

/** Last synced edit timestamp per record id, for each record kind. */
interface SyncedStamps {
  deck: Map<string, string>;
  playlist: Map<string, string>;
}

function liveStamps<T>(records: CloudRecord<T>[]): Map<string, string> {
  return new Map(records.filter((r) => !r.deletedAt).map((r) => [r.id, r.updatedAt]));
}

export function useCloudSync(hydrated: boolean): CloudSyncResult {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const decks = useAppSelector((state) => state.decks.decks);
  const playlists = useAppSelector((state) => state.playlists.playlists);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedInitialSync = useRef(false);
  const inFlight = useRef(false);
  const synced = useRef<SyncedStamps>({ deck: new Map(), playlist: new Map() });

  // --- Upload changed records + tombstones for deletions ---

  const pushChanges = useCallback(
    async (uid: string, localDecks: Deck[], localPlaylists: Playlist[]) => {
      const stamps = synced.current;
      const changedDecks = findChanged(localDecks, stamps.deck, deckTimestamp);
      const changedPlaylists = findChanged(localPlaylists, stamps.playlist, playlistTimestamp);
      const deletedDecks = findDeletedIds(stamps.deck.keys(), localDecks.map((d) => d.id));
      const deletedPlaylists = findDeletedIds(
        stamps.playlist.keys(),
        localPlaylists.map((p) => p.id),
      );

      const [decksOk, playlistsOk, deckDelOk, playlistDelOk] = await Promise.all([
        syncDecks(uid, changedDecks),
        syncPlaylists(uid, changedPlaylists),
        markDeleted('deck', uid, deletedDecks),
        markDeleted('playlist', uid, deletedPlaylists),
      ]);

      if (decksOk) changedDecks.forEach((d) => stamps.deck.set(d.id, deckTimestamp(d)));
      if (playlistsOk) {
        changedPlaylists.forEach((p) => stamps.playlist.set(p.id, playlistTimestamp(p)));
      }
      if (deckDelOk) deletedDecks.forEach((id) => stamps.deck.delete(id));
      if (playlistDelOk) deletedPlaylists.forEach((id) => stamps.playlist.delete(id));

      return decksOk && playlistsOk && deckDelOk && playlistDelOk;
    },
    [],
  );

  // --- Full sync cycle: fetch, merge, upload ---

  const syncNow = useCallback(async () => {
    if (!userId || inFlight.current) return;
    inFlight.current = true;
    setIsSyncing(true);

    try {
      const [cloudDecks, cloudPlaylists] = await Promise.all([
        fetchDecks(userId),
        fetchPlaylists(userId),
      ]);
      if (!cloudDecks || !cloudPlaylists) return; // backend unreachable; retry later

      const state = store.getState();
      const mergedDecks = mergeDecks(state.decks.decks, cloudDecks);
      const mergedPlaylists = mergePlaylists(state.playlists.playlists, cloudPlaylists);

      synced.current = {
        deck: liveStamps(cloudDecks),
        playlist: liveStamps(cloudPlaylists),
      };
      hasCompletedInitialSync.current = true;

      dispatch(setDecks(mergedDecks));
      dispatch(setPlaylists(mergedPlaylists));

      if (await pushChanges(userId, mergedDecks, mergedPlaylists)) {
        setLastSyncedAt(new Date());
      }
    } catch (err) {
      console.warn('[useCloudSync] syncNow failed:', err);
    } finally {
      inFlight.current = false;
      setIsSyncing(false);
    }
  }, [userId, store, dispatch, pushChanges]);

  // --- Initial sync on sign-in; reset on sign-out or user switch ---

  useEffect(() => {
    hasCompletedInitialSync.current = false;
    synced.current = { deck: new Map(), playlist: new Map() };

    if (hydrated && isAuthenticated && userId) {
      syncNow();
    }
  }, [hydrated, isAuthenticated, userId, syncNow]);

  // --- Debounced sync on local data changes ---

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !userId) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (!hasCompletedInitialSync.current) {
        await syncNow();
        return;
      }
      if (await pushChanges(userId, decks, playlists)) {
        setLastSyncedAt(new Date());
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [hydrated, isAuthenticated, userId, decks, playlists, syncNow, pushChanges]);

  return { isSyncing, lastSyncedAt, syncNow };
}

/**
 * Hook that auto-syncs Redux state with Supabase when the user is authenticated.
 *
 * - On sign-in: fetches cloud data and merges with local (cloud wins by updated_at).
 * - On local data change: debounced upload to cloud after 2 seconds of inactivity.
 * - On sign-out: stops syncing, keeps local data intact.
 *
 * Call this once at the app root level alongside usePersistence().
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { setDecks } from '@/store/decksSlice';
import { setPlaylists } from '@/store/playlistsSlice';
import {
  syncDecks,
  fetchDecks,
  syncPlaylists,
  fetchPlaylists,
} from '@/services/cloudSync';
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

// --- Merge helpers (pure functions) ---

/**
 * Merges local and cloud decks. Cloud wins when both have the same id
 * and cloud has a newer updated_at timestamp.
 */
function mergeDecks(local: Deck[], cloud: Deck[]): Deck[] {
  const merged = new Map<string, Deck>();

  for (const deck of local) {
    merged.set(deck.id, deck);
  }

  for (const cloudDeck of cloud) {
    const localDeck = merged.get(cloudDeck.id);
    if (!localDeck || cloudDeck.updatedAt > localDeck.updatedAt) {
      merged.set(cloudDeck.id, cloudDeck);
    }
  }

  return Array.from(merged.values());
}

/**
 * Merges local and cloud playlists. Cloud wins on conflict
 * (playlists lack updatedAt, so cloud always wins for duplicates).
 */
function mergePlaylists(local: Playlist[], cloud: Playlist[]): Playlist[] {
  const merged = new Map<string, Playlist>();

  for (const playlist of local) {
    merged.set(playlist.id, playlist);
  }

  for (const cloudPlaylist of cloud) {
    merged.set(cloudPlaylist.id, cloudPlaylist);
  }

  return Array.from(merged.values());
}

export function useCloudSync(): CloudSyncResult {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const decks = useAppSelector((state) => state.decks.decks);
  const playlists = useAppSelector((state) => state.playlists.playlists);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedInitialSync = useRef(false);

  // --- Full sync cycle ---

  const syncNow = useCallback(async () => {
    if (!userId) return;

    setIsSyncing(true);
    try {
      const [cloudDecks, cloudPlaylists] = await Promise.all([
        fetchDecks(userId),
        fetchPlaylists(userId),
      ]);

      const mergedDecks = mergeDecks(decks, cloudDecks);
      const mergedPlaylists = mergePlaylists(playlists, cloudPlaylists);

      dispatch(setDecks(mergedDecks));
      dispatch(setPlaylists(mergedPlaylists));

      await Promise.all([
        syncDecks(userId, mergedDecks),
        syncPlaylists(userId, mergedPlaylists),
      ]);

      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[useCloudSync] syncNow failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [userId, decks, playlists, dispatch]);

  // --- Initial sync on sign-in ---

  useEffect(() => {
    if (isAuthenticated && userId && !hasCompletedInitialSync.current) {
      hasCompletedInitialSync.current = true;
      syncNow();
    }

    if (!isAuthenticated) {
      hasCompletedInitialSync.current = false;
    }
  }, [isAuthenticated, userId, syncNow]);

  // --- Debounced sync on local data changes ---

  useEffect(() => {
    if (!isAuthenticated || !userId || !hasCompletedInitialSync.current) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        await Promise.all([
          syncDecks(userId, decks),
          syncPlaylists(userId, playlists),
        ]);
        setLastSyncedAt(new Date());
      } catch (err) {
        console.warn('[useCloudSync] debounced sync failed:', err);
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [isAuthenticated, userId, decks, playlists]);

  return { isSyncing, lastSyncedAt, syncNow };
}

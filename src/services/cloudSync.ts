import { supabase } from '@/utils/supabase';
import type { Deck, Playlist, StudentProgress } from '@/engine/types';
import {
  deckTimestamp,
  playlistTimestamp,
  type CloudRecord,
} from '@/services/syncMerge';

// --- Table contract (must match scripts/supabase-migration.sql) ---

export const SYNC_TABLES = {
  deck: { table: 'user_decks', idColumn: 'deck_id' },
  playlist: { table: 'user_playlists', idColumn: 'playlist_id' },
  progress: { table: 'user_progress', idColumn: 'progress_id' },
} as const;

/** Columns every sync table has besides its id column. */
export const SYNC_COLUMNS = ['user_id', 'data', 'updated_at', 'deleted_at'] as const;

export type SyncKind = keyof typeof SYNC_TABLES;

interface SyncRow {
  data: unknown;
  updated_at: string;
  deleted_at: string | null;
  [idColumn: string]: unknown;
}

// --- Generic operations ---

/**
 * Upserts records for a user. Clears any tombstone on the written rows.
 * Returns true on success (including the no-op case), false on failure.
 */
export async function upsertRecords<T extends { id: string }>(
  kind: SyncKind,
  userId: string,
  items: T[],
  timestampOf: (item: T) => string,
): Promise<boolean> {
  if (items.length === 0) return true;
  const { table, idColumn } = SYNC_TABLES[kind];

  const rows = items.map((item) => ({
    user_id: userId,
    [idColumn]: item.id,
    data: item,
    updated_at: timestampOf(item),
    deleted_at: null,
  }));

  try {
    const { error } = await supabase
      .from(table)
      .upsert(rows, { onConflict: `user_id,${idColumn}` });
    if (error) {
      console.warn(`[cloudSync] upsert ${table} failed:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[cloudSync] upsert ${table} error:`, err);
    return false;
  }
}

/**
 * Fetches all of a user's records, including tombstones.
 * Returns null on failure so callers can tell "empty" from "unreachable".
 */
export async function fetchRecords<T>(
  kind: SyncKind,
  userId: string,
): Promise<CloudRecord<T>[] | null> {
  const { table, idColumn } = SYNC_TABLES[kind];

  try {
    const { data, error } = await supabase
      .from(table)
      .select(`${idColumn},data,updated_at,deleted_at`)
      .eq('user_id', userId);

    if (error) {
      console.warn(`[cloudSync] fetch ${table} failed:`, error.message);
      return null;
    }

    return ((data ?? []) as SyncRow[]).map((row) => ({
      id: String(row[idColumn]),
      data: row.data as T,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    }));
  } catch (err) {
    console.warn(`[cloudSync] fetch ${table} error:`, err);
    return null;
  }
}

/** Writes tombstones for records deleted locally. */
export async function markDeleted(
  kind: SyncKind,
  userId: string,
  ids: string[],
  deletedAt: string = new Date().toISOString(),
): Promise<boolean> {
  if (ids.length === 0) return true;
  const { table, idColumn } = SYNC_TABLES[kind];

  try {
    const { error } = await supabase
      .from(table)
      .update({ deleted_at: deletedAt, updated_at: deletedAt })
      .eq('user_id', userId)
      .in(idColumn, ids);
    if (error) {
      console.warn(`[cloudSync] markDeleted ${table} failed:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[cloudSync] markDeleted ${table} error:`, err);
    return false;
  }
}

// --- Typed wrappers ---

/** Upserts user-created decks. Presets are never uploaded. */
export function syncDecks(userId: string, decks: Deck[]): Promise<boolean> {
  return upsertRecords('deck', userId, decks.filter((d) => !d.isPreset), deckTimestamp);
}

export function fetchDecks(userId: string): Promise<CloudRecord<Deck>[] | null> {
  return fetchRecords<Deck>('deck', userId);
}

/** Upserts user-created playlists. Presets are never uploaded. */
export function syncPlaylists(userId: string, playlists: Playlist[]): Promise<boolean> {
  return upsertRecords(
    'playlist',
    userId,
    playlists.filter((p) => !p.isPreset),
    playlistTimestamp,
  );
}

export function fetchPlaylists(userId: string): Promise<CloudRecord<Playlist>[] | null> {
  return fetchRecords<Playlist>('playlist', userId);
}

export function syncProgress(userId: string, progress: StudentProgress[]): Promise<boolean> {
  return upsertRecords('progress', userId, progress, (p) => p.lastActive);
}

export function fetchProgress(
  userId: string,
): Promise<CloudRecord<StudentProgress>[] | null> {
  return fetchRecords<StudentProgress>('progress', userId);
}

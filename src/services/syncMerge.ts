/**
 * Pure merge rules for cloud sync. No Supabase or React imports, so these are
 * unit-testable in isolation.
 *
 * Rules (applied per record id):
 * - Preset records are never taken from the cloud; code is authoritative.
 * - A live cloud record replaces the local one only if it is strictly newer.
 * - A cloud tombstone removes the local record unless the local copy was
 *   edited after the deletion.
 * - Local records with no cloud counterpart are kept (they upload next sync).
 */

import type { Deck, Playlist } from '@/engine/types';

/** A record as stored in the cloud, with sync metadata. */
export interface CloudRecord<T> {
  id: string;
  data: T;
  updatedAt: string;
  deletedAt: string | null;
}

interface Syncable {
  id: string;
  isPreset: boolean;
}

/** Edit timestamp used for conflict resolution. */
export function deckTimestamp(deck: Deck): string {
  return deck.updatedAt;
}

/** Edit timestamp used for conflict resolution (older data lacks updatedAt). */
export function playlistTimestamp(playlist: Playlist): string {
  return playlist.updatedAt ?? playlist.createdAt;
}

function toMillis(iso: string | null | undefined): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? 0 : ms;
}

export function mergeRecords<T extends Syncable>(
  local: T[],
  cloud: CloudRecord<T>[],
  timestampOf: (item: T) => string,
): T[] {
  const merged = new Map<string, T>();
  for (const item of local) merged.set(item.id, item);

  for (const record of cloud) {
    const existing = merged.get(record.id);
    if (existing?.isPreset || record.data?.isPreset) continue;

    if (record.deletedAt) {
      if (existing && toMillis(timestampOf(existing)) <= toMillis(record.deletedAt)) {
        merged.delete(record.id);
      }
      continue;
    }

    if (!existing || toMillis(record.updatedAt) > toMillis(timestampOf(existing))) {
      merged.set(record.id, record.data);
    }
  }

  return Array.from(merged.values());
}

export function mergeDecks(local: Deck[], cloud: CloudRecord<Deck>[]): Deck[] {
  return mergeRecords(local, cloud, deckTimestamp);
}

export function mergePlaylists(
  local: Playlist[],
  cloud: CloudRecord<Playlist>[],
): Playlist[] {
  return mergeRecords(local, cloud, playlistTimestamp);
}

/**
 * User-created items whose edit timestamp differs from the last synced one
 * (new or edited since the last successful sync).
 */
export function findChanged<T extends Syncable>(
  items: T[],
  syncedStamps: ReadonlyMap<string, string>,
  timestampOf: (item: T) => string,
): T[] {
  return items.filter((item) => !item.isPreset && syncedStamps.get(item.id) !== timestampOf(item));
}

/** Ids present in `previous` but missing from `current` (i.e. deleted locally). */
export function findDeletedIds(previous: Iterable<string>, current: Iterable<string>): string[] {
  const now = new Set(current);
  return Array.from(previous).filter((id) => !now.has(id));
}

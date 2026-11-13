import { describe, it, expect } from 'vitest';

import {
  mergeDecks,
  mergePlaylists,
  findChanged,
  findDeletedIds,
  playlistTimestamp,
  deckTimestamp,
  type CloudRecord,
} from '../../src/services/syncMerge';
import type { Deck, Playlist } from '../../src/engine/types';

const T1 = '2026-01-01T00:00:00.000Z';
const T2 = '2026-01-02T00:00:00.000Z';
const T3 = '2026-01-03T00:00:00.000Z';

function deck(id: string, updatedAt: string, extra: Partial<Deck> = {}): Deck {
  return { id, name: id, isPreset: false, columns: [], createdAt: T1, updatedAt, ...extra };
}

function playlist(id: string, extra: Partial<Playlist> = {}): Playlist {
  return { id, name: id, linkedDeckId: 'd', words: [], isPreset: false, createdAt: T1, ...extra };
}

function live<T extends { id: string }>(data: T, updatedAt: string): CloudRecord<T> {
  return { id: data.id, data, updatedAt, deletedAt: null };
}

function tombstone<T extends { id: string }>(data: T, deletedAt: string): CloudRecord<T> {
  return { id: data.id, data, updatedAt: deletedAt, deletedAt };
}

describe('mergeDecks', () => {
  it('keeps local-only decks', () => {
    expect(mergeDecks([deck('a', T1)], [])).toEqual([deck('a', T1)]);
  });

  it('adds cloud-only decks', () => {
    const cloud = deck('b', T1);
    expect(mergeDecks([], [live(cloud, T1)])).toEqual([cloud]);
  });

  it('takes the cloud copy when it is strictly newer', () => {
    const cloud = deck('a', T2, { name: 'cloud' });
    expect(mergeDecks([deck('a', T1)], [live(cloud, T2)])[0].name).toBe('cloud');
  });

  it('keeps the local copy when it is newer or equal', () => {
    const local = deck('a', T2, { name: 'local' });
    expect(mergeDecks([local], [live(deck('a', T1), T1)])[0].name).toBe('local');
    expect(mergeDecks([local], [live(deck('a', T2), T2)])[0].name).toBe('local');
  });

  it('compares timestamps chronologically, not as strings', () => {
    const local = deck('a', '2026-01-01T10:00:00+05:00'); // 05:00Z
    const cloud = deck('a', '2026-01-01T06:00:00Z', { name: 'cloud' });
    expect(mergeDecks([local], [live(cloud, cloud.updatedAt)])[0].name).toBe('cloud');
  });

  it('removes a local deck tombstoned after its last edit', () => {
    expect(mergeDecks([deck('a', T1)], [tombstone(deck('a', T1), T2)])).toEqual([]);
  });

  it('keeps a local deck edited after it was deleted elsewhere', () => {
    const local = deck('a', T3);
    expect(mergeDecks([local], [tombstone(deck('a', T1), T2)])).toEqual([local]);
  });

  it('ignores tombstones for decks not present locally', () => {
    expect(mergeDecks([], [tombstone(deck('a', T1), T2)])).toEqual([]);
  });

  it('never replaces or deletes a preset from cloud data', () => {
    const preset = deck('preset-x', T1, { isPreset: true, name: 'code' });
    const cloudNewer = deck('preset-x', T3, { name: 'cloud' });
    expect(mergeDecks([preset], [live(cloudNewer, T3)])).toEqual([preset]);
    expect(mergeDecks([preset], [tombstone(cloudNewer, T3)])).toEqual([preset]);
  });

  it('never imports a cloud record flagged as preset', () => {
    const cloudPreset = deck('preset-y', T1, { isPreset: true });
    expect(mergeDecks([], [live(cloudPreset, T1)])).toEqual([]);
  });
});

describe('mergePlaylists', () => {
  it('uses updatedAt when present', () => {
    const local = playlist('p', { updatedAt: T3, name: 'local' });
    const cloud = playlist('p', { updatedAt: T2, name: 'cloud' });
    expect(mergePlaylists([local], [live(cloud, T2)])[0].name).toBe('local');
  });

  it('falls back to createdAt for older playlists without updatedAt', () => {
    const local = playlist('p', { createdAt: T1, name: 'local' });
    const cloud = playlist('p', { updatedAt: T2, name: 'cloud' });
    expect(mergePlaylists([local], [live(cloud, T2)])[0].name).toBe('cloud');
  });

  it('protects preset playlists', () => {
    const preset = playlist('preset-cvc', { isPreset: true });
    expect(mergePlaylists([preset], [live(playlist('preset-cvc', { name: 'x' }), T3)])).toEqual([
      preset,
    ]);
  });
});

describe('timestamps', () => {
  it('deckTimestamp returns updatedAt', () => {
    expect(deckTimestamp(deck('a', T2))).toBe(T2);
  });

  it('playlistTimestamp prefers updatedAt over createdAt', () => {
    expect(playlistTimestamp(playlist('p', { updatedAt: T2 }))).toBe(T2);
    expect(playlistTimestamp(playlist('p'))).toBe(T1);
  });
});

describe('findChanged', () => {
  it('returns new and edited user items, skipping presets and unchanged', () => {
    const stamps = new Map([
      ['same', T1],
      ['edited', T1],
    ]);
    const items = [
      deck('same', T1),
      deck('edited', T2),
      deck('new', T1),
      deck('preset', T1, { isPreset: true }),
    ];
    expect(findChanged(items, stamps, deckTimestamp).map((d) => d.id)).toEqual(['edited', 'new']);
  });
});

describe('findDeletedIds', () => {
  it('returns ids that disappeared', () => {
    expect(findDeletedIds(['a', 'b', 'c'], ['a', 'c', 'd'])).toEqual(['b']);
  });

  it('returns nothing when nothing was removed', () => {
    expect(findDeletedIds([], ['a'])).toEqual([]);
  });
});

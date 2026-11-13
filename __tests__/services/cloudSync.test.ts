import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createSupabaseMock } from './supabaseMock';
import type { Deck, Playlist } from '../../src/engine/types';

const mock = createSupabaseMock();
vi.mock('@/utils/supabase', () => ({ supabase: mock.client }));

const {
  syncDecks,
  syncPlaylists,
  fetchDecks,
  fetchPlaylists,
  markDeleted,
  SYNC_TABLES,
} = await import('../../src/services/cloudSync');

const T1 = '2026-01-01T00:00:00.000Z';
const T2 = '2026-01-02T00:00:00.000Z';

const userDeck: Deck = {
  id: 'deck-1',
  name: 'Mine',
  isPreset: false,
  columns: [],
  createdAt: T1,
  updatedAt: T2,
};
const presetDeck: Deck = { ...userDeck, id: 'preset-x', isPreset: true };
const userPlaylist: Playlist = {
  id: 'playlist-1',
  name: 'Mine',
  linkedDeckId: 'deck-1',
  words: [],
  isPreset: false,
  createdAt: T1,
};

beforeEach(() => {
  mock.reset();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('syncDecks', () => {
  it('upserts user decks to user_decks keyed by (user_id, deck_id)', async () => {
    mock.respond({ error: null });
    expect(await syncDecks('u1', [userDeck, presetDeck])).toBe(true);

    expect(mock.callsTo('from')[0].args).toEqual(['user_decks']);
    const [rows, opts] = mock.callsTo('upsert')[0].args as [unknown[], unknown];
    expect(opts).toEqual({ onConflict: 'user_id,deck_id' });
    expect(rows).toEqual([
      { user_id: 'u1', deck_id: 'deck-1', data: userDeck, updated_at: T2, deleted_at: null },
    ]);
  });

  it('skips the network call when there is nothing to upload', async () => {
    expect(await syncDecks('u1', [presetDeck])).toBe(true);
    expect(mock.calls).toHaveLength(0);
  });

  it('returns false on a Supabase error', async () => {
    mock.respond({ error: { message: 'relation does not exist' } });
    expect(await syncDecks('u1', [userDeck])).toBe(false);
  });

  it('returns false when the request throws', async () => {
    mock.fail();
    expect(await syncDecks('u1', [userDeck])).toBe(false);
  });
});

describe('syncPlaylists', () => {
  it('uses createdAt as the timestamp when updatedAt is missing', async () => {
    mock.respond({ error: null });
    await syncPlaylists('u1', [userPlaylist]);
    const [rows, opts] = mock.callsTo('upsert')[0].args as [Record<string, unknown>[], unknown];
    expect(mock.callsTo('from')[0].args).toEqual(['user_playlists']);
    expect(opts).toEqual({ onConflict: 'user_id,playlist_id' });
    expect(rows[0]).toMatchObject({ playlist_id: 'playlist-1', updated_at: T1 });
  });

  it('uses updatedAt when present', async () => {
    mock.respond({ error: null });
    await syncPlaylists('u1', [{ ...userPlaylist, updatedAt: T2 }]);
    const [rows] = mock.callsTo('upsert')[0].args as [Record<string, unknown>[]];
    expect(rows[0].updated_at).toBe(T2);
  });
});

describe('fetchDecks / fetchPlaylists', () => {
  it('selects only the user’s rows, including tombstones', async () => {
    mock.respond({
      data: [
        { deck_id: 'deck-1', data: userDeck, updated_at: T2, deleted_at: null },
        { deck_id: 'deck-2', data: userDeck, updated_at: T2, deleted_at: T2 },
      ],
    });
    const records = await fetchDecks('u1');

    expect(mock.callsTo('from')[0].args).toEqual(['user_decks']);
    expect(mock.callsTo('select')[0].args).toEqual(['deck_id,data,updated_at,deleted_at']);
    expect(mock.callsTo('eq')[0].args).toEqual(['user_id', 'u1']);
    expect(records).toEqual([
      { id: 'deck-1', data: userDeck, updatedAt: T2, deletedAt: null },
      { id: 'deck-2', data: userDeck, updatedAt: T2, deletedAt: T2 },
    ]);
  });

  it('returns an empty list when the user has no rows', async () => {
    mock.respond({ data: [] });
    expect(await fetchPlaylists('u1')).toEqual([]);
  });

  it('returns null (not []) on failure so callers can tell offline from empty', async () => {
    mock.respond({ error: { message: 'down' } });
    expect(await fetchDecks('u1')).toBeNull();
    mock.fail();
    expect(await fetchPlaylists('u1')).toBeNull();
  });
});

describe('markDeleted', () => {
  it('writes a tombstone for the given ids of this user only', async () => {
    mock.respond({ error: null });
    expect(await markDeleted('playlist', 'u1', ['a', 'b'], T2)).toBe(true);

    expect(mock.callsTo('from')[0].args).toEqual(['user_playlists']);
    expect(mock.callsTo('update')[0].args).toEqual([{ deleted_at: T2, updated_at: T2 }]);
    expect(mock.callsTo('eq')[0].args).toEqual(['user_id', 'u1']);
    expect(mock.callsTo('in')[0].args).toEqual(['playlist_id', ['a', 'b']]);
  });

  it('is a no-op for an empty id list', async () => {
    expect(await markDeleted('deck', 'u1', [])).toBe(true);
    expect(mock.calls).toHaveLength(0);
  });

  it('returns false on error', async () => {
    mock.respond({ error: { message: 'nope' } });
    expect(await markDeleted('deck', 'u1', ['a'])).toBe(false);
  });
});

describe('SYNC_TABLES', () => {
  it('maps every kind to a table and id column', () => {
    expect(SYNC_TABLES).toEqual({
      deck: { table: 'user_decks', idColumn: 'deck_id' },
      playlist: { table: 'user_playlists', idColumn: 'playlist_id' },
      progress: { table: 'user_progress', idColumn: 'progress_id' },
    });
  });
});

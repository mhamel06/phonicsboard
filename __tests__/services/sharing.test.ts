import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createSupabaseMock } from './supabaseMock';
import type { Deck, Playlist } from '../../src/engine/types';

const mock = createSupabaseMock();
vi.mock('@/utils/supabase', () => ({ supabase: mock.client }));

const randomBytes = vi.fn((n: number) => new Uint8Array(n));
vi.mock('expo-crypto', () => ({ getRandomBytes: (n: number) => randomBytes(n) }));

const {
  generateShareCode,
  normalizeShareCode,
  getShareUrl,
  shareDeck,
  sharePlaylist,
  importSharedResource,
  toImportedResource,
} = await import('../../src/services/sharing');

const deck: Deck = {
  id: 'preset-combined-blends',
  name: 'Combined',
  isPreset: true,
  columns: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};
const playlist: Playlist = {
  id: 'preset-cvc-starter',
  name: 'CVC',
  linkedDeckId: 'preset-separated-blends',
  words: [{ graphemes: ['c', 'a', 't'], position: 0 }],
  isPreset: true,
  createdAt: '2025-01-01T00:00:00.000Z',
};

beforeEach(() => {
  mock.reset();
  randomBytes.mockImplementation((n: number) => new Uint8Array(n));
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('generateShareCode', () => {
  it('maps random bytes onto the 32-symbol alphabet', () => {
    randomBytes.mockReturnValueOnce(new Uint8Array([0, 1, 31, 32, 255, 8]));
    // 0→A, 1→B, 31→9, 32→A (wraps), 255→9 (255 % 32 = 31), 8→J
    expect(generateShareCode()).toBe('AB9A9J');
  });

  it('never produces ambiguous characters', () => {
    randomBytes.mockImplementation((n: number) =>
      Uint8Array.from({ length: n }, (_, i) => (i * 37) % 256),
    );
    for (let i = 0; i < 50; i++) {
      expect(generateShareCode()).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    }
  });
});

describe('normalizeShareCode', () => {
  it('trims and uppercases', () => {
    expect(normalizeShareCode('  abc234 ')).toBe('ABC234');
  });

  it('rejects malformed codes', () => {
    expect(normalizeShareCode('')).toBeNull();
    expect(normalizeShareCode('ab')).toBeNull();
    expect(normalizeShareCode('abc-12')).toBeNull();
    expect(normalizeShareCode("x' or 1=1")).toBeNull();
  });
});

describe('getShareUrl', () => {
  it('builds the production share URL', () => {
    expect(getShareUrl('ABC234')).toBe('https://phonics.staylo.io/share/ABC234');
  });
});

describe('shareDeck / sharePlaylist', () => {
  it('inserts into shared_resources with the expected columns', async () => {
    mock.respond({ error: null });
    const result = await shareDeck('u1', deck);

    expect(result).toEqual({
      shareCode: 'AAAAAA',
      shareUrl: 'https://phonics.staylo.io/share/AAAAAA',
    });
    expect(mock.callsTo('from')[0].args).toEqual(['shared_resources']);
    expect(mock.callsTo('insert')[0].args[0]).toEqual({
      share_code: 'AAAAAA',
      resource_type: 'deck',
      resource_id: deck.id,
      resource_data: deck,
      shared_by: 'u1',
    });
  });

  it('retries with a new code when the code is already taken', async () => {
    randomBytes
      .mockReturnValueOnce(new Uint8Array(6)) // AAAAAA (taken)
      .mockReturnValueOnce(new Uint8Array(6).fill(1)); // BBBBBB
    mock.respond({ error: { message: 'duplicate', code: '23505' } });
    mock.respond({ error: null });

    const result = await sharePlaylist('u1', playlist);
    expect(result.shareCode).toBe('BBBBBB');
    expect(mock.callsTo('insert')).toHaveLength(2);
  });

  it('gives up after three collisions', async () => {
    for (let i = 0; i < 3; i++) mock.respond({ error: { message: 'dup', code: '23505' } });
    await expect(shareDeck('u1', deck)).rejects.toThrow('Failed to create share link');
    expect(mock.callsTo('insert')).toHaveLength(3);
  });

  it('fails immediately on other errors', async () => {
    mock.respond({ error: { message: 'relation does not exist', code: '42P01' } });
    await expect(shareDeck('u1', deck)).rejects.toThrow('Failed to create share link');
    expect(mock.callsTo('insert')).toHaveLength(1);
  });
});

describe('importSharedResource', () => {
  it('looks up the normalized code via the get_shared_resource RPC', async () => {
    mock.respond({ data: [{ resource_type: 'playlist', resource_data: playlist }] });
    const result = await importSharedResource(' abc234 ');

    expect(mock.callsTo('rpc')[0].args).toEqual(['get_shared_resource', { code: 'ABC234' }]);
    expect(mock.callsTo('from')).toHaveLength(0); // never reads the table directly
    expect(result).toEqual({ resourceType: 'playlist', data: playlist });
  });

  it('returns null for an unknown or expired code', async () => {
    mock.respond({ data: [] });
    expect(await importSharedResource('ABC234')).toBeNull();
  });

  it('returns null without a network call for a malformed code', async () => {
    expect(await importSharedResource('??')).toBeNull();
    expect(mock.calls).toHaveLength(0);
  });

  it('rejects rows with an unknown type or missing data', async () => {
    mock.respond({ data: [{ resource_type: 'wordmat', resource_data: {} }] });
    expect(await importSharedResource('ABC234')).toBeNull();
    mock.respond({ data: [{ resource_type: 'deck', resource_data: null }] });
    expect(await importSharedResource('ABC234')).toBeNull();
  });

  it('returns null on RPC error or network failure', async () => {
    mock.respond({ error: { message: 'down' } });
    expect(await importSharedResource('ABC234')).toBeNull();
    mock.fail();
    expect(await importSharedResource('ABC234')).toBeNull();
  });
});

describe('toImportedResource', () => {
  const now = new Date('2026-11-13T12:00:00.000Z');

  it('gives an imported preset deck a fresh id and marks it user-owned', () => {
    randomBytes.mockReturnValueOnce(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
    const result = toImportedResource({ resourceType: 'deck', data: deck }, now);

    expect(result.resourceType).toBe('deck');
    expect(result.data.id).toBe(`deck-${now.getTime()}-deadbeef`);
    expect(result.data.id).not.toBe(deck.id);
    expect(result.data.isPreset).toBe(false);
    expect(result.data).toMatchObject({
      name: deck.name,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it('gives an imported playlist a fresh id and keeps its words and linked deck', () => {
    const result = toImportedResource({ resourceType: 'playlist', data: playlist }, now);
    expect(result.resourceType).toBe('playlist');
    expect(result.data.id).toMatch(/^playlist-\d+-[0-9a-f]{8}$/);
    expect(result.data).toMatchObject({
      isPreset: false,
      linkedDeckId: playlist.linkedDeckId,
      words: playlist.words,
      updatedAt: now.toISOString(),
    });
  });

  it('produces different ids when the same code is imported twice', () => {
    randomBytes
      .mockReturnValueOnce(new Uint8Array([1, 1, 1, 1]))
      .mockReturnValueOnce(new Uint8Array([2, 2, 2, 2]));
    const a = toImportedResource({ resourceType: 'playlist', data: playlist }, now);
    const b = toImportedResource({ resourceType: 'playlist', data: playlist }, now);
    expect(a.data.id).not.toBe(b.data.id);
  });
});

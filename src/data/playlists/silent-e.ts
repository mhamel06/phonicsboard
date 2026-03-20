/**
 * Silent E playlist — words with vowel-consonant-e (VCe) patterns.
 *
 * The silent e makes the preceding vowel long. Covers a_e, i_e, o_e, u_e
 * patterns from the Silent E reference (bate, nate, mide, bide, bine,
 * vite, tose, voke, lude, sume, fuse, pute, etc.).
 *
 * Linked to the Combined Blends deck.
 */

import type { Playlist, PlaylistWord } from '@/engine/types';

// ---------------------------------------------------------------------------
// Word chain data
// ---------------------------------------------------------------------------

function word(graphemes: string[], position: number): PlaylistWord {
  return { graphemes, position };
}

const words: PlaylistWord[] = [
  // a_e family
  word(['b', 'a', 'k', 'e'], 0),
  word(['l', 'a', 'k', 'e'], 1),
  word(['m', 'a', 'k', 'e'], 2),
  word(['t', 'a', 'k', 'e'], 3),
  word(['t', 'a', 'p', 'e'], 4),
  word(['c', 'a', 'n', 'e'], 5),
  word(['l', 'a', 'n', 'e'], 6),
  word(['g', 'a', 't', 'e'], 7),
  word(['l', 'a', 't', 'e'], 8),
  // i_e family
  word(['l', 'i', 'k', 'e'], 9),
  word(['b', 'i', 'k', 'e'], 10),
  word(['h', 'i', 'k', 'e'], 11),
  word(['h', 'i', 'v', 'e'], 12),
  word(['f', 'i', 'v', 'e'], 13),
  word(['l', 'i', 'n', 'e'], 14),
  word(['m', 'i', 'n', 'e'], 15),
  word(['v', 'i', 'n', 'e'], 16),
  // o_e family
  word(['b', 'o', 'n', 'e'], 17),
  word(['c', 'o', 'n', 'e'], 18),
  word(['t', 'o', 'n', 'e'], 19),
  word(['h', 'o', 'm', 'e'], 20),
  word(['d', 'o', 'm', 'e'], 21),
  word(['r', 'o', 'p', 'e'], 22),
  word(['h', 'o', 'p', 'e'], 23),
  // u_e family
  word(['c', 'u', 'b', 'e'], 24),
  word(['t', 'u', 'b', 'e'], 25),
  word(['c', 'u', 't', 'e'], 26),
  word(['m', 'u', 't', 'e'], 27),
  word(['f', 'u', 's', 'e'], 28),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const silentEPlaylist: Playlist = {
  id: 'preset-silent-e',
  name: 'Silent E',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

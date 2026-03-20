/**
 * Consonant + le playlist — words ending in consonant-le patterns.
 *
 * The final syllable is an unstressed consonant+le. Covers -ble, -cle,
 * -dle, -fle, -gle, -kle, -ple, -stle, -zle, -ckle, -tle from
 * the Consonant + le reference.
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
  // -ble
  word(['t', 'a', 'b', 'l', 'e'], 0),
  word(['a', 'b', 'l', 'e'], 1),
  word(['f', 'a', 'b', 'l', 'e'], 2),
  // -dle
  word(['c', 'a', 'n', 'd', 'l', 'e'], 3),
  word(['h', 'a', 'n', 'd', 'l', 'e'], 4),
  // -fle
  word(['r', 'a', 'f', 'f', 'l', 'e'], 5),
  word(['w', 'a', 'f', 'f', 'l', 'e'], 6),
  // -gle
  word(['g', 'i', 'g', 'g', 'l', 'e'], 7),
  word(['w', 'i', 'g', 'g', 'l', 'e'], 8),
  word(['j', 'u', 'n', 'g', 'l', 'e'], 9),
  // -kle
  word(['s', 'p', 'a', 'r', 'k', 'l', 'e'], 10),
  word(['w', 'r', 'i', 'n', 'k', 'l', 'e'], 11),
  // -ple
  word(['a', 'p', 'p', 'l', 'e'], 12),
  word(['m', 'a', 'p', 'l', 'e'], 13),
  word(['s', 'i', 'm', 'p', 'l', 'e'], 14),
  // -tle
  word(['t', 'u', 'r', 't', 'l', 'e'], 15),
  word(['b', 'o', 't', 't', 'l', 'e'], 16),
  word(['l', 'i', 't', 't', 'l', 'e'], 17),
  word(['g', 'e', 'n', 't', 'l', 'e'], 18),
  // -stle
  word(['c', 'a', 's', 't', 'l', 'e'], 19),
  word(['w', 'h', 'i', 's', 't', 'l', 'e'], 20),
  // -zle
  word(['p', 'u', 'z', 'z', 'l', 'e'], 21),
  word(['d', 'r', 'i', 'z', 'z', 'l', 'e'], 22),
  // -ckle
  word(['b', 'u', 'c', 'k', 'l', 'e'], 23),
  word(['t', 'a', 'c', 'k', 'l', 'e'], 24),
  // -cle
  word(['c', 'y', 'c', 'l', 'e'], 25),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const consonantLePlaylist: Playlist = {
  id: 'preset-consonant-le',
  name: 'Consonant + le',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

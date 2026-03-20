/**
 * R-Controlled playlist — word chain using ar, er, ir, or, ur patterns.
 *
 * Covers all five r-controlled vowel sounds with single-syllable words.
 * Expanded from original chain to include patterns from the R-Controlled
 * reference (dar, lar, mar, char, snar, ber, per, ster, gir, thir, shir,
 * bor, cor, dor, spor, cur, hur, mur, stur, parm, dorm, tort).
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
  // ar patterns
  word(['f', 'ar', 'm'], 0),
  word(['h', 'ar', 'm'], 1),
  word(['ch', 'ar', 'm'], 2),
  word(['h', 'ar', 'd'], 3),
  word(['c', 'ar', 'd'], 4),
  word(['d', 'ar', 'k'], 5),
  word(['l', 'ar', 'k'], 6),
  word(['m', 'ar', 'k'], 7),
  word(['st', 'ar'], 8),
  word(['st', 'ar', 't'], 9),
  // or patterns
  word(['c', 'or', 'd'], 10),
  word(['c', 'or', 'n'], 11),
  word(['b', 'or', 'n'], 12),
  word(['h', 'or', 'n'], 13),
  word(['sh', 'or', 't'], 14),
  word(['sp', 'or', 't'], 15),
  word(['f', 'or', 't'], 16),
  word(['n', 'or', 'th'], 17),
  // ir / er patterns
  word(['g', 'ir', 'l'], 18),
  word(['b', 'ir', 'd'], 19),
  word(['th', 'ir', 'd'], 20),
  word(['sh', 'ir', 't'], 21),
  word(['h', 'er', 'd'], 22),
  word(['h', 'er', 'b'], 23),
  word(['p', 'er', 'ch'], 24),
  word(['st', 'er', 'n'], 25),
  // ur patterns
  word(['b', 'ur', 'n'], 26),
  word(['t', 'ur', 'n'], 27),
  word(['c', 'ur', 'l'], 28),
  word(['h', 'ur', 'l'], 29),
  word(['t', 'ur', 'f'], 30),
  word(['s', 'ur', 'f'], 31),
  word(['p', 'ur', 'r'], 32),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const rControlledPlaylist: Playlist = {
  id: 'preset-r-controlled',
  name: 'R-Controlled',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

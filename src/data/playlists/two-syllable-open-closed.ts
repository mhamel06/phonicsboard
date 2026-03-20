/**
 * 2 Syllable (Open/Closed) playlist — first syllable open, second closed.
 *
 * The first syllable ends in a vowel (long), the second ends in a consonant (short).
 * Words are broken into individual letter graphemes for blending practice.
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
  word(['r', 'o', 'b', 'o', 't'], 0),
  word(['r', 'o', 'b', 'i', 'n'], 1),
  word(['c', 'a', 'b', 'i', 'n'], 2),
  word(['b', 'a', 's', 'i', 'n'], 3),
  word(['b', 'a', 'c', 'o', 'n'], 4),
  word(['b', 'i', 's', 'o', 'n'], 5),
  word(['l', 'e', 'm', 'o', 'n'], 6),
  word(['m', 'e', 'l', 'o', 'n'], 7),
  word(['p', 'i', 'l', 'o', 't'], 8),
  word(['m', 'u', 's', 'i', 'c'], 9),
  word(['b', 'a', 's', 'i', 'c'], 10),
  word(['t', 'o', 'p', 'i', 'c'], 11),
  word(['t', 'o', 'n', 'i', 'c'], 12),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const twoSyllableOpenClosedPlaylist: Playlist = {
  id: 'preset-2-syllable-open-closed',
  name: '2 Syllable (Open/Closed)',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

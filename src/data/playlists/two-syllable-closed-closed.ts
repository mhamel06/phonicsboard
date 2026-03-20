/**
 * 2 Syllable (Closed/Closed) playlist — two closed syllables per word.
 *
 * Each syllable ends in a consonant, keeping the vowel short.
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
  word(['b', 'o', 'n', 'n', 'e', 't'], 0),
  word(['s', 'o', 'n', 'n', 'e', 't'], 1),
  word(['s', 'u', 'n', 'n', 'e', 't'], 2),    // sunnet (word chain bridge)
  word(['s', 'u', 'n', 's', 'e', 't'], 3),
  word(['s', 'u', 'b', 'm', 'i', 't'], 4),
  word(['s', 'u', 'm', 'm', 'i', 't'], 5),
  word(['r', 'a', 'b', 'b', 'i', 't'], 6),
  word(['b', 'a', 's', 'k', 'e', 't'], 7),
  word(['g', 'a', 's', 'k', 'e', 't'], 8),
  word(['n', 'a', 'p', 'k', 'i', 'n'], 9),
  word(['p', 'u', 'm', 'p', 'k', 'i', 'n'], 10),
  word(['m', 'u', 'f', 'f', 'i', 'n'], 11),
  word(['k', 'i', 't', 't', 'e', 'n'], 12),
  word(['m', 'i', 't', 't', 'e', 'n'], 13),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const twoSyllableClosedClosedPlaylist: Playlist = {
  id: 'preset-2-syllable-closed-closed',
  name: '2 Syllable (Closed/Closed)',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

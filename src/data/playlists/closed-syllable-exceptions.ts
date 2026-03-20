/**
 * Closed Syllable Exceptions playlist — closed syllables with unexpected long vowels.
 *
 * Normally closed syllables have short vowels, but these common patterns
 * (ild, ind, old, olt, ost, oll) break the rule with long vowel sounds.
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
  word(['w', 'i', 'l', 'd'], 0),
  word(['m', 'i', 'l', 'd'], 1),
  word(['ch', 'i', 'l', 'd'], 2),
  word(['f', 'i', 'n', 'd'], 3),
  word(['k', 'i', 'n', 'd'], 4),
  word(['m', 'i', 'n', 'd'], 5),
  word(['b', 'i', 'n', 'd'], 6),
  word(['o', 'l', 'd'], 7),
  word(['c', 'o', 'l', 'd'], 8),
  word(['g', 'o', 'l', 'd'], 9),
  word(['b', 'o', 'l', 'd'], 10),
  word(['f', 'o', 'l', 'd'], 11),
  word(['h', 'o', 'l', 'd'], 12),
  word(['t', 'o', 'l', 'd'], 13),
  word(['r', 'o', 'l', 'l'], 14),
  word(['p', 'o', 'l', 'l'], 15),
  word(['t', 'o', 'l', 'l'], 16),
  word(['b', 'o', 'l', 't'], 17),
  word(['c', 'o', 'l', 't'], 18),
  word(['j', 'o', 'l', 't'], 19),
  word(['m', 'o', 'st'], 20),
  word(['p', 'o', 'st'], 21),
  word(['h', 'o', 'st'], 22),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const closedSyllableExceptionsPlaylist: Playlist = {
  id: 'preset-closed-syll-exceptions',
  name: 'Closed Syll. Exceptions',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

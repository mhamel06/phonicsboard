/**
 * Open Syllables playlist — words featuring open syllable patterns.
 *
 * Open syllables end in a vowel, making the vowel long (says its name).
 * Covers all five vowels plus y, with blends and digraphs as onsets,
 * matching the Open Syllables reference (ca, da, fa… be, de… bi, di…
 * bo, co… bu, cu… dy, fy, hy, ny).
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
  // Open a
  word(['g', 'o'], 0),
  word(['n', 'o'], 1),
  word(['s', 'o'], 2),
  word(['pr', 'o'], 3),
  // Open e
  word(['m', 'e'], 4),
  word(['h', 'e'], 5),
  word(['sh', 'e'], 6),
  word(['w', 'e'], 7),
  word(['b', 'e'], 8),
  // Open i
  word(['h', 'i'], 9),
  word(['sk', 'i'], 10),
  // Open y
  word(['b', 'y'], 11),
  word(['m', 'y'], 12),
  word(['fl', 'y'], 13),
  word(['tr', 'y'], 14),
  word(['cr', 'y'], 15),
  word(['dr', 'y'], 16),
  word(['sk', 'y'], 17),
  word(['sp', 'y'], 18),
  word(['fr', 'y'], 19),
  word(['sh', 'y'], 20),
  word(['sl', 'y'], 21),
  // Open u
  word(['fl', 'u'], 22),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const openSyllablesPlaylist: Playlist = {
  id: 'preset-open-syllables',
  name: 'Open Syllables',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Open Syllables playlist — words featuring open syllable patterns.
 *
 * Open syllables end in a vowel, making the vowel long (says its name).
 * Chain progresses from simple CV to multisyllable open patterns.
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
  word(['g', 'o'], 0),
  word(['n', 'o'], 1),
  word(['s', 'o'], 2),
  word(['m', 'e'], 3),
  word(['h', 'e'], 4),
  word(['sh', 'e'], 5),
  word(['w', 'e'], 6),
  word(['b', 'e'], 7),
  word(['b', 'y'], 8),
  word(['m', 'y'], 9),
  word(['h', 'i'], 10),
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

/**
 * Vowel Teams Practice playlist — original word chain.
 *
 * Each consecutive word differs by exactly one phoneme (onset, medial, or coda).
 * Chain: rain → main → mean → bean → beat → boat → coat → goat → goal → coal → coil → foil → fail → tail
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
  word(['r', 'ai', 'n'], 0),
  word(['m', 'ai', 'n'], 1),
  word(['m', 'ea', 'n'], 2),
  word(['b', 'ea', 'n'], 3),
  word(['b', 'ea', 't'], 4),
  word(['b', 'oa', 't'], 5),
  word(['c', 'oa', 't'], 6),
  word(['g', 'oa', 't'], 7),
  word(['g', 'oa', 'l'], 8),
  word(['c', 'oa', 'l'], 9),
  word(['c', 'oi', 'l'], 10),
  word(['f', 'oi', 'l'], 11),
  word(['f', 'ai', 'l'], 12),
  word(['t', 'ai', 'l'], 13),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const vowelTeamsPlaylist: Playlist = {
  id: 'preset-vowel-teams',
  name: 'Vowel Teams Practice',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

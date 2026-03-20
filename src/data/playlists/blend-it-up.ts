/**
 * Blend It Up playlist — original word chain using consonant blends.
 *
 * Each consecutive word differs by exactly one phoneme (onset blend, medial, or coda).
 * Chain: trip → grip → drip → drop → crop → prop → plop → plot → slot → slop → stop → step → stem
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
  word(['tr', 'i', 'p'], 0),
  word(['gr', 'i', 'p'], 1),
  word(['dr', 'i', 'p'], 2),
  word(['dr', 'o', 'p'], 3),
  word(['cr', 'o', 'p'], 4),
  word(['pr', 'o', 'p'], 5),
  word(['pl', 'o', 'p'], 6),
  word(['pl', 'o', 't'], 7),
  word(['sl', 'o', 't'], 8),
  word(['sl', 'o', 'p'], 9),
  word(['st', 'o', 'p'], 10),
  word(['st', 'e', 'p'], 11),
  word(['st', 'e', 'm'], 12),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const blendItUpPlaylist: Playlist = {
  id: 'preset-blend-it-up',
  name: 'Blend It Up',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

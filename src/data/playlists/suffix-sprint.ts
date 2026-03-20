/**
 * Suffix Sprint playlist — original word chain featuring ending patterns
 * (ng, nk, sk, st, sh).
 *
 * Each consecutive word differs by exactly one phoneme (onset, medial, or coda/ending).
 * Chain: ring → sing → sang → bang → bank → bunk → dunk → dusk → dust → must → mist → fist → fish → dish
 *
 * Linked to the Separated Blends deck.
 */

import type { Playlist, PlaylistWord } from '@/engine/types';

// ---------------------------------------------------------------------------
// Word chain data
// ---------------------------------------------------------------------------

function word(graphemes: string[], position: number): PlaylistWord {
  return { graphemes, position };
}

const words: PlaylistWord[] = [
  word(['r', 'i', 'ng'], 0),
  word(['s', 'i', 'ng'], 1),
  word(['s', 'a', 'ng'], 2),
  word(['b', 'a', 'ng'], 3),
  word(['b', 'a', 'nk'], 4),
  word(['b', 'u', 'nk'], 5),
  word(['d', 'u', 'nk'], 6),
  word(['d', 'u', 'sk'], 7),
  word(['d', 'u', 'st'], 8),
  word(['m', 'u', 'st'], 9),
  word(['m', 'i', 'st'], 10),
  word(['f', 'i', 'st'], 11),
  word(['f', 'i', 'sh'], 12),
  word(['d', 'i', 'sh'], 13),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const suffixSprintPlaylist: Playlist = {
  id: 'preset-suffix-sprint',
  name: 'Suffix Sprint',
  linkedDeckId: 'preset-separated-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

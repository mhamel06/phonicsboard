/**
 * R-Controlled playlist — original word chain using ar, er, ir, or, ur patterns.
 *
 * Each consecutive word differs by exactly one phoneme (onset, r-controlled vowel, or coda).
 * Chain: farm → harm → hard → card → cord → corn → born → barn → burn → turn → turf → surf → serf
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
  word(['f', 'ar', 'm'], 0),
  word(['h', 'ar', 'm'], 1),
  word(['h', 'ar', 'd'], 2),
  word(['c', 'ar', 'd'], 3),
  word(['c', 'or', 'd'], 4),
  word(['c', 'or', 'n'], 5),
  word(['b', 'or', 'n'], 6),
  word(['b', 'ar', 'n'], 7),
  word(['b', 'ur', 'n'], 8),
  word(['t', 'ur', 'n'], 9),
  word(['t', 'ur', 'f'], 10),
  word(['s', 'ur', 'f'], 11),
  word(['s', 'er', 'f'], 12),
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

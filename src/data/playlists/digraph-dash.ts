/**
 * Digraph Dash playlist — original word chain using digraphs (ch, sh, th, wh).
 *
 * Each consecutive word differs by exactly one phoneme (onset digraph, medial, or coda).
 * Chain: chip → ship → shop → chop → chap → chat → that → than → thin → shin → chin → chit → whit
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
  word(['ch', 'i', 'p'], 0),
  word(['sh', 'i', 'p'], 1),
  word(['sh', 'o', 'p'], 2),
  word(['ch', 'o', 'p'], 3),
  word(['ch', 'a', 'p'], 4),
  word(['ch', 'a', 't'], 5),
  word(['th', 'a', 't'], 6),
  word(['th', 'a', 'n'], 7),
  word(['th', 'i', 'n'], 8),
  word(['sh', 'i', 'n'], 9),
  word(['ch', 'i', 'n'], 10),
  word(['ch', 'i', 't'], 11),
  word(['wh', 'i', 't'], 12),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const digraphDashPlaylist: Playlist = {
  id: 'preset-digraph-dash',
  name: 'Digraph Dash',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

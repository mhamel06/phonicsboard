/**
 * CVC Starter playlist — original word chain for beginning readers.
 *
 * Each consecutive word differs by exactly one phoneme (onset, medial, or coda).
 * Chain: pig -> big -> bag -> bat -> cat -> cap -> cup -> pup -> pun -> pin -> pit -> sit -> sip
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
  word(['p', 'i', 'g'], 0),
  word(['b', 'i', 'g'], 1),
  word(['b', 'a', 'g'], 2),
  word(['b', 'a', 't'], 3),
  word(['c', 'a', 't'], 4),
  word(['c', 'a', 'p'], 5),
  word(['c', 'u', 'p'], 6),
  word(['p', 'u', 'p'], 7),
  word(['p', 'u', 'n'], 8),
  word(['p', 'i', 'n'], 9),
  word(['p', 'i', 't'], 10),
  word(['s', 'i', 't'], 11),
  word(['s', 'i', 'p'], 12),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const cvcStarterPlaylist: Playlist = {
  id: 'preset-cvc-starter',
  name: 'CVC Starter',
  linkedDeckId: 'preset-separated-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

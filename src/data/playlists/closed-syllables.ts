/**
 * Closed Syllables playlist — words built from closed syllable patterns.
 *
 * Closed syllables end in a consonant, keeping the vowel short.
 * Progresses from CVC through CCVC and CVCC patterns, covering the
 * rime families in the Closed Syllables reference (ab, eb, ib, ob, ub,
 * ac, ad, af, ag, am, an, ap, et, it, ot, ut, etc.).
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
  // -ab family
  word(['c', 'a', 'b'], 0),
  word(['g', 'r', 'a', 'b'], 1),
  word(['c', 'r', 'a', 'b'], 2),
  // -ag family
  word(['d', 'r', 'a', 'g'], 3),
  word(['f', 'l', 'a', 'g'], 4),
  // -am / -amp family
  word(['c', 'l', 'a', 'm'], 5),
  word(['c', 'l', 'a', 'mp'], 6),
  word(['s', 't', 'a', 'mp'], 7),
  // -an / -and family
  word(['p', 'l', 'a', 'n'], 8),
  word(['s', 't', 'a', 'n', 'd'], 9),
  // -ap family
  word(['s', 'n', 'a', 'p'], 10),
  word(['t', 'r', 'a', 'p'], 11),
  word(['s', 't', 'r', 'a', 'p'], 12),
  // -ip / -it family
  word(['g', 'r', 'i', 'p'], 13),
  word(['t', 'r', 'i', 'p'], 14),
  word(['s', 't', 'r', 'i', 'p'], 15),
  // -op / -ot family
  word(['d', 'r', 'o', 'p'], 16),
  word(['c', 'r', 'o', 'p'], 17),
  word(['s', 't', 'o', 'p'], 18),
  word(['s', 't', 'o', 'mp'], 19),
  // -ub / -ug family
  word(['s', 'c', 'r', 'u', 'b'], 20),
  word(['s', 'h', 'r', 'u', 'g'], 21),
  // -ump / -ust family
  word(['s', 't', 'u', 'mp'], 22),
  word(['c', 'r', 'u', 'st'], 23),
  // -ect / -ept family
  word(['s', 'p', 'e', 'ck'], 24),
  word(['w', 'r', 'e', 'ck'], 25),
];

// ---------------------------------------------------------------------------
// Playlist export
// ---------------------------------------------------------------------------

export const closedSyllablesPlaylist: Playlist = {
  id: 'preset-closed-syllables',
  name: 'Closed Syllables',
  linkedDeckId: 'preset-combined-blends',
  words,
  isPreset: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

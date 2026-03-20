import type { Deck, Grapheme, GraphemeType, TileColor } from '../../engine/types';

// --- Helper ---

function g(
  col: number,
  text: string,
  type: GraphemeType,
  color: TileColor,
): Grapheme {
  const slug = text.replace(/\s/g, '');
  return { id: `cmb-c${col}-${slug}`, text, type, color };
}

// --- Column 1: consonants + blends ---

const col1Texts = [
  'b', 'bl', 'br', 'c', 'cl', 'cr', 'd', 'dr',
  'f', 'fl', 'fr', 'g', 'gl', 'gr', 'h', 'j',
  'k', 'l', 'm', 'n', 'p', 'pl', 'pr', 'r',
  's', 'sc', 'scr', 'sk', 'sl', 'sm', 'sn', 'sp',
  'st', 'str', 'sw', 't', 'tr', 'tw', 'v', 'w', 'y', 'z',
];

function col1Type(t: string): GraphemeType {
  return t.length > 1 ? 'blend' : 'consonant';
}

function col1Color(t: string): TileColor {
  return t.length > 1 ? 'green' : 'pink';
}

const col1Graphemes: Grapheme[] = col1Texts.map((t) =>
  g(1, t, col1Type(t), col1Color(t)),
);

// --- Column 2: vowels + vowel teams ---

const col2Vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

const col2Teams = [
  'ai', 'ay', 'ea', 'ee', 'ei', 'eigh', 'ie', 'igh',
  'oa', 'oe', 'ow', 'au', 'augh', 'aw', 'ew',
  'oi', 'oo', 'ou', 'ough',
];

const col2Graphemes: Grapheme[] = [
  ...col2Vowels.map((t) => g(2, t, 'vowel', 'orange')),
  ...col2Teams.map((t) => g(2, t, 'vowel_team', 'orange')),
];

// --- Column 3: final sounds + ending blends ---

const col3Texts = [
  'b', 'c', 'ct', 'd', 'f', 'ff', 'ft', 'g',
  'k', 'l', 'll', 'lb', 'ld', 'lf', 'lk', 'lp',
  'lt', 'm', 'mp', 'n', 'nd', 'nt', 'p', 'pt',
  'r', 's', 'ss', 'sk', 'sp', 'st', 't', 'y',
];

function col3Type(t: string): GraphemeType {
  return t.length > 1 ? 'blend' : 'consonant';
}

const col3Graphemes: Grapheme[] = col3Texts.map((t) =>
  g(3, t, col3Type(t), 'pink'),
);

// --- Column 4: silent e ---

const col4Graphemes: Grapheme[] = [
  g(4, 'e', 'vowel', 'orange'),
];

// --- Column 5: suffixes ---

const col5Graphemes: Grapheme[] = [
  g(5, 'es', 'suffix', 'lavender'),
  g(5, 's', 'suffix', 'lavender'),
];

// --- Deck export ---

export const combinedBlendsDeck: Deck = {
  id: 'preset-combined-blends',
  name: 'Combined Blends',
  isPreset: true,
  columns: [
    {
      id: 'cmb-col-1',
      position: 0,
      graphemes: col1Graphemes,
      isCollapsed: false,
    },
    {
      id: 'cmb-col-2',
      position: 1,
      graphemes: col2Graphemes,
      isCollapsed: false,
    },
    {
      id: 'cmb-col-3',
      position: 2,
      graphemes: col3Graphemes,
      isCollapsed: false,
    },
    {
      id: 'cmb-col-4',
      position: 3,
      graphemes: col4Graphemes,
      isCollapsed: false,
    },
    {
      id: 'cmb-col-5',
      position: 4,
      graphemes: col5Graphemes,
      isCollapsed: false,
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

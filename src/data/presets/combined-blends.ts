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

// --- Column 1: consonants + blends + digraphs ---

const col1Consonants = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k',
  'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z',
];

const col1Blends = [
  'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl',
  'gr', 'pl', 'pr', 'sc', 'scr', 'sk', 'sl', 'sm',
  'sn', 'sp', 'st', 'str', 'sw', 'tr', 'tw',
];

const col1Digraphs = [
  'ch', 'gn', 'kn', 'ph', 'qu', 'sh', 'shr', 'th', 'thr', 'wh', 'wr',
];

const col1Graphemes: Grapheme[] = [
  ...col1Consonants.map((t) => g(1, t, 'consonant', 'green')),
  ...col1Blends.map((t) => g(1, t, 'blend', 'green')),
  ...col1Digraphs.map((t) => g(1, t, 'digraph', 'pink')),
];

// --- Column 2: vowels + vowel teams ---

const col2Vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

const col2Teams = [
  'ai', 'ay', 'ea', 'ee', 'ei', 'eigh', 'ie', 'igh',
  'oa', 'oe', 'ow', 'au', 'augh', 'aw', 'ew',
  'oi', 'oo', 'ou', 'ough',
];

const col2RControlled = ['ar', 'er', 'ir', 'or', 'ore', 'ur'];

const col2Graphemes: Grapheme[] = [
  ...col2Vowels.map((t) => g(2, t, 'vowel', 'orange')),
  ...col2Teams.map((t) => g(2, t, 'vowel_team', 'orange')),
  ...col2RControlled.map((t) => g(2, t, 'r_controlled', 'orange')),
];

// --- Column 3: final sounds + ending blends + final digraphs ---

const col3Consonants = [
  'b', 'c', 'd', 'f', 'g', 'k', 'l', 'm',
  'n', 'p', 'r', 's', 't', 'y',
];

const col3Blends = [
  'ct', 'ff', 'ft', 'll', 'lb', 'ld', 'lf', 'lk',
  'lp', 'lt', 'mp', 'nd', 'nt', 'pt', 'ss', 'sk',
  'sp', 'st',
];

const col3Digraphs = [
  'ch', 'ck', 'dge', 'mb', 'nch', 'ng', 'tch', 'th',
];

const col3Graphemes: Grapheme[] = [
  ...col3Consonants.map((t) => g(3, t, 'consonant', 'teal')),
  ...col3Blends.map((t) => g(3, t, 'blend', 'teal')),
  ...col3Digraphs.map((t) => g(3, t, 'digraph', 'pink')),
];

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

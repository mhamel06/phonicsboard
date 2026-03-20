import type { Deck, Grapheme, GraphemeType, TileColor } from '../../engine/types';

// --- Helper ---

function g(
  prefix: string,
  col: number,
  text: string,
  type: GraphemeType,
  color: TileColor,
): Grapheme {
  const slug = text.replace(/\s/g, '');
  return { id: `${prefix}-c${col}-${slug}`, text, type, color };
}

// --- Column 1: initial consonants + digraphs ---

const P = 'sep'; // prefix

const col1Consonants = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k',
  'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z',
];

const col1Digraphs = [
  'ch', 'kn', 'ph', 'sh', 'th', 'qu', 'wh', 'wr',
];

const col1Graphemes: Grapheme[] = [
  ...col1Consonants.map((t) => g(P, 1, t, 'consonant', 'pink')),
  ...col1Digraphs.map((t) => g(P, 1, t, 'digraph', 'pink')),
];

// --- Column 2: blends ---

const col2Texts = [
  'c', 'cr', 'k', 'l', 'm', 'n', 'p', 'pl', 'pr',
  'qu', 'r', 's', 't', 'tr', 'w',
];

const col2Graphemes: Grapheme[] = col2Texts.map((t) => {
  const isBlend = t.length > 1 && t !== 'qu';
  const type: GraphemeType = isBlend ? 'blend' : 'consonant';
  const color: TileColor = isBlend ? 'green' : 'green';
  return g(P, 2, t, type, color);
});

// --- Column 3: vowels + vowel teams + r-controlled + diphthongs ---

const col3Vowels = ['a', 'e', 'i', 'o', 'u'];

const col3Teams = [
  'ai', 'ay', 'ea', 'ee', 'ei', 'igh', 'oa', 'ue', 'ui', 'y',
];

const col3RControlled = ['ar', 'or', 'ur', 'er', 'ir'];

const col3Diphthongs = ['au', 'aw', 'ew', 'oi', 'oy', 'ou', 'ow', 'oo'];

const col3Graphemes: Grapheme[] = [
  ...col3Vowels.map((t) => g(P, 3, t, 'vowel', 'orange')),
  ...col3Teams.map((t) => g(P, 3, t, 'vowel_team', 'orange')),
  ...col3RControlled.map((t) => g(P, 3, t, 'r_controlled', 'teal')),
  ...col3Diphthongs.map((t) => g(P, 3, t, 'vowel_team', 'teal')),
];

// --- Column 4: medial consonants ---

const col4Texts = ['c', 'f', 'l', 'm', 'n', 'p', 's', 'x'];

const col4Graphemes: Grapheme[] = col4Texts.map((t) =>
  g(P, 4, t, 'consonant', 'teal'),
);

// --- Column 5: final consonants + final digraphs ---

const col5Consonants = [
  'b', 'c', 'd', 'ff', 'g', 'k', 'll', 'm',
  'n', 'p', 'r', 's', 'ss', 't', 'v', 'x', 'z', 'zz',
];

const col5Digraphs = [
  'ch', 'ck', 'dge', 'ng', 'ph', 'sh', 'th', 'tch',
];

const col5Graphemes: Grapheme[] = [
  ...col5Consonants.map((t) => g(P, 5, t, 'consonant', 'pink')),
  ...col5Digraphs.map((t) => g(P, 5, t, 'digraph', 'pink')),
];

// --- Column 6: suffixes ---

const col6Texts = ['e', 'es', 's'];

const col6Graphemes: Grapheme[] = col6Texts.map((t) =>
  g(P, 6, t, 'suffix', 'lavender'),
);

// --- Deck export ---

export const separatedBlendsDeck: Deck = {
  id: 'preset-separated-blends',
  name: 'Separated Blends',
  isPreset: true,
  columns: [
    {
      id: 'sep-col-1',
      position: 0,
      graphemes: col1Graphemes,
      isCollapsed: false,
    },
    {
      id: 'sep-col-2',
      position: 1,
      graphemes: col2Graphemes,
      isCollapsed: false,
    },
    {
      id: 'sep-col-3',
      position: 2,
      graphemes: col3Graphemes,
      isCollapsed: false,
    },
    {
      id: 'sep-col-4',
      position: 3,
      graphemes: col4Graphemes,
      isCollapsed: false,
    },
    {
      id: 'sep-col-5',
      position: 4,
      graphemes: col5Graphemes,
      isCollapsed: false,
    },
    {
      id: 'sep-col-6',
      position: 5,
      graphemes: col6Graphemes,
      isCollapsed: false,
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

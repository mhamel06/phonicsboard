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

// --- Column data ---

const col1Texts = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k',
  'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z',
];

const col2Texts = [
  'c', 'cr', 'k', 'l', 'm', 'n', 'p', 'pl', 'pr',
  'qu', 'r', 's', 't', 'tr', 'w',
];

const col3Texts = [
  'a', 'e', 'i', 'o', 'u',
  'ai', 'ay', 'ea', 'ee', 'ei', 'igh', 'oa', 'ue', 'ui', 'y',
];

const col4Texts = ['c', 'f', 'l', 'm', 'n', 'p', 's', 'x'];

const col5Texts = [
  'b', 'c', 'd', 'ff', 'g', 'k', 'll', 'm',
  'n', 'p', 'r', 's', 'ss', 't', 'v', 'x',
];

const col6Texts = ['e', 'es', 's'];

// --- Build grapheme arrays ---

const P = 'sep'; // prefix

const col1Graphemes: Grapheme[] = col1Texts.map((t) =>
  g(P, 1, t, 'consonant', 'pink'),
);

const col2Graphemes: Grapheme[] = col2Texts.map((t) => {
  const isBlend = t.length > 1 && t !== 'qu';
  const type: GraphemeType = isBlend ? 'blend' : 'consonant';
  const color: TileColor = isBlend ? 'green' : 'green';
  return g(P, 2, t, type, color);
});

const col3Graphemes: Grapheme[] = col3Texts.map((t) => {
  const isTeam = t.length > 1;
  return g(P, 3, t, isTeam ? 'vowel_team' : 'vowel', 'orange');
});

const col4Graphemes: Grapheme[] = col4Texts.map((t) =>
  g(P, 4, t, 'consonant', 'teal'),
);

const col5Graphemes: Grapheme[] = col5Texts.map((t) =>
  g(P, 5, t, 'consonant', 'pink'),
);

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

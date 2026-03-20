import type { Grapheme, TileColor, WordMatPreset } from '../../engine/types';

// --- Helper ---

function tile(
  group: string,
  text: string,
  type: Grapheme['type'],
  color: TileColor,
): Grapheme {
  const slug = text.replace(/\s/g, '').replace(/\u0259/, 'schwa');
  return { id: `swf-${group}-${slug}`, text, type, color };
}

// --- Consonants ---

const consonantLetters = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm',
  'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z',
];

const consonantTiles: Grapheme[] = consonantLetters.map((l) =>
  tile('con', l, 'consonant', 'blue'),
);

// --- Digraphs ---

const digraphTexts = ['ch', 'ph', 'sh', 'th', 'wh'];

const digraphTiles: Grapheme[] = digraphTexts.map((t) =>
  tile('dig', t, 'digraph', 'orange'),
);

// --- Special endings ---

const endingTexts = ['ck', 'dge', 'ng', 'nk', 'tch'];

const endingTiles: Grapheme[] = endingTexts.map((t) =>
  tile('end', t, 'digraph', 'orange'),
);

// --- Vowels ---

const vowelLetters = ['a', 'e', 'i', 'o', 'u', 'y'];

const vowelTiles: Grapheme[] = vowelLetters.map((l) =>
  tile('vow', l, 'vowel', 'green'),
);

// --- R-controlled vowels ---

const rControlledTexts = ['ar', 'er', 'ir', 'or', 'ur'];

const rControlledTiles: Grapheme[] = rControlledTexts.map((t) =>
  tile('rc', t, 'r_controlled', 'teal'),
);

// --- Schwa ---

const schwaTile: Grapheme = tile('sch', '\u0259', 'schwa', 'purple');

// --- Heart tile ---

const heartTile: Grapheme = tile('hrt', '\u2665', 'heart', 'red');

// --- Export ---

export const schwaFocusPreset: WordMatPreset = {
  id: 'preset-schwa-focus',
  name: 'Schwa Focus',
  keyboard: [
    { label: 'Consonants', tiles: consonantTiles },
    { label: 'Digraphs', tiles: digraphTiles },
    { label: 'Special Endings', tiles: endingTiles },
    { label: 'Vowels', tiles: vowelTiles },
    { label: 'R-Controlled', tiles: rControlledTiles },
    { label: 'Other', tiles: [schwaTile, heartTile] },
  ],
};

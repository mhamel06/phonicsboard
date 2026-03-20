import type { Grapheme, TileColor, WordMatPreset } from '../../engine/types';

// --- Helpers ---

function tile(
  id: string,
  text: string,
  type: Grapheme['type'],
  color: TileColor,
): Grapheme {
  return { id, text, type, color };
}

function consonant(letter: string): Grapheme {
  return tile(`az-con-${letter}`, letter, 'consonant', 'blue');
}

function vowel(letter: string): Grapheme {
  return tile(`az-vow-${letter}`, letter, 'vowel', 'green');
}

// --- Row 1: vowels ---

const vowelTiles: Grapheme[] = ['a', 'e', 'i', 'o', 'u', 'y'].map(vowel);

// --- Rows 2-4: consonants ---

const consonantLetters = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k',
  'l', 'm', 'n', 'p', 'q', 'r', 's', 't',
  'v', 'w', 'x', 'z',
];

const consonantTiles: Grapheme[] = consonantLetters.map(consonant);

// --- Blank tiles (6 colors) ---

const blankColors: { color: TileColor; label: string }[] = [
  { color: 'yellow', label: 'yellow' },
  { color: 'teal', label: 'teal' },
  { color: 'red', label: 'red' },
  { color: 'purple', label: 'purple' },
  { color: 'pink', label: 'pink' },
  { color: 'orange', label: 'orange' },
];

const blankTiles: Grapheme[] = blankColors.map(({ color, label }) =>
  tile(`az-blank-${label}`, '', 'blank', color),
);

// --- Heart tile ---

const heartTile: Grapheme = tile('az-heart', '\u2665', 'heart', 'red');

// --- Export ---

export const azTilesPreset: WordMatPreset = {
  id: 'preset-az-tiles',
  name: 'A-Z Tiles',
  keyboard: [
    { label: 'Vowels', tiles: vowelTiles },
    { label: 'Consonants', tiles: consonantTiles },
    { label: 'Blanks', tiles: [...blankTiles, heartTile] },
  ],
};

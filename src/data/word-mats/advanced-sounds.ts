import type { Grapheme, TileColor, WordMatPreset } from '../../engine/types';

// --- Helper ---

function tile(
  group: string,
  text: string,
  type: Grapheme['type'],
  color: TileColor,
): Grapheme {
  const slug = text.replace(/\s/g, '').replace(/ə/, 'schwa');
  return { id: `adv-${group}-${slug}`, text, type, color };
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

const digraphTexts = ['ch', 'ph', 'qu', 'sh', 'th', 'wh'];

const digraphTiles: Grapheme[] = digraphTexts.map((t) =>
  tile('dig', t, 'digraph', 'orange'),
);

// --- Special endings ---

const endingTexts = ['ck', 'dge', 'ng', 'nk', 'tch'];

const endingTiles: Grapheme[] = endingTexts.map((t) =>
  tile('end', t, 'digraph', 'orange'),
);

// --- Short vowels ---

const shortVowelLetters = ['a', 'e', 'i', 'o', 'u', 'y'];

const shortVowelTiles: Grapheme[] = shortVowelLetters.map((l) =>
  tile('sv', l, 'vowel', 'green'),
);

// --- R-controlled vowels ---

const rControlledTexts = ['ar', 'er', 'ir', 'or', 'ur'];

const rControlledTiles: Grapheme[] = rControlledTexts.map((t) =>
  tile('rc', t, 'r_controlled', 'teal'),
);

// --- Vowel teams ---

const vowelTeamTexts = ['ai', 'ay', 'ea', 'ee', 'oa', 'ow', 'igh'];

const vowelTeamTiles: Grapheme[] = vowelTeamTexts.map((t) =>
  tile('vt', t, 'vowel_team', 'teal'),
);

// --- Diphthongs ---

const diphthongTexts = ['au', 'aw', 'oi', 'oo', 'oy', 'ou', 'ow'];

const diphthongTiles: Grapheme[] = diphthongTexts.map((t) =>
  tile('dp', t, 'vowel_team', 'teal'),
);

// --- Suffixes ---

const suffixTexts = ['es', 'ing', 'ed'];

const suffixTiles: Grapheme[] = suffixTexts.map((t) =>
  tile('sfx', t, 'suffix', 'purple'),
);

// --- Schwa ---

const schwaTile: Grapheme = tile('sch', '\u0259', 'schwa', 'purple');

// --- Heart tile ---

const heartTile: Grapheme = tile('hrt', '\u2665', 'heart', 'red');

// --- Export ---

export const advancedSoundsPreset: WordMatPreset = {
  id: 'preset-advanced-sounds',
  name: 'Advanced Sounds',
  keyboard: [
    { label: 'Consonants', tiles: consonantTiles },
    { label: 'Digraphs', tiles: digraphTiles },
    { label: 'Special Endings', tiles: endingTiles },
    { label: 'Short Vowels', tiles: shortVowelTiles },
    { label: 'R-Controlled', tiles: rControlledTiles },
    { label: 'Vowel Teams', tiles: vowelTeamTiles },
    { label: 'Diphthongs', tiles: diphthongTiles },
    { label: 'Suffixes', tiles: suffixTiles },
    { label: 'Other', tiles: [schwaTile, heartTile] },
  ],
};

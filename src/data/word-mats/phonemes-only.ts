import type { Grapheme, TileColor, WordMatPreset } from '../../engine/types';

// --- Helper ---

function blankTile(color: TileColor, label: string): Grapheme {
  return {
    id: `pho-blank-${label}`,
    text: '',
    type: 'blank',
    color,
  };
}

// --- 6 colored blank tiles ---

const blankTiles: Grapheme[] = [
  blankTile('yellow', 'yellow'),
  blankTile('teal', 'teal'),
  blankTile('red', 'red'),
  blankTile('purple', 'purple'),
  blankTile('pink', 'pink'),
  blankTile('orange', 'orange'),
];

// --- Export ---

export const phonemesOnlyPreset: WordMatPreset = {
  id: 'preset-phonemes-only',
  name: 'Phonemes Only',
  keyboard: [
    { label: 'Sound Blocks', tiles: blankTiles },
  ],
};

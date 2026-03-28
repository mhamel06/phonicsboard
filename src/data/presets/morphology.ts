import type { Deck, Grapheme, GraphemeType, TileColor } from '../../engine/types';

// --- Helper ---

function g(
  col: number,
  text: string,
  type: GraphemeType,
  color: TileColor,
): Grapheme {
  const slug = text.replace(/\s/g, '');
  return { id: `morph-c${col}-${slug}`, text, type, color };
}

// --- Column 1: Prefixes ---

const col1Texts = [
  'circum', 'con', 'bi', 'com', 'pre', 'over', 'hyper', 'inter',
  'auto', 'be', 'ex', 'post', 'il', 'im', 'super', 'fore',
  'trans', 'maxi', 'anti', 'sub', 'pan', 'em', 'micro', 'ab',
  'co', 'de', 'pro', 'ad', 're', 'in', 'mal', 'un',
  'with', 'retro', 'ortho', 'dys', 'dis', 'para', 'cyber', 'non',
  'ultra', 'tri', 'mis', 'uni', 'semi', 'poly', 'multi', 'aero',
  'tele', 'astro', 'contra', 'eco',
];

const col1Graphemes: Grapheme[] = col1Texts.map((t) =>
  g(1, t, 'prefix', 'pink'),
);

// --- Column 2: Roots ---

const col2Texts = [
  'run', 'write', 'ject', 'spond', 'flex', 'sense', 'value', 'like',
  'miss', 'appoint', 'appear', 'ease', 'approve', 'function', 'bride', 'globe',
  'star', 'free', 'lustrate', 'literate', 'plode', 'print', 'perfect', 'complete',
  'clude', 'vite', 'accept', 'compete', 'differ', 'do', 'able', 'fit',
  'stop', 'stick', 'messy', 'sail', 'new', 'found', 'act', 'teach',
  'scary', 'trait', 'wise', 'body', 'hero', 'war', 'flate', 'cide',
  'tract', 'press', 'real', 'tour', 'agree', 'pay', 'state', 'achieve',
  'pire', 'ploy', 'rage', 'tangle', 'sure', 'court', 'friend', 'kin',
  'happy', 'dark', 'kind', 'sect', 'rupt', 'port', 'plant', 'fer',
  'mathematic', 'beauty', 'constitute', 'elect', 'confuse', 'collide', 'infuse', 'delete',
  'sleep', 'look', 'confident', 'joy', 'active', 'sensitive', 'ventilate', 'alert',
  'sad', 'easy', 'quick', 'love', 'play', 'erase', 'shout', 'greet',
  'view', 'judge', 'caution', 'mature', 'cast', 'shadow', 'tell', 'head',
  'smart', 'close', 'silly', 'man', 'human', 'market', 'Buddha', 'race',
  'magnet', 'strength', 'rot', 'shave', 'broke', 'due', 'divide', 'mit',
  'scribe', 'boy', 'style', 'self', 'fool', 'mobile', 'pilot', 'graph',
  'biography', 'exist', 'operate', 'use', 'fear', 'harm', 'price', 'fuse',
  'spire', 'cave', 'bine', 'pete', 'pute', 'pose', 'mix', 'couch',
  'lash', 'mess', 'try', 'fly', 'party', 'penny', 'spect', 'vent',
  'navigate', 'wife', 'cuse', 'child', 'baby', 'dog', 'spoon', 'cheer',
  'skill', 'lone', 'awe', 'trouble', 'two', 'coat', 'mize', 'mum',
  'scope', 'wave', 'bus', 'biology', 'depend', 'excel', 'import', 'script',
  'date', 'industrial', 'claim', 'trude', 'rate', 'glamor', 'moment', 'thunder',
  'normal', 'sent', 'hold', 'out', 'draw', 'expense', 'pass', 'victory',
  'injury', 'envy', 'focal', 'cycle', 'plane', 'athlete', 'angle', 'fold',
  'back', 'to', 'after', 'north', 'space', 'security', 'naut', 'sister',
  'neighbor', 'content', 'formed', 'odorous', 'post', 'store', 'volt', 'cir',
  'cube', 'loved', 'medic', 'norm', 'legal', 'atom', 'base', 'America',
  'demic', 'theism', 'electric', 'toxic', 'authentic', 'dontist', 'dox', 'graphy',
  'grati', 'soli', 'multi', 'gram', 'lect', 'meter', 'picture', 'statue',
  'thermo', 'centi', 'speedo',
];

const col2Graphemes: Grapheme[] = col2Texts.map((t) =>
  g(2, t, 'root', 'orange'),
);

// --- Column 3: Suffixes ---

const col3Texts = [
  'able', 'hood', 'al', 'ly', 'age', 'cle', 'ant', 'cule',
  'ence', 'dom', 'like', 'ent', 'ship', 'er', 'ous', 'est',
  'esque', 'ful', 'ible', 'ic', 'sion', 'tion', 'icity', 'ed',
  'cian', 'ing', 'ist', 'ish', 'ism', 'some', 'less', 'tude',
  'ward', 'ment', 'meter', 'ness', 'or', 'en', 'ies', 'ied',
  'cial', 'ive', 'tial', 'ious', 'ure', 'ance', 'ial', 'ally',
  'ier', 'cious', 'tious', 'cide', 'ate', 'ite', 'ory', 'ice',
  'land', 'ary', 'cracy',
];

const col3Graphemes: Grapheme[] = col3Texts.map((t) =>
  g(3, t, 'suffix', 'lavender'),
);

// --- Deck export ---

export const morphologyDeck: Deck = {
  id: 'preset-morphology',
  name: 'Morphology (Prefixes, Roots, Suffixes)',
  isPreset: true,
  columns: [
    {
      id: 'morph-col-1',
      position: 0,
      graphemes: col1Graphemes,
      isCollapsed: false,
    },
    {
      id: 'morph-col-2',
      position: 1,
      graphemes: col2Graphemes,
      isCollapsed: false,
    },
    {
      id: 'morph-col-3',
      position: 2,
      graphemes: col3Graphemes,
      isCollapsed: false,
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

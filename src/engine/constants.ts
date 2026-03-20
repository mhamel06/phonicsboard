import type { GraphemeType, TileColor } from './types';

// === Tile Color Mappings ===

/** Default tile color for each grapheme type */
export const TILE_COLORS: Record<GraphemeType, TileColor> = {
  consonant: 'blue',
  vowel: 'green',
  blend: 'blue',
  digraph: 'orange',
  vowel_team: 'teal',
  r_controlled: 'teal',
  suffix: 'purple',
  schwa: 'green',
  heart: 'pink',
  blank: 'white',
} as const;

/** Hex values for each tile color */
export const TILE_COLOR_HEX: Record<TileColor, string> = {
  blue: '#7C9CBF',
  green: '#81B29A',
  orange: '#E9C46A',
  teal: '#2A9D8F',
  purple: '#9B8EC4',
  pink: '#F4A6C1',
  lavender: '#C4B5E0',
  yellow: '#F2CC8F',
  white: '#FFFFFF',
  red: '#E07A5F',
  peach: '#F5C7A9',
} as const;

// === Vowel Graphemes ===

/** All vowel graphemes (single letters and multi-letter patterns) */
const VOWEL_GRAPHEMES_LIST: readonly string[] = [
  // Single vowels
  'a', 'e', 'i', 'o', 'u', 'y',
  // Vowel teams
  'ai', 'ay', 'ea', 'ee', 'ei', 'igh', 'oa', 'ue', 'ui', 'oo', 'ow', 'oy', 'ou',
  // Diphthongs
  'au', 'aw',
  // R-controlled vowels
  'ar', 'er', 'ir', 'or', 'ur',
] as const;

/** Set of all vowel graphemes for fast lookup */
export const VOWEL_GRAPHEMES = new Set<string>(VOWEL_GRAPHEMES_LIST);

// === App Design System Colors ===

/** Application-level color palette from the design system */
export const APP_COLORS = {
  background: '#FFF8F0',
  primary: '#2D6A4F',
  secondary: '#E07A5F',
  accent: '#F2CC8F',
  surface: '#FFFFFF',
  textPrimary: '#264653',
  textSecondary: '#6B7280',
} as const;

// === Constraints ===

/** Maximum number of columns in a deck */
export const MAX_COLUMNS = 6;

/** Maximum character length for a grapheme's text */
export const MAX_GRAPHEME_LENGTH = 5;

// === Classification Sets ===

/** Common consonant blends for classification */
export const CONSONANT_BLENDS = new Set<string>([
  'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr',
  'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st',
  'sw', 'tr', 'tw', 'scr', 'spl', 'spr', 'str', 'squ',
]);

/** Common consonant digraphs for classification */
export const CONSONANT_DIGRAPHS = new Set<string>([
  'ch', 'sh', 'th', 'wh', 'ph', 'ck', 'ng', 'kn', 'wr', 'gn',
]);

/** Common vowel teams for classification */
export const VOWEL_TEAMS = new Set<string>([
  'ai', 'ay', 'ea', 'ee', 'ei', 'igh', 'oa', 'ue', 'ui', 'oo',
  'ow', 'oy', 'ou', 'au', 'aw',
]);

/** R-controlled vowel patterns */
export const R_CONTROLLED = new Set<string>([
  'ar', 'er', 'ir', 'or', 'ur',
]);

/** Common suffixes for classification */
export const SUFFIXES = new Set<string>([
  'ed', 'es', 'er', 'est', 'ing', 'ly', 'ful', 'less', 'ness',
  'ment', 'tion', 'sion', 'able', 'ible', 'ous', 'ive',
]);

/** Single vowel letters */
export const SINGLE_VOWELS = new Set<string>([
  'a', 'e', 'i', 'o', 'u', 'y',
]);

/** Single consonant letters */
export const SINGLE_CONSONANTS = new Set<string>([
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm',
  'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z',
]);

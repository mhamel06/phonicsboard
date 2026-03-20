import type { Grapheme, GraphemeType, TileColor } from './types';
import {
  TILE_COLORS,
  VOWEL_GRAPHEMES,
  CONSONANT_BLENDS,
  CONSONANT_DIGRAPHS,
  VOWEL_TEAMS,
  R_CONTROLLED,
  SUFFIXES,
  SINGLE_VOWELS,
  SINGLE_CONSONANTS,
} from './constants';

/**
 * Returns true if the grapheme is classified as a vowel type
 * (vowel, vowel_team, r_controlled, or schwa).
 */
export function isVowel(grapheme: Grapheme): boolean {
  return (
    grapheme.type === 'vowel' ||
    grapheme.type === 'vowel_team' ||
    grapheme.type === 'r_controlled' ||
    grapheme.type === 'schwa'
  );
}

/**
 * Returns true if the grapheme is classified as a consonant type
 * (consonant, blend, or digraph).
 */
export function isConsonant(grapheme: Grapheme): boolean {
  return (
    grapheme.type === 'consonant' ||
    grapheme.type === 'blend' ||
    grapheme.type === 'digraph'
  );
}

/**
 * Returns the default tile color for a given grapheme type.
 */
export function getDefaultColor(type: GraphemeType): TileColor {
  return TILE_COLORS[type];
}

/**
 * Auto-classifies a grapheme text string into its GraphemeType.
 *
 * Classification priority (highest to lowest):
 * 1. R-controlled vowels (ar, er, ir, or, ur)
 * 2. Vowel teams (ai, ea, ee, etc.)
 * 3. Consonant digraphs (ch, sh, th, etc.)
 * 4. Consonant blends (bl, cr, tr, etc.)
 * 5. Suffixes (ed, ing, tion, etc.)
 * 6. Single vowels (a, e, i, o, u, y)
 * 7. Single consonants (b, c, d, etc.)
 * 8. Falls back to 'consonant' for unrecognized patterns
 */
export function classifyGrapheme(text: string): GraphemeType {
  const normalized = text.toLowerCase().trim();

  if (normalized.length === 0) {
    return 'blank';
  }

  // R-controlled vowels take priority over other multi-letter patterns
  if (R_CONTROLLED.has(normalized)) {
    return 'r_controlled';
  }

  // Vowel teams
  if (VOWEL_TEAMS.has(normalized)) {
    return 'vowel_team';
  }

  // Consonant digraphs
  if (CONSONANT_DIGRAPHS.has(normalized)) {
    return 'digraph';
  }

  // Consonant blends
  if (CONSONANT_BLENDS.has(normalized)) {
    return 'blend';
  }

  // Suffixes (check after digraphs/blends since some overlap like "er")
  if (SUFFIXES.has(normalized)) {
    return 'suffix';
  }

  // Single vowels
  if (SINGLE_VOWELS.has(normalized)) {
    return 'vowel';
  }

  // Single consonants
  if (SINGLE_CONSONANTS.has(normalized)) {
    return 'consonant';
  }

  // Multi-letter patterns not in known sets: check if all vowel characters
  if (VOWEL_GRAPHEMES.has(normalized)) {
    return 'vowel_team';
  }

  // Default fallback for unrecognized patterns
  return 'consonant';
}

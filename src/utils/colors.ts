/**
 * Color palette and theme constants for PhonicsBoard.
 *
 * Warm, earthy palette — distinct from Blend Reading's blue gradients.
 * See docs/ARCHITECTURE.md Section 5 for full design system spec.
 */

import type { GraphemeType } from '@/engine/types';

// ---------------------------------------------------------------------------
// App-wide colors
// ---------------------------------------------------------------------------

export const APP_COLORS = {
  /** Warm cream/off-white background */
  background: '#FFF8F0',
  /** Forest green — primary action color */
  primary: '#2D6A4F',
  /** Warm coral — secondary action color */
  secondary: '#E07A5F',
  /** Golden yellow — accent / highlight */
  accent: '#F2CC8F',
  /** White — card/surface background */
  surface: '#FFFFFF',
  /** Dark charcoal — primary text */
  textPrimary: '#264653',
  /** Warm gray — secondary/muted text */
  textSecondary: '#6B7280',
} as const;

// ---------------------------------------------------------------------------
// Tile colors — one hex per GraphemeType
// ---------------------------------------------------------------------------

export const TILE_COLORS: Record<GraphemeType, string> = {
  consonant: '#7C9CBF',
  vowel: '#E07A5F',
  blend: '#81B29A',
  digraph: '#E9C46A',
  vowel_team: '#2A9D8F',
  r_controlled: '#9B8EC4',
  prefix: '#F4A6C1',
  root: '#E9C46A',
  suffix: '#C4B5E0',
  schwa: '#9B8EC4',
  heart: '#E07A5F',
  blank: '#9CA3AF',
} as const;

/**
 * Returns the hex color for a given grapheme type.
 * Falls back to blank color for unknown types.
 */
export function getTileColor(type: GraphemeType): string {
  return TILE_COLORS[type] ?? TILE_COLORS.blank;
}

// ---------------------------------------------------------------------------
// Display colors — used in CardSlot for the active word row
// ---------------------------------------------------------------------------

/** Gold background for vowel card slots */
export const VOWEL_DISPLAY_COLOR = '#F2CC8F';

// ---------------------------------------------------------------------------
// TileColor → hex mapping — used by the deck editor color palette
// ---------------------------------------------------------------------------

import type { TileColor } from '@/engine/types';

export const TILE_COLOR_HEX: Record<TileColor, string> = {
  white: '#FFFFFF',
  pink: '#F4A6C1',
  teal: '#2A9D8F',
  peach: '#F4B69C',
  red: '#E07A5F',
  green: '#81B29A',
  purple: '#9B8EC4',
  yellow: '#F2CC8F',
  blue: '#7C9CBF',
  orange: '#E9C46A',
  lavender: '#C4B5E0',
} as const;

/** All tile colors available for the editor palette */
export const EDITOR_PALETTE_COLORS: TileColor[] = [
  'white',
  'pink',
  'teal',
  'peach',
  'red',
  'green',
  'purple',
  'yellow',
] as const;

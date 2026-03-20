/**
 * Reusable phonics tile component.
 *
 * Renders a rounded rectangle colored by grapheme type.
 * Touch-friendly (min 48 px), with optional selection highlight.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import type { Grapheme } from '@/engine/types';
import { getTileColor, TILE_COLOR_HEX } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TileProps {
  /** The grapheme to display */
  grapheme: Grapheme;
  /** Tap handler — tile is inert when omitted */
  onPress?: () => void;
  /** Visual size preset */
  size?: 'small' | 'medium' | 'large';
  /** Whether the tile is currently selected */
  isSelected?: boolean;
  /** Display scale factor for projector/classroom use (default 1.0) */
  scale?: number;
  /** Layout mode: 'grid' uses fixed square sizing, 'list' (default) stretches full width */
  layout?: 'grid' | 'list';
}

// ---------------------------------------------------------------------------
// Size presets
// ---------------------------------------------------------------------------

const SIZE_MAP: Record<
  'small' | 'medium' | 'large',
  { minSize: number; fontSize: number; paddingH: number; paddingV: number }
> = {
  small: { minSize: 48, fontSize: 16, paddingH: 8, paddingV: 6 },
  medium: { minSize: 56, fontSize: 22, paddingH: 14, paddingV: 10 },
  large: { minSize: 72, fontSize: 30, paddingH: 20, paddingV: 14 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Fixed dimensions for grid layout mode (roughly square tiles) */
const GRID_TILE_WIDTH = 52;
const GRID_TILE_HEIGHT = 48;

export default function Tile({
  grapheme,
  onPress,
  size = 'medium',
  isSelected = false,
  scale = 1.0,
  layout = 'list',
}: TileProps) {
  const dimensions = SIZE_MAP[size];
  // Prefer the grapheme's explicit color field; fall back to type-based color
  const bgColor = grapheme.color
    ? (TILE_COLOR_HEX[grapheme.color] ?? getTileColor(grapheme.type))
    : getTileColor(grapheme.type);

  // Apply scale, but enforce minimum 44px touch target
  const scaledMinSize = Math.max(44, dimensions.minSize * scale);
  const scaledPaddingH = dimensions.paddingH * scale;
  const scaledPaddingV = dimensions.paddingV * scale;
  const scaledFontSize = dimensions.fontSize * scale;
  const scaledBorderRadius = 10 * scale;

  const containerStyle: ViewStyle =
    layout === 'grid'
      ? {
          width: GRID_TILE_WIDTH * scale,
          height: GRID_TILE_HEIGHT * scale,
          minWidth: 44,
          minHeight: 44,
          backgroundColor: bgColor,
          borderWidth: isSelected ? 3 : 0,
          borderColor: isSelected ? '#264653' : 'transparent',
        }
      : {
          minWidth: scaledMinSize,
          minHeight: scaledMinSize,
          paddingHorizontal: scaledPaddingH,
          paddingVertical: scaledPaddingV,
          backgroundColor: bgColor,
          borderWidth: isSelected ? 3 : 0,
          borderColor: isSelected ? '#264653' : 'transparent',
        };

  const gridFontSize = layout === 'grid' ? 14 * scale : scaledFontSize;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        { borderRadius: scaledBorderRadius },
        pressed && onPress ? styles.pressed : undefined,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Tile ${grapheme.text}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[styles.label, { fontSize: gridFontSize }]}
        numberOfLines={1}
      >
        {grapheme.text}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    fontWeight: '700',
    textAlign: 'center',
  },
});

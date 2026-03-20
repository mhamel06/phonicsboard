/**
 * Reusable phonics tile component.
 *
 * Renders a rounded rectangle colored by grapheme type.
 * Touch-friendly (min 48 px), with optional selection highlight.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import type { Grapheme } from '@/engine/types';
import { getTileColor } from '@/utils/colors';

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

export default function Tile({
  grapheme,
  onPress,
  size = 'medium',
  isSelected = false,
}: TileProps) {
  const dimensions = SIZE_MAP[size];
  const bgColor = getTileColor(grapheme.type);

  const containerStyle: ViewStyle = {
    minWidth: dimensions.minSize,
    minHeight: dimensions.minSize,
    paddingHorizontal: dimensions.paddingH,
    paddingVertical: dimensions.paddingV,
    backgroundColor: bgColor,
    borderWidth: isSelected ? 3 : 0,
    borderColor: isSelected ? '#264653' : 'transparent',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && onPress ? styles.pressed : undefined,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Tile ${grapheme.text}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[styles.label, { fontSize: dimensions.fontSize }]}
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

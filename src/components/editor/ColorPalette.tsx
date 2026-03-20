/**
 * Vertical color picker sidebar for the deck editor.
 *
 * Renders 8 circular color swatches in a vertical strip.
 * The selected color shows a check mark overlay.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { TileColor } from '@/engine/types';
import { TILE_COLOR_HEX, EDITOR_PALETTE_COLORS } from '@/utils/colors';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColorPaletteProps {
  /** Currently selected color */
  selectedColor: TileColor;
  /** Called when the user taps a color swatch */
  onColorSelect: (color: TileColor) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ColorPalette({
  selectedColor,
  onColorSelect,
}: ColorPaletteProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Color</Text>
      {EDITOR_PALETTE_COLORS.map((color) => {
        const isSelected = color === selectedColor;
        const hex = TILE_COLOR_HEX[color];
        const needsBorder = color === 'white';

        return (
          <Pressable
            key={color}
            onPress={() => onColorSelect(color)}
            style={({ pressed }) => [
              styles.swatch,
              {
                backgroundColor: hex,
                borderWidth: needsBorder || isSelected ? 2 : 0,
                borderColor: isSelected
                  ? APP_COLORS.textPrimary
                  : needsBorder
                    ? '#D1D5DB'
                    : 'transparent',
              },
              pressed ? styles.pressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${color} color`}
            accessibilityState={{ selected: isSelected }}
          >
            {isSelected && (
              <Feather
                name="check"
                size={18}
                color={needsBorder ? APP_COLORS.textPrimary : '#FFFFFF'}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 10,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },
});

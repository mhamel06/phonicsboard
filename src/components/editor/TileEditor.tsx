/**
 * Editable tile for the deck editor.
 *
 * Renders a color-coded tile with an inline TextInput for editing
 * the grapheme text. Shows a delete button when selected.
 */

import React, { useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Grapheme, TileColor } from '@/engine/types';
import { TILE_COLOR_HEX } from '@/utils/colors';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TileEditorProps {
  /** The grapheme being edited */
  grapheme: Grapheme;
  /** Called when the user changes the grapheme text */
  onTextChange: (text: string) => void;
  /** Called when the user deletes this tile */
  onDelete: () => void;
  /** Called when the user taps the color indicator */
  onColorChange: (color: TileColor) => void;
  /** Whether this tile is currently selected for color changes */
  isSelected?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TileEditor({
  grapheme,
  onTextChange,
  onDelete,
  onColorChange,
  isSelected = false,
}: TileEditorProps) {
  const inputRef = useRef<TextInput>(null);
  const bgColor = TILE_COLOR_HEX[grapheme.color];
  const isLight = grapheme.color === 'white' || grapheme.color === 'yellow';
  const textColor = isLight ? APP_COLORS.textPrimary : '#FFFFFF';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
        isSelected ? styles.selected : undefined,
      ]}
    >
      {/* Delete button */}
      <Pressable
        onPress={onDelete}
        style={styles.deleteButton}
        accessibilityRole="button"
        accessibilityLabel={`Delete tile ${grapheme.text}`}
        hitSlop={6}
      >
        <Feather name="x" size={14} color={textColor} />
      </Pressable>

      {/* Text input */}
      <TextInput
        ref={inputRef}
        value={grapheme.text}
        onChangeText={(val) => {
          if (val.length <= 5) {
            onTextChange(val);
          }
        }}
        maxLength={5}
        style={[styles.textInput, { color: textColor }]}
        selectTextOnFocus
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={`Grapheme text: ${grapheme.text}`}
      />

      {/* Color indicator — tap to signal color change */}
      <Pressable
        onPress={() => onColorChange(grapheme.color)}
        style={[
          styles.colorDot,
          {
            backgroundColor: bgColor,
            borderColor: isLight ? '#D1D5DB' : 'rgba(255,255,255,0.5)',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Change tile color"
        hitSlop={6}
      >
        <Feather name="droplet" size={10} color={textColor} />
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 4,
  },
  selected: {
    borderWidth: 3,
    borderColor: APP_COLORS.textPrimary,
  },
  deleteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Nunito',
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 30,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

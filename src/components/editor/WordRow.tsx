/**
 * Single word row in the playlist editor.
 *
 * Renders a horizontal row of text inputs (one per column/position),
 * reorder arrows on the left, and a delete button on the right.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { PlaylistWord } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WordRowProps {
  /** The playlist word to render */
  word: PlaylistWord;
  /** Number of grapheme columns (matches linked deck) */
  columnCount: number;
  /** Remove this word from the playlist */
  onDelete: () => void;
  /** Move this word up in the chain */
  onMoveUp: () => void;
  /** Move this word down in the chain */
  onMoveDown: () => void;
  /** Called when a grapheme text is edited at a given position */
  onGraphemeChange: (position: number, text: string) => void;
  /** Which position is currently active (for highlight) */
  activePosition?: number;
  /** Called when user taps a slot to make it active */
  onSlotPress?: (position: number) => void;
  /** Whether this row is the currently active row being edited */
  isActiveRow?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WordRow({
  word,
  columnCount,
  onDelete,
  onMoveUp,
  onMoveDown,
  onGraphemeChange,
  activePosition,
  onSlotPress,
  isActiveRow,
}: WordRowProps) {
  // Build array of slot values, padding to columnCount
  const slots: string[] = [];
  for (let i = 0; i < columnCount; i++) {
    slots.push(word.graphemes[i] ?? '');
  }

  return (
    <View style={[styles.row, isActiveRow && styles.rowActive]}>
      {/* Reorder arrows */}
      <View style={styles.arrows}>
        <Pressable
          onPress={onMoveUp}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move word up"
        >
          <Feather name="chevron-up" size={18} color={APP_COLORS.textSecondary} />
        </Pressable>
        <Pressable
          onPress={onMoveDown}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move word down"
        >
          <Feather name="chevron-down" size={18} color={APP_COLORS.textSecondary} />
        </Pressable>
      </View>

      {/* Word number */}
      <Text style={styles.wordIndex}>{word.position + 1}.</Text>

      {/* Grapheme input slots */}
      <View style={styles.slots}>
        {slots.map((value, index) => (
          <Pressable
            key={`slot-${index}`}
            onPress={() => onSlotPress?.(index)}
            style={styles.slotWrapper}
          >
            <TextInput
              style={[
                styles.slotInput,
                activePosition === index && styles.slotInputActive,
              ]}
              value={value}
              onChangeText={(text) => onGraphemeChange(index, text)}
              onFocus={() => onSlotPress?.(index)}
              placeholder="-"
              placeholderTextColor="#D1D5DB"
              maxLength={5}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={`Grapheme position ${index + 1}`}
            />
          </Pressable>
        ))}
      </View>

      {/* Delete button */}
      <Pressable
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deletePressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Delete word"
      >
        <Feather name="x" size={18} color={APP_COLORS.secondary} />
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  rowActive: {
    borderLeftColor: APP_COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  arrows: {
    marginRight: 8,
    gap: 2,
  },
  arrowButton: {
    padding: 4,
    borderRadius: 6,
  },
  arrowPressed: {
    backgroundColor: '#F3F4F6',
  },
  wordIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    width: 28,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  slots: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  slotWrapper: {
    flex: 1,
  },
  slotInput: {
    height: 48,
    minWidth: 48,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: APP_COLORS.textPrimary,
    backgroundColor: '#FAFAFA',
  },
  slotInputActive: {
    borderColor: APP_COLORS.primary,
    borderStyle: 'solid',
    backgroundColor: '#F0FDF4',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
  },
  deletePressed: {
    backgroundColor: '#FEE2E2',
  },
});

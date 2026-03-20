/**
 * Single word row in the playlist editor.
 *
 * Renders a horizontal row of text inputs (one per visible column/position),
 * reorder arrows on the left, and a delete button on the right.
 * Each slot has a small X button above it to hide that column for this word.
 * A "+" button at the end lets the user restore hidden columns.
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
  /** Called when a column is toggled on/off for this word */
  onToggleColumn?: (position: number) => void;
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
  onToggleColumn,
}: WordRowProps) {


  // Determine which columns are active
  const allColumns = Array.from({ length: columnCount }, (_, i) => i);
  const activeColumns = word.activeColumns ?? allColumns;
  const hiddenColumns = allColumns.filter((i) => !activeColumns.includes(i));

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

      {/* Grapheme input slots — only visible columns */}
      <View style={styles.slots}>
        {activeColumns.map((colIndex) => {
          const value = word.graphemes[colIndex] ?? '';
          return (
            <View key={`slot-${colIndex}`} style={styles.slotColumn}>
              {/* Hide column button */}
              {onToggleColumn && activeColumns.length > 1 && (
                <Pressable
                  onPress={() => onToggleColumn(colIndex)}
                  style={({ pressed }) => [
                    styles.hideColumnButton,
                    pressed && styles.hideColumnPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Hide column ${colIndex + 1}`}
                >
                  <Feather name="x" size={12} color={APP_COLORS.textSecondary} />
                </Pressable>
              )}
              <Pressable
                onPress={() => onSlotPress?.(colIndex)}
                style={styles.slotWrapper}
              >
                <TextInput
                  style={[
                    styles.slotInput,
                    activePosition === colIndex && styles.slotInputActive,
                  ]}
                  value={value}
                  onChangeText={(text) => onGraphemeChange(colIndex, text)}
                  onFocus={() => onSlotPress?.(colIndex)}
                  placeholder="-"
                  placeholderTextColor="#D1D5DB"
                  maxLength={5}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel={`Grapheme position ${colIndex + 1}`}
                />
              </Pressable>
            </View>
          );
        })}

        {/* Restore next hidden column button */}
        {hiddenColumns.length > 0 && onToggleColumn && (
          <Pressable
            onPress={() => onToggleColumn(hiddenColumns[0])}
            style={({ pressed }) => [
              styles.restoreButton,
              pressed && styles.restoreButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Restore column ${hiddenColumns[0] + 1}`}
          >
            <Feather name="plus" size={16} color={APP_COLORS.primary} />
          </Pressable>
        )}
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
    alignItems: 'flex-end',
  },
  slotColumn: {
    flex: 1,
    alignItems: 'center',
  },
  slotWrapper: {
    width: '100%',
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
  hideColumnButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  hideColumnPressed: {
    backgroundColor: '#FEE2E2',
  },
  restoreButton: {
    width: 32,
    height: 48,
    borderWidth: 2,
    borderColor: APP_COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
  },
  restoreButtonPressed: {
    backgroundColor: '#DEF7EC',
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

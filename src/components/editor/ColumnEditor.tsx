/**
 * Column editor for the deck editor.
 *
 * Renders a vertical list of TileEditor components for a single DeckColumn,
 * with controls for adding/removing tiles and reordering the column.
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { DeckColumn } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import TileEditor from './TileEditor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColumnEditorProps {
  /** The deck column to edit */
  column: DeckColumn;
  /** Called when the user taps "+" to add a new tile */
  onAddTile: () => void;
  /** Called when a tile is deleted */
  onDeleteTile: (graphemeId: string) => void;
  /** Called when a tile's text is changed */
  onUpdateTile: (graphemeId: string, text: string) => void;
  /** Called when the column is moved left or right */
  onMoveColumn: (direction: 'left' | 'right') => void;
  /** Called when the entire column is deleted */
  onDeleteColumn: () => void;
  /** Called when a tile signals a color change */
  onTileColorChange?: (graphemeId: string) => void;
  /** ID of the currently selected tile (for color palette interaction) */
  selectedTileId?: string | null;
  /** Called when a tile is selected */
  onSelectTile?: (graphemeId: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ColumnEditor({
  column,
  onAddTile,
  onDeleteTile,
  onUpdateTile,
  onMoveColumn,
  onDeleteColumn,
  onTileColorChange,
  selectedTileId,
  onSelectTile,
}: ColumnEditorProps) {
  return (
    <View style={styles.container}>
      {/* Column header with reorder + delete */}
      <View style={styles.header}>
        <Pressable
          onPress={() => onMoveColumn('left')}
          style={styles.arrowButton}
          accessibilityRole="button"
          accessibilityLabel="Move column left"
          hitSlop={4}
        >
          <Feather name="chevron-left" size={16} color={APP_COLORS.textSecondary} />
        </Pressable>

        <Text style={styles.positionLabel}>Col {column.position + 1}</Text>

        <Pressable
          onPress={() => onMoveColumn('right')}
          style={styles.arrowButton}
          accessibilityRole="button"
          accessibilityLabel="Move column right"
          hitSlop={4}
        >
          <Feather name="chevron-right" size={16} color={APP_COLORS.textSecondary} />
        </Pressable>

        <Pressable
          onPress={onDeleteColumn}
          style={styles.deleteColumnButton}
          accessibilityRole="button"
          accessibilityLabel="Delete column"
          hitSlop={4}
        >
          <Feather name="trash-2" size={14} color={APP_COLORS.secondary} />
        </Pressable>
      </View>

      {/* Tile list */}
      <ScrollView
        style={styles.tileList}
        contentContainerStyle={styles.tileListContent}
        showsVerticalScrollIndicator={false}
      >
        {column.graphemes.map((grapheme) => (
          <Pressable
            key={grapheme.id}
            onPress={() => onSelectTile?.(grapheme.id)}
          >
            <TileEditor
              grapheme={grapheme}
              onTextChange={(text) => onUpdateTile(grapheme.id, text)}
              onDelete={() => onDeleteTile(grapheme.id)}
              onColorChange={() => onTileColorChange?.(grapheme.id)}
              isSelected={selectedTileId === grapheme.id}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Add tile button */}
      <Pressable
        onPress={onAddTile}
        style={({ pressed }) => [
          styles.addTileButton,
          pressed ? styles.pressed : undefined,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add tile to column"
      >
        <Feather name="plus" size={18} color={APP_COLORS.primary} />
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    width: 120,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 8,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 2,
  },
  arrowButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginHorizontal: 2,
  },
  deleteColumnButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  tileList: {
    flex: 1,
    maxHeight: 400,
  },
  tileListContent: {
    padding: 8,
    gap: 8,
  },
  addTileButton: {
    alignSelf: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: APP_COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

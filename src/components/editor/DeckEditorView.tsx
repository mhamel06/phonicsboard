/**
 * Full deck editor layout.
 *
 * Manages local editing state for a deck. Changes are only dispatched
 * to the Redux store when the user explicitly saves.
 */

import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Deck, DeckColumn, Grapheme, TileColor } from '@/engine/types';
import { APP_COLORS, TILE_COLOR_HEX } from '@/utils/colors';
import ColorPalette from './ColorPalette';
import ColumnEditor from './ColumnEditor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeckEditorViewProps {
  /** The deck being edited (initial snapshot) */
  deck: Deck;
  /** Called when the user saves the edited deck */
  onSave: (deck: Deck) => void;
  /** Called when the user cancels editing */
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let nextId = Date.now();
function generateId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

function createEmptyGrapheme(color: TileColor): Grapheme {
  return {
    id: generateId('g'),
    text: '',
    type: 'consonant',
    color,
  };
}

function createEmptyColumn(position: number): DeckColumn {
  return {
    id: generateId('col'),
    position,
    graphemes: [],
    isCollapsed: false,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeckEditorView({
  deck,
  onSave,
  onCancel,
}: DeckEditorViewProps) {
  // Local editing state — not synced to Redux until Save
  const [name, setName] = useState(deck.name);
  const [columns, setColumns] = useState<DeckColumn[]>(
    deck.columns.map((col) => ({ ...col, graphemes: [...col.graphemes] })),
  );
  const [selectedColor, setSelectedColor] = useState<TileColor>('white');
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  // --- Column operations ---

  const handleAddColumn = useCallback(() => {
    setColumns((prev) => [
      ...prev,
      createEmptyColumn(prev.length),
    ]);
  }, []);

  const handleDeleteColumn = useCallback((colId: string) => {
    setColumns((prev) => {
      const filtered = prev.filter((c) => c.id !== colId);
      // Reindex positions
      return filtered.map((c, i) => ({ ...c, position: i }));
    });
  }, []);

  const handleMoveColumn = useCallback(
    (colId: string, direction: 'left' | 'right') => {
      setColumns((prev) => {
        const idx = prev.findIndex((c) => c.id === colId);
        if (idx === -1) return prev;

        const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;

        const updated = [...prev];
        const temp = updated[idx];
        updated[idx] = updated[targetIdx];
        updated[targetIdx] = temp;

        // Reindex positions
        return updated.map((c, i) => ({ ...c, position: i }));
      });
    },
    [],
  );

  // --- Tile operations ---

  const handleAddTile = useCallback(
    (colId: string) => {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== colId) return col;
          return {
            ...col,
            graphemes: [...col.graphemes, createEmptyGrapheme(selectedColor)],
          };
        }),
      );
    },
    [selectedColor],
  );

  const handleDeleteTile = useCallback((colId: string, graphemeId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== colId) return col;
        return {
          ...col,
          graphemes: col.graphemes.filter((g) => g.id !== graphemeId),
        };
      }),
    );
    setSelectedTileId((prev) => (prev === graphemeId ? null : prev));
  }, []);

  const handleUpdateTile = useCallback(
    (colId: string, graphemeId: string, text: string) => {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== colId) return col;
          return {
            ...col,
            graphemes: col.graphemes.map((g) =>
              g.id === graphemeId ? { ...g, text } : g,
            ),
          };
        }),
      );
    },
    [],
  );

  const handleTileColorChange = useCallback(
    (graphemeId: string) => {
      // Apply the currently selected palette color to the tile
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          graphemes: col.graphemes.map((g) =>
            g.id === graphemeId ? { ...g, color: selectedColor } : g,
          ),
        })),
      );
    },
    [selectedColor],
  );

  const handleSelectTile = useCallback((graphemeId: string) => {
    setSelectedTileId((prev) => (prev === graphemeId ? null : graphemeId));
  }, []);

  // --- Color palette ---

  const handleColorSelect = useCallback(
    (color: TileColor) => {
      setSelectedColor(color);
      // If a tile is selected, immediately apply the color
      if (selectedTileId) {
        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            graphemes: col.graphemes.map((g) =>
              g.id === selectedTileId ? { ...g, color } : g,
            ),
          })),
        );
      }
    },
    [selectedTileId],
  );

  // --- Save ---

  const handleSave = useCallback(() => {
    const updatedDeck: Deck = {
      ...deck,
      name: name.trim() || 'Untitled Deck',
      columns,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedDeck);
  }, [deck, name, columns, onSave]);

  // --- Validation ---

  const canSave = name.trim().length > 0;

  return (
    <View style={styles.screen}>
      {/* Top bar: deck name + action buttons */}
      <View style={styles.topBar}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Deck name"
          placeholderTextColor={APP_COLORS.textSecondary}
          style={styles.nameInput}
          maxLength={40}
          accessibilityLabel="Deck name"
        />

        <View style={styles.actions}>
          <Pressable
            onPress={onCancel}
            style={styles.cancelButton}
            accessibilityRole="button"
            accessibilityLabel="Cancel editing"
          >
            <Feather name="x" size={18} color={APP_COLORS.textSecondary} />
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            style={({ pressed }) => [
              styles.saveButton,
              !canSave ? styles.disabled : undefined,
              pressed && canSave ? styles.pressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Save deck"
          >
            <Feather name="check" size={18} color="#FFFFFF" />
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>

      {/* Main editor area */}
      <View style={styles.editorBody}>
        {/* Left sidebar: color palette */}
        <View style={styles.sidebar}>
          <ColorPalette
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
        </View>

        {/* Column editors */}
        <ScrollView
          horizontal
          style={styles.columnsScroll}
          contentContainerStyle={styles.columnsContent}
          showsHorizontalScrollIndicator={false}
        >
          {columns.map((col) => (
            <ColumnEditor
              key={col.id}
              column={col}
              onAddTile={() => handleAddTile(col.id)}
              onDeleteTile={(gId) => handleDeleteTile(col.id, gId)}
              onUpdateTile={(gId, text) => handleUpdateTile(col.id, gId, text)}
              onMoveColumn={(dir) => handleMoveColumn(col.id, dir)}
              onDeleteColumn={() => handleDeleteColumn(col.id)}
              onTileColorChange={(gId) => handleTileColorChange(gId)}
              selectedTileId={selectedTileId}
              onSelectTile={handleSelectTile}
            />
          ))}

          {/* Add column button */}
          <Pressable
            onPress={handleAddColumn}
            style={({ pressed }) => [
              styles.addColumnButton,
              pressed ? styles.pressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Add column"
          >
            <Feather name="plus" size={24} color={APP_COLORS.primary} />
            <Text style={styles.addColumnText}>Add Column</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  editorBody: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
  },
  columnsScroll: {
    flex: 1,
  },
  columnsContent: {
    padding: 16,
    alignItems: 'flex-start',
  },
  addColumnButton: {
    width: 100,
    minHeight: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: APP_COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addColumnText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});

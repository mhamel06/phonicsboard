/**
 * Full playlist editor layout.
 *
 * Provides an editable name, word chain list via WordRow components,
 * an add-word button, and a reference section showing the linked
 * deck's tile columns for quick grapheme entry.
 */

import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Deck, Playlist, PlaylistWord } from '@/engine/types';
import { APP_COLORS, TILE_COLORS } from '@/utils/colors';
import WordRow from './WordRow';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlaylistEditorViewProps {
  /** The playlist being edited, null for brand-new */
  playlist: Playlist | null;
  /** The deck this playlist is linked to */
  linkedDeck: Deck;
  /** Called when the user saves the playlist */
  onSave: (playlist: Playlist) => void;
  /** Called when the user cancels editing */
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEmptyWord(position: number, columnCount: number): PlaylistWord {
  return {
    graphemes: Array.from({ length: columnCount }, () => ''),
    position,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaylistEditorView({
  playlist,
  linkedDeck,
  onSave,
  onCancel,
}: PlaylistEditorViewProps) {
  const columnCount = linkedDeck.columns.length;

  const [name, setName] = useState(playlist?.name ?? '');
  const [words, setWords] = useState<PlaylistWord[]>(
    playlist?.words.length
      ? playlist.words
      : [createEmptyWord(0, columnCount)],
  );
  const [activeSlot, setActiveSlot] = useState<{
    wordIndex: number;
    position: number;
  }>({ wordIndex: 0, position: 0 });

  // --- Word mutations -------------------------------------------------------

  const handleGraphemeChange = useCallback(
    (wordIndex: number, position: number, text: string) => {
      setWords((prev) => {
        const updated = [...prev];
        const word = { ...updated[wordIndex] };
        const graphemes = [...word.graphemes];
        graphemes[position] = text;
        word.graphemes = graphemes;
        updated[wordIndex] = word;
        return updated;
      });
      setActiveSlot({ wordIndex, position });
    },
    [],
  );

  const handleDelete = useCallback((wordIndex: number) => {
    setWords((prev) => {
      const updated = prev.filter((_, i) => i !== wordIndex);
      return updated.map((w, i) => ({ ...w, position: i }));
    });
  }, []);

  const handleMoveUp = useCallback((wordIndex: number) => {
    if (wordIndex === 0) return;
    setWords((prev) => {
      const updated = [...prev];
      const temp = updated[wordIndex - 1];
      updated[wordIndex - 1] = { ...updated[wordIndex], position: wordIndex - 1 };
      updated[wordIndex] = { ...temp, position: wordIndex };
      return updated;
    });
  }, []);

  const handleMoveDown = useCallback((wordIndex: number) => {
    setWords((prev) => {
      if (wordIndex >= prev.length - 1) return prev;
      const updated = [...prev];
      const temp = updated[wordIndex + 1];
      updated[wordIndex + 1] = { ...updated[wordIndex], position: wordIndex + 1 };
      updated[wordIndex] = { ...temp, position: wordIndex };
      return updated;
    });
  }, []);

  const handleAddWord = useCallback(() => {
    setWords((prev) => [
      ...prev,
      createEmptyWord(prev.length, columnCount),
    ]);
  }, [columnCount]);

  // --- Deck tile tap → fill active slot -------------------------------------

  const handleTileTap = useCallback(
    (graphemeText: string, columnIndex: number) => {
      handleGraphemeChange(activeSlot.wordIndex, columnIndex, graphemeText);
    },
    [activeSlot.wordIndex, handleGraphemeChange],
  );

  // --- Save handler ---------------------------------------------------------

  const handleSave = useCallback(() => {
    const trimmedWords = words.filter((w) =>
      w.graphemes.some((g) => g.trim().length > 0),
    );

    const saved: Playlist = {
      id: playlist?.id ?? `playlist-${Date.now()}`,
      name: name.trim() || 'Untitled Playlist',
      linkedDeckId: linkedDeck.id,
      words: trimmedWords.map((w, i) => ({ ...w, position: i })),
      isPreset: false,
      createdAt: playlist?.createdAt ?? new Date().toISOString(),
    };

    onSave(saved);
  }, [name, words, playlist, linkedDeck.id, onSave]);

  // --- Active word graphemes for deck tile indicators -----------------------

  const activeWordGraphemes = words[activeSlot.wordIndex]?.graphemes ?? [];

  // --- Render ---------------------------------------------------------------

  const renderWordRow = useCallback(
    ({ item, index }: { item: PlaylistWord; index: number }) => (
      <WordRow
        word={item}
        columnCount={columnCount}
        onDelete={() => handleDelete(index)}
        onMoveUp={() => handleMoveUp(index)}
        onMoveDown={() => handleMoveDown(index)}
        onGraphemeChange={(pos, text) => handleGraphemeChange(index, pos, text)}
        activePosition={activeSlot.wordIndex === index ? activeSlot.position : undefined}
        onSlotPress={(pos) => setActiveSlot({ wordIndex: index, position: pos })}
        isActiveRow={activeSlot.wordIndex === index}
      />
    ),
    [columnCount, activeSlot, handleDelete, handleMoveUp, handleMoveDown, handleGraphemeChange],
  );

  return (
    <View style={styles.container}>
      {/* Header: name + actions */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Playlist name"
            placeholderTextColor={APP_COLORS.textSecondary}
            accessibilityLabel="Playlist name"
          />
          <Text style={styles.deckLink}>
            Linked to: {linkedDeck.name}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.headerButton,
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.headerButton,
              styles.saveButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Save playlist"
          >
            <Feather name="check" size={16} color="#FFFFFF" style={styles.saveIcon} />
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>

      {/* Word chain list — takes remaining space above deck tiles */}
      <View style={styles.wordSection}>
        <Text style={styles.sectionLabel}>WORD CHAIN</Text>
        <FlatList
          data={words}
          renderItem={renderWordRow}
          keyExtractor={(_, index) => `word-${index}`}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <Pressable
              onPress={handleAddWord}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add word"
            >
              <Feather name="plus" size={20} color={APP_COLORS.primary} />
              <Text style={styles.addButtonText}>Add Word</Text>
            </Pressable>
          }
        />
      </View>

      {/* Deck tile reference — fixed height scrollable panel at bottom */}
      <View style={styles.deckReference}>
        <Text style={styles.deckRefTitle}>
          DECK TILES (tap to fill active slot)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.deckColumnsScroll}>
          {linkedDeck.columns.map((col) => (
            <View key={col.id} style={styles.deckColumn}>
              <Text style={styles.columnLabel}>Col {col.position + 1}</Text>
              {col.graphemes.map((grapheme) => {
                const isPlaced =
                  activeWordGraphemes[col.position] === grapheme.text &&
                  grapheme.text.trim().length > 0;
                return (
                  <Pressable
                    key={grapheme.id}
                    onPress={() => handleTileTap(grapheme.text, col.position)}
                    style={({ pressed }) => [
                      styles.refTile,
                      {
                        backgroundColor:
                          TILE_COLORS[grapheme.type] ?? TILE_COLORS.blank,
                      },
                      isPlaced && styles.refTilePlaced,
                      pressed && styles.refTilePressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Tile ${grapheme.text}`}
                  >
                    <Text style={[styles.refTileText, isPlaced && styles.refTileTextPlaced]}>
                      {grapheme.text}
                    </Text>
                    {isPlaced && (
                      <Feather
                        name="check-circle"
                        size={12}
                        color="#FFFFFF"
                        style={styles.refTileCheck}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: APP_COLORS.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: APP_COLORS.primary,
    paddingBottom: 4,
  },
  deckLink: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginTop: 6,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  saveButton: {
    backgroundColor: APP_COLORS.primary,
  },
  saveIcon: {
    marginRight: 4,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  wordSection: {
    flex: 1,
    minHeight: 180,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: APP_COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 6,
  },
  addButtonPressed: {
    backgroundColor: '#F0FDF4',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.primary,
    fontFamily: 'Inter',
  },
  deckReference: {
    height: 280,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deckRefTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deckColumnsScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
  },
  deckColumn: {
    width: 100,
    alignItems: 'center',
    gap: 6,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  refTile: {
    width: '100%',
    minHeight: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  refTilePlaced: {
    opacity: 0.6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  refTilePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  refTileCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  refTileTextPlaced: {
    opacity: 0.8,
  },
  refTileText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
});

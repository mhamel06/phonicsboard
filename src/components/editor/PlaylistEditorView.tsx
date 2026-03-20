/**
 * Full playlist editor layout.
 *
 * Vertical split: word chain on top (40%), deck tile columns on bottom (60%).
 * Each deck column is independently scrollable and aligned with the word row
 * slots above. Tiles are grouped by phonics sub-category with separators.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Deck, Playlist, PlaylistWord } from '@/engine/types';
import { APP_COLORS, TILE_COLORS, TILE_COLOR_HEX } from '@/utils/colors';
import WordRow from './WordRow';
import { groupByType, styles } from './editorStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlaylistEditorViewProps {
  playlist: Playlist | null;
  linkedDeck: Deck;
  onSave: (playlist: Playlist) => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEmptyWord(position: number, columnCount: number): PlaylistWord {
  return {
    graphemes: Array.from({ length: columnCount }, () => ''),
    position,
    activeColumns: Array.from({ length: columnCount }, (_, i) => i),
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

  // Pre-compute grouped tiles per column
  const columnGroups = useMemo(
    () => linkedDeck.columns.map((col) => groupByType(col.graphemes)),
    [linkedDeck.columns],
  );

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

  const handleToggleColumn = useCallback(
    (wordIndex: number, columnPosition: number) => {
      setWords((prev) => {
        const updated = [...prev];
        const word = { ...updated[wordIndex] };
        const allColumns = Array.from({ length: columnCount }, (_, i) => i);
        const current = word.activeColumns ?? allColumns;

        if (current.includes(columnPosition)) {
          // Removing column — also clear its grapheme
          const graphemes = [...word.graphemes];
          graphemes[columnPosition] = '';
          word.graphemes = graphemes;
          word.activeColumns = current.filter((c) => c !== columnPosition);
        } else {
          // Restoring column — add back in sorted order
          word.activeColumns = [...current, columnPosition].sort((a, b) => a - b);
        }

        updated[wordIndex] = word;
        return updated;
      });
    },
    [columnCount],
  );

  const handleAddWord = useCallback(() => {
    setWords((prev) => {
      const newWords = [...prev, createEmptyWord(prev.length, columnCount)];
      setActiveSlot({ wordIndex: newWords.length - 1, position: 0 });
      return newWords;
    });
  }, [columnCount]);

  // --- Deck tile tap --------------------------------------------------------

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

  // --- Active word graphemes for placed indicator ---------------------------

  const activeWordGraphemes = words[activeSlot.wordIndex]?.graphemes ?? [];

  // --- Render word row ------------------------------------------------------

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
        onToggleColumn={(pos) => handleToggleColumn(index, pos)}
      />
    ),
    [columnCount, activeSlot, handleDelete, handleMoveUp, handleMoveDown, handleGraphemeChange, handleToggleColumn],
  );

  // --- Render ---------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <Text style={styles.deckLink}>Linked to: {linkedDeck.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.headerButton, styles.cancelButton,
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
              styles.headerButton, styles.saveButton,
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

      {/* Word chain -- top 40% */}
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

      {/* Deck tile reference -- bottom 60% */}
      <View style={styles.deckReference}>
        <Text style={styles.deckRefTitle}>
          DECK TILES (tap to fill active slot)
        </Text>

        <View style={styles.columnsRow}>
          {linkedDeck.columns.map((col, colIdx) => (
            <View key={col.id} style={styles.deckColumn}>
              {/* Sticky column header */}
              <View style={styles.columnHeader}>
                <Text style={styles.columnHeaderText}>
                  Col {col.position + 1}
                </Text>
              </View>

              {/* Independent vertical scroll */}
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator
                style={styles.columnScroll}
                contentContainerStyle={styles.columnScrollContent}
              >
                {columnGroups[colIdx].map((group, groupIdx) => (
                  <View key={`${col.id}-${group.type}`}>
                    {groupIdx > 0 && group.label !== '' && <View style={styles.groupSeparator} />}
                    {group.label !== '' && <Text style={styles.groupLabel}>{group.label}</Text>}

                    <View style={styles.tileGrid}>
                    {group.graphemes.map((grapheme) => {
                      const isPlaced =
                        activeWordGraphemes[col.position] === grapheme.text &&
                        grapheme.text.trim().length > 0;
                      return (
                        <Pressable
                          key={grapheme.id}
                          onPress={() => handleTileTap(grapheme.text, col.position)}
                          style={({ pressed }) => [
                            styles.refTile,
                            { backgroundColor: TILE_COLOR_HEX?.[grapheme.color] ?? TILE_COLORS[grapheme.type] ?? TILE_COLORS.blank },
                            isPlaced && styles.refTilePlaced,
                            pressed && styles.refTilePressed,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel={`Tile ${grapheme.text}`}
                        >
                          <Text style={[
                            styles.refTileText,
                            isPlaced && styles.refTileTextPlaced,
                          ]}>
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
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

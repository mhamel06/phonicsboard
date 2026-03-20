/**
 * DeckBoard — the full blending board layout.
 *
 * Top section: Row of CardSlot components showing the active word.
 * Bottom section: Row of TileColumn components for tile selection.
 * Vowels in card slots receive a gold background via isVowel detection.
 */

import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { Deck, DeckState, Grapheme } from '@/engine/types';
import { isVowel } from '@/engine/phonics';
import { APP_COLORS } from '@/utils/colors';
import CardSlot from '@/components/common/CardSlot';
import TileColumn from '@/components/deck/TileColumn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeckBoardProps {
  /** The deck definition with columns and graphemes */
  deck: Deck;
  /** Current runtime state (active cards, history) */
  deckState: DeckState;
  /** Called when a tile is pressed in a column */
  onTilePress: (columnIndex: number, grapheme: Grapheme) => void;
  /** Called when shuffle is requested */
  onShuffle: () => void;
  /** Called when reset is requested */
  onReset: () => void;
  /** Called when history view is requested */
  onHistory: () => void;
  /** Called when a column collapse is toggled */
  onToggleCollapse?: (columnIndex: number) => void;
  /** Display scale factor for projector/classroom use (default 1.0) */
  scale?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeckBoard({
  deck,
  deckState,
  onTilePress,
  onToggleCollapse,
  scale = 1.0,
}: DeckBoardProps) {
  const handleTilePress = useCallback(
    (columnIndex: number, grapheme: Grapheme) => {
      onTilePress(columnIndex, grapheme);
    },
    [onTilePress],
  );

  const handleToggleCollapse = useCallback(
    (columnIndex: number) => {
      onToggleCollapse?.(columnIndex);
    },
    [onToggleCollapse],
  );

  return (
    <View style={styles.container}>
      {/* Active word row — card slots */}
      <View style={styles.cardRow}>
        {deckState.activeCards.map((card, index) => (
          <CardSlot
            key={`slot-${index}`}
            grapheme={card}
            isVowel={card ? isVowel(card) : false}
            scale={scale}
          />
        ))}
      </View>

      {/* Tile columns — scrollable horizontally for many columns */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContent}
        style={styles.columnsScroll}
      >
        {deck.columns.map((column, index) => (
          <TileColumn
            key={column.id}
            column={column}
            onTilePress={(grapheme) => handleTilePress(index, grapheme)}
            onCollapse={() => handleToggleCollapse(index)}
            scale={scale}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: APP_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  columnsScroll: {
    flex: 1,
  },
  columnsContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 4,
  },
});

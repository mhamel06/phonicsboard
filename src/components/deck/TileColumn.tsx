/**
 * TileColumn — a vertical column of clickable grapheme tiles.
 *
 * Renders a column header with a collapse button, followed by
 * tiles laid out in a vertical grid (3 tiles per row). Each tile
 * is colored by its grapheme type via the Tile component.
 */

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { DeckColumn, Grapheme } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import Tile from '@/components/common/Tile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TileColumnProps {
  /** The column data containing graphemes */
  column: DeckColumn;
  /** Callback when a tile is pressed */
  onTilePress: (grapheme: Grapheme) => void;
  /** Callback when the collapse button is pressed */
  onCollapse?: () => void;
  /** Display scale factor for projector/classroom use (default 1.0) */
  scale?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Number of tiles per row in the grid layout */
const TILES_PER_ROW = 3;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TileColumn({
  column,
  onTilePress,
  onCollapse,
  scale = 1.0,
}: TileColumnProps) {
  const handleTilePress = useCallback(
    (grapheme: Grapheme) => {
      onTilePress(grapheme);
    },
    [onTilePress],
  );

  if (column.isCollapsed) {
    return (
      <View style={styles.collapsedContainer}>
        <Pressable
          onPress={onCollapse}
          style={styles.expandButton}
          accessibilityRole="button"
          accessibilityLabel={`Expand column ${column.position + 1}`}
        >
          <Feather name="plus" size={16} color={APP_COLORS.textSecondary} />
        </Pressable>
      </View>
    );
  }

  // Chunk graphemes into rows of TILES_PER_ROW
  const rows: Grapheme[][] = [];
  for (let i = 0; i < column.graphemes.length; i += TILES_PER_ROW) {
    rows.push(column.graphemes.slice(i, i + TILES_PER_ROW));
  }

  return (
    <View style={styles.container}>
      {/* Column header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>
          {column.position + 1}
        </Text>
        {onCollapse && (
          <Pressable
            onPress={onCollapse}
            style={styles.collapseButton}
            accessibilityRole="button"
            accessibilityLabel={`Collapse column ${column.position + 1}`}
          >
            <Feather name="x" size={14} color={APP_COLORS.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Tile grid */}
      <View style={[styles.tileGrid, { gap: 6 * scale }]}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={[styles.tileRow, { gap: 6 * scale }]}>
            {row.map((grapheme) => (
              <View key={grapheme.id} style={styles.tileWrapper}>
                <Tile
                  grapheme={grapheme}
                  onPress={() => handleTilePress(grapheme)}
                  size="small"
                  scale={scale}
                />
              </View>
            ))}
            {/* Fill remaining cells with empty spacers to keep grid alignment */}
            {row.length < TILES_PER_ROW &&
              Array.from({ length: TILES_PER_ROW - row.length }).map(
                (_, spacerIndex) => (
                  <View
                    key={`spacer-${spacerIndex}`}
                    style={styles.tileWrapper}
                  />
                ),
              )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  collapsedContainer: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
  },
  collapseButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  tileGrid: {
    gap: 6,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tileWrapper: {
    flex: 1,
  },
});

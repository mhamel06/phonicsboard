/**
 * Tile selection keyboard for word mat play.
 *
 * Renders tile groups organized by phonics category (e.g. Vowels, Consonants).
 * Each group is displayed as a labeled horizontal row.
 * Heart tiles render with the heart character.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Grapheme, WordMatPreset } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import Tile from '@/components/common/Tile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TileKeyboardProps {
  /** Word mat preset containing tile groups */
  preset: WordMatPreset;
  /** Currently selected tile (highlighted in keyboard) */
  selectedTile: Grapheme | null;
  /** Called when a tile is tapped */
  onTileSelect: (grapheme: Grapheme) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TileKeyboard({
  preset,
  selectedTile,
  onTileSelect,
}: TileKeyboardProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {preset.keyboard.map((group, groupIndex) => (
        <View key={group.label ?? `group-${groupIndex}`} style={styles.group}>
          {group.label && (
            <Text style={styles.groupLabel}>{group.label}</Text>
          )}
          <View style={styles.tileRow}>
            {group.tiles.map((grapheme) => (
              <View key={grapheme.id} style={styles.tileWrapper}>
                <Tile
                  grapheme={grapheme}
                  size="small"
                  isSelected={selectedTile?.id === grapheme.id}
                  onPress={() => onTileSelect(grapheme)}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    maxHeight: 280,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  group: {
    gap: 6,
  },
  groupLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tileWrapper: {
    // Ensures consistent spacing — Tile handles its own min sizing
  },
});

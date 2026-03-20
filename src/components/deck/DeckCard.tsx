/**
 * DeckCard — selection card for the home screen deck list.
 *
 * Displays a deck's icon, name, description, tile count,
 * color preview dots, and a "Preset" badge when applicable.
 * White card with shadow on cream background.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Deck } from '@/engine/types';
import { APP_COLORS, getTileColor } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeckCardProps {
  /** The deck to display */
  deck: Deck;
  /** Called when the card is pressed */
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a description string based on the deck's column count */
function getDeckDescription(deck: Deck): string {
  const columnCount = deck.columns.length;
  const tileCount = deck.columns.reduce(
    (sum, col) => sum + col.graphemes.length,
    0,
  );
  return `${columnCount} columns, ${tileCount} tiles`;
}

/** Collects unique tile colors from the deck for the preview dots */
function getPreviewColors(deck: Deck): string[] {
  const colorSet = new Set<string>();
  for (const column of deck.columns) {
    for (const grapheme of column.graphemes) {
      colorSet.add(getTileColor(grapheme.type));
      if (colorSet.size >= 6) break;
    }
    if (colorSet.size >= 6) break;
  }
  return Array.from(colorSet);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeckCard({ deck, onPress }: DeckCardProps) {
  const description = getDeckDescription(deck);
  const previewColors = getPreviewColors(deck);
  const totalTiles = deck.columns.reduce(
    (sum, col) => sum + col.graphemes.length,
    0,
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : undefined,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open deck: ${deck.name}`}
    >
      {/* Icon and name row */}
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Feather name="layers" size={24} color={APP_COLORS.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {deck.name}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={APP_COLORS.textSecondary}
        />
      </View>

      {/* Bottom row: badges and color dots */}
      <View style={styles.bottomRow}>
        <View style={styles.badges}>
          {deck.isPreset && (
            <View style={styles.presetBadge}>
              <Text style={styles.presetBadgeText}>Preset</Text>
            </View>
          )}
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{totalTiles} tiles</Text>
          </View>
        </View>

        {/* Color preview dots */}
        <View style={styles.colorDots}>
          {previewColors.map((color, index) => (
            <View
              key={`dot-${index}`}
              style={[styles.colorDot, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  presetBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: APP_COLORS.textSecondary,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
});

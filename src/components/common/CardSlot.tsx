/**
 * Display slot for the active word row.
 *
 * Shows a single grapheme in a large card. Vowels get a gold background,
 * consonants get white. Empty slots render a dashed border placeholder.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Grapheme } from '@/engine/types';
import { APP_COLORS, VOWEL_DISPLAY_COLOR } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardSlotProps {
  /** The grapheme displayed in this slot, or null when empty */
  grapheme: Grapheme | null;
  /** Override vowel detection — when true uses gold background */
  isVowel?: boolean;
  /** Explicitly mark this slot as empty (dashed border) */
  isEmpty?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CardSlot({
  grapheme,
  isVowel = false,
  isEmpty = false,
}: CardSlotProps) {
  const showEmpty = isEmpty || !grapheme;

  const vowelSlot =
    isVowel || (grapheme?.type === 'vowel') || (grapheme?.type === 'vowel_team');

  const backgroundColor = showEmpty
    ? 'transparent'
    : vowelSlot
      ? VOWEL_DISPLAY_COLOR
      : APP_COLORS.surface;

  return (
    <View
      style={[
        styles.slot,
        showEmpty ? styles.empty : styles.filled,
        { backgroundColor },
      ]}
      accessibilityRole="text"
      accessibilityLabel={
        grapheme ? `Card slot: ${grapheme.text}` : 'Empty card slot'
      }
    >
      {grapheme && !showEmpty && (
        <Text style={styles.label}>{grapheme.text}</Text>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  slot: {
    width: 110,
    height: 130,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  empty: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  label: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 36,
    color: '#264653',
    textAlign: 'center',
  },
});

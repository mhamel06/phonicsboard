/**
 * Word chain player — displays the current word as large card slots.
 *
 * Center: large CardSlot components for each grapheme in the current word.
 * Left/right chevron arrows for navigating the word chain.
 * Vowels are highlighted with a gold background via CardSlot's built-in logic.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Playlist, PlaylistState } from '@/engine/types';
import { getCurrentWord } from '@/engine/playlist';
import { isVowel } from '@/engine/phonics';
import { classifyGrapheme } from '@/engine/phonics';
import CardSlot from '@/components/common/CardSlot';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlaylistPlayerProps {
  playlist: Playlist;
  playlistState: PlaylistState;
  onNext: () => void;
  onPrevious: () => void;
  onToggleFocus: () => void;
  /** Display scale factor for projector/classroom use (default 1.0) */
  scale?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a temporary Grapheme object from a raw grapheme text string.
 * Used to pass into CardSlot which expects a full Grapheme.
 */
function textToGrapheme(text: string, index: number) {
  const type = classifyGrapheme(text);
  return {
    id: `playlist-g-${index}-${text}`,
    text,
    type,
    color: type === 'vowel' || type === 'vowel_team' || type === 'r_controlled' || type === 'schwa'
      ? 'yellow' as const
      : 'white' as const,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaylistPlayer({
  playlist,
  playlistState,
  onNext,
  onPrevious,
  onToggleFocus,
  scale = 1.0,
}: PlaylistPlayerProps) {
  const currentWord = getCurrentWord(playlistState, playlist);
  const isFirst = playlistState.currentIndex === 0;
  const isLast = playlistState.currentIndex === playlist.words.length - 1;

  // Only show graphemes that are in activeColumns (if defined) AND have non-empty text
  const activeColumns = currentWord.activeColumns;
  const filledGraphemes = currentWord.graphemes
    .map((text, i) => ({ text, index: i }))
    .filter(({ text, index }) => {
      // If activeColumns is defined, only include columns in the list
      if (activeColumns && !activeColumns.includes(index)) return false;
      // Skip empty graphemes
      return text.trim().length > 0;
    });

  const graphemes = filledGraphemes.map(({ text, index }) => textToGrapheme(text, index));

  return (
    <View style={styles.container}>
      {/* Left chevron */}
      <Pressable
        onPress={onPrevious}
        disabled={isFirst}
        style={({ pressed }) => [
          styles.chevron,
          {
            width: 48 * scale,
            height: 48 * scale,
            borderRadius: 24 * scale,
          },
          isFirst && styles.chevronDisabled,
          pressed && !isFirst ? styles.chevronPressed : undefined,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Previous word"
      >
        <Text
          style={[
            styles.chevronText,
            { fontSize: 22 * scale },
            isFirst && styles.chevronTextDisabled,
          ]}
        >
          {'<'}
        </Text>
      </Pressable>

      {/* Word cards */}
      <View style={[styles.cards, { gap: 8 * scale }]}>
        {graphemes.map((grapheme, index) => (
          <CardSlot
            key={`${playlistState.currentIndex}-${index}`}
            grapheme={grapheme}
            isVowel={isVowel(grapheme)}
            scale={scale}
          />
        ))}
      </View>

      {/* Right chevron */}
      <Pressable
        onPress={onNext}
        disabled={isLast}
        style={({ pressed }) => [
          styles.chevron,
          {
            width: 48 * scale,
            height: 48 * scale,
            borderRadius: 24 * scale,
          },
          isLast && styles.chevronDisabled,
          pressed && !isLast ? styles.chevronPressed : undefined,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Next word"
      >
        <Text
          style={[
            styles.chevronText,
            { fontSize: 22 * scale },
            isLast && styles.chevronTextDisabled,
          ]}
        >
          {'>'}
        </Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  chevron: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: APP_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  chevronDisabled: {
    opacity: 0.35,
  },
  chevronPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  chevronText: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  chevronTextDisabled: {
    color: APP_COLORS.textSecondary,
  },
  cards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

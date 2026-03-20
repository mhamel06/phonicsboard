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
}: PlaylistPlayerProps) {
  const currentWord = getCurrentWord(playlistState, playlist);
  const isFirst = playlistState.currentIndex === 0;
  const isLast = playlistState.currentIndex === playlist.words.length - 1;

  const graphemes = currentWord.graphemes.map((text, i) => textToGrapheme(text, i));

  return (
    <View style={styles.container}>
      {/* Left chevron */}
      <Pressable
        onPress={onPrevious}
        disabled={isFirst}
        style={({ pressed }) => [
          styles.chevron,
          isFirst && styles.chevronDisabled,
          pressed && !isFirst ? styles.chevronPressed : undefined,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Previous word"
      >
        <Text
          style={[
            styles.chevronText,
            isFirst && styles.chevronTextDisabled,
          ]}
        >
          {'<'}
        </Text>
      </Pressable>

      {/* Word cards */}
      <View style={styles.cards}>
        {graphemes.map((grapheme, index) => (
          <CardSlot
            key={`${playlistState.currentIndex}-${index}`}
            grapheme={grapheme}
            isVowel={isVowel(grapheme)}
          />
        ))}
      </View>

      {/* Right chevron */}
      <Pressable
        onPress={onNext}
        disabled={isLast}
        style={({ pressed }) => [
          styles.chevron,
          isLast && styles.chevronDisabled,
          pressed && !isLast ? styles.chevronPressed : undefined,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Next word"
      >
        <Text
          style={[
            styles.chevronText,
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

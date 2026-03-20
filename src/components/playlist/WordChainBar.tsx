/**
 * Bottom progress bar showing all words in the current playlist chain.
 *
 * Horizontal scrollable list of word labels. The current word is bold green,
 * others are gray. Auto-scrolls to keep the active word visible.
 */

import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Playlist, PlaylistWord } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WordChainBarProps {
  playlist: Playlist;
  currentIndex: number;
  onGoTo: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Joins only active/filled grapheme texts into a readable word string. */
function wordLabel(word: PlaylistWord): string {
  const activeColumns = word.activeColumns;
  return word.graphemes
    .filter((text, i) => {
      if (activeColumns && !activeColumns.includes(i)) return false;
      return text.trim().length > 0;
    })
    .join('');
}

// Approximate width of each word chip for auto-scroll calculation
const CHIP_WIDTH = 72;
const CHIP_GAP = 8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WordChainBar({
  playlist,
  currentIndex,
  onGoTo,
}: WordChainBarProps) {
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to keep current word visible
  useEffect(() => {
    if (scrollRef.current) {
      const offset = Math.max(
        0,
        currentIndex * (CHIP_WIDTH + CHIP_GAP) - CHIP_WIDTH,
      );
      scrollRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {playlist.words.map((word, index) => {
          const isCurrent = index === currentIndex;

          return (
            <Pressable
              key={index}
              onPress={() => onGoTo(index)}
              style={({ pressed }) => [
                styles.chip,
                isCurrent && styles.chipActive,
                pressed ? styles.chipPressed : undefined,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Go to word ${wordLabel(word)}`}
              accessibilityState={{ selected: isCurrent }}
            >
              <Text
                style={[
                  styles.chipText,
                  isCurrent && styles.chipTextActive,
                ]}
              >
                {wordLabel(word)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CHIP_GAP,
    paddingHorizontal: 8,
  },
  chip: {
    minWidth: CHIP_WIDTH,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#DEF7EC',
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '400',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Nunito',
  },
  chipTextActive: {
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
});

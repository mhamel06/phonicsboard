/**
 * DeckControls — control bar for the deck play screen.
 *
 * Left: Back, Shuffle, Reset buttons.
 * Center: Deck name in italic.
 * Right: History button.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { APP_COLORS } from '@/utils/colors';
import Button from '@/components/common/Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeckControlsProps {
  /** Navigate back to the deck list */
  onBack: () => void;
  /** Shuffle all columns */
  onShuffle: () => void;
  /** Reset card slots to empty */
  onReset: () => void;
  /** Open the word history view */
  onHistory: () => void;
  /** Name of the active deck */
  deckName: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeckControls({
  onBack,
  onShuffle,
  onReset,
  onHistory,
  deckName,
}: DeckControlsProps) {
  return (
    <View style={styles.container}>
      {/* Left group */}
      <View style={styles.leftGroup}>
        <Button
          title="Back"
          onPress={onBack}
          variant="ghost"
          icon="arrow-left"
          size="small"
        />
        <Button
          title="Shuffle"
          onPress={onShuffle}
          variant="secondary"
          icon="shuffle"
          size="small"
        />
        <Button
          title="Reset"
          onPress={onReset}
          variant="secondary"
          icon="rotate-ccw"
          size="small"
        />
      </View>

      {/* Center — deck name */}
      <View style={styles.centerGroup}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deckName}
        </Text>
      </View>

      {/* Right group */}
      <View style={styles.rightGroup}>
        <Button
          title="History"
          onPress={onHistory}
          variant="secondary"
          icon="clock"
          size="small"
        />
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  centerGroup: {
    flex: 1,
    alignItems: 'center',
  },
  rightGroup: {
    flex: 1,
    alignItems: 'flex-end',
  },
  deckName: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
});

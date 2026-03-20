/**
 * Mode selector tabs for word mat play.
 *
 * Three pill-shaped tabs: syllables, sounds, graphemes.
 * Active tab has white background with shadow; container has gray background.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import type { WordMatMode } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModeSelectorProps {
  /** Current active mode */
  mode: WordMatMode;
  /** Called when user taps a different mode tab */
  onModeChange: (mode: WordMatMode) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODES: { value: WordMatMode; label: string }[] = [
  { value: 'syllables', label: 'Syllables' },
  { value: 'sounds', label: 'Sounds' },
  { value: 'graphemes', label: 'Graphemes' },
];

const CONTAINER_BG = '#F3F4F6';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ModeSelector({
  mode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      {MODES.map(({ value, label }) => {
        const isActive = mode === value;

        const tabStyle: ViewStyle = isActive
          ? styles.activeTab
          : styles.inactiveTab;

        return (
          <Pressable
            key={value}
            onPress={() => onModeChange(value)}
            style={[styles.tab, tabStyle]}
            accessibilityRole="tab"
            accessibilityLabel={`${label} mode`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.tabText,
                isActive ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: CONTAINER_BG,
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  activeTabText: {
    color: APP_COLORS.textPrimary,
  },
  inactiveTabText: {
    color: APP_COLORS.textSecondary,
  },
});

/**
 * Top navigation bar with PhonicsBoard logo and tab pills.
 *
 * Renders 4 pill-shaped tab buttons. The active tab uses forest green
 * background with white text; inactive tabs use transparent bg with gray text.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TabName = 'decks' | 'playlists' | 'word-mats' | 'progress';

export interface TabBarProps {
  /** Currently active tab */
  activeTab: TabName;
  /** Callback when the user taps a tab */
  onTabChange: (tab: TabName) => void;
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

interface TabDef {
  key: TabName;
  label: string;
}

const TABS: TabDef[] = [
  { key: 'decks', label: 'Decks' },
  { key: 'playlists', label: 'Playlists' },
  { key: 'word-mats', label: 'Word Mats' },
  { key: 'progress', label: 'Progress' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logo}>
        <Feather name="book-open" size={22} color={APP_COLORS.primary} />
        <Text style={styles.logoText}>PhonicsBoard</Text>
      </View>

      {/* Tab pills */}
      <View style={styles.pills}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={[styles.pill, isActive && styles.pillActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  logoText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 18,
    color: APP_COLORS.primary,
    marginLeft: 6,
  },
  pills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: APP_COLORS.primary,
  },
  pillText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: APP_COLORS.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});

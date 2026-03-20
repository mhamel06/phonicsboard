/**
 * Search / filter input with a leading search icon.
 *
 * Gray background, rounded corners, used across list screens
 * (decks, playlists, word mats) for quick filtering.
 */

import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchFilterProps {
  /** Current search text */
  value: string;
  /** Called when the text changes */
  onChangeText: (text: string) => void;
  /** Placeholder text shown when input is empty */
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SearchFilter({
  value,
  onChangeText,
  placeholder = 'Search...',
}: SearchFilterProps) {
  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={18}
        color={APP_COLORS.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={APP_COLORS.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 15,
    color: APP_COLORS.textPrimary,
    // Reset default padding on web
    paddingVertical: 0,
  },
});

/**
 * Empty state display for screens with no content.
 *
 * Shows an icon, title, description, and optional action button.
 * Used when deck/playlist/word-mat lists are empty or search yields no results.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';
import Button from './Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmptyStateProps {
  /** Headline text */
  title: string;
  /** Explanatory message below the title */
  message: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Callback when the action button is pressed */
  onAction?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Feather name="inbox" size={48} color={APP_COLORS.textSecondary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button title={actionLabel} onPress={onAction} variant="primary" />
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrapper: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 20,
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 15,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  action: {
    marginTop: 24,
  },
});

/**
 * Playlist list item card.
 *
 * Row layout showing playlist name, word count, linked deck name.
 * Play button (green) and copy button (gray) on the right side.
 * White card background with subtle shadow.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Playlist } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlaylistCardProps {
  playlist: Playlist;
  onPlay: () => void;
  onCopy: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaylistCard({
  playlist,
  onPlay,
  onCopy,
  onEdit,
  onDelete,
}: PlaylistCardProps) {
  const wordCount = playlist.words.length;

  return (
    <View style={styles.card}>
      {/* Left — info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={styles.meta}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
          {playlist.linkedDeckId ? ` \u00B7 ${playlist.linkedDeckId}` : ''}
        </Text>
      </View>

      {/* Right — action buttons */}
      <View style={styles.actions}>
        <Pressable
          onPress={onPlay}
          style={({ pressed }) => [
            styles.button,
            styles.playButton,
            pressed ? styles.buttonPressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Play ${playlist.name}`}
        >
          <Text style={styles.playButtonText}>Play</Text>
        </Pressable>

        {onEdit && (
          <Pressable
            onPress={onEdit}
            style={({ pressed }) => [
              styles.iconButton,
              styles.editButton,
              pressed ? styles.buttonPressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${playlist.name}`}
          >
            <Feather name="edit-2" size={16} color={APP_COLORS.textSecondary} />
          </Pressable>
        )}

        <Pressable
          onPress={onCopy}
          style={({ pressed }) => [
            styles.button,
            styles.copyButton,
            pressed ? styles.buttonPressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${playlist.name}`}
        >
          <Text style={styles.copyButtonText}>Copy</Text>
        </Pressable>

        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [
              styles.iconButton,
              styles.deleteButton,
              pressed ? styles.buttonPressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${playlist.name}`}
          >
            <Feather name="trash-2" size={16} color="#DC2626" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    fontFamily: 'Nunito',
  },
  meta: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginTop: 3,
    fontFamily: 'Inter',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  playButton: {
    backgroundColor: APP_COLORS.primary,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  copyButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  copyButtonText: {
    color: APP_COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
});

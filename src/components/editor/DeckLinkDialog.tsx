/**
 * Link-to-deck selection dialog.
 *
 * Modal overlay requiring the user to link a playlist to a deck
 * before proceeding with creation. Shows available decks with
 * name and column count.
 */

import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Deck } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeckLinkDialogProps {
  /** Available decks to link to */
  decks: Deck[];
  /** Called when a deck is selected */
  onSelect: (deckId: string) => void;
  /** Called when the dialog is cancelled */
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeckLinkDialog({
  decks,
  onSelect,
  onCancel,
}: DeckLinkDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  const renderDeckItem = ({ item }: { item: Deck }) => {
    const isSelected = item.id === selectedId;

    return (
      <Pressable
        onPress={() => setSelectedId(item.id)}
        style={({ pressed }) => [
          styles.deckItem,
          isSelected && styles.deckItemSelected,
          pressed && styles.deckItemPressed,
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${item.name}, ${item.columns.length} columns`}
      >
        <View style={styles.deckInfo}>
          <Text
            style={[styles.deckName, isSelected && styles.deckNameSelected]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.deckMeta}>
            {item.columns.length} {item.columns.length === 1 ? 'column' : 'columns'}
          </Text>
        </View>
        {isSelected && (
          <Feather name="check-circle" size={20} color={APP_COLORS.primary} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <Text style={styles.title}>Link to a Deck</Text>
        <Text style={styles.description}>
          Each playlist must be linked to a deck. Select a deck to continue.
        </Text>

        {/* Deck list */}
        <FlatList
          data={decks}
          renderItem={renderDeckItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No decks available. Create a deck first.
            </Text>
          }
        />

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.actionButton,
              styles.cancelButton,
              pressed && styles.actionPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleContinue}
            disabled={!selectedId}
            style={({ pressed }) => [
              styles.actionButton,
              styles.continueButton,
              !selectedId && styles.continueDisabled,
              pressed && selectedId ? styles.actionPressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            accessibilityState={{ disabled: !selectedId }}
          >
            <Text
              style={[
                styles.continueText,
                !selectedId && styles.continueTextDisabled,
              ]}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  modal: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    fontFamily: 'Nunito',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    lineHeight: 20,
    marginBottom: 16,
  },
  list: {
    maxHeight: 300,
  },
  listContent: {
    gap: 8,
  },
  deckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  deckItemSelected: {
    borderColor: APP_COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  deckItemPressed: {
    opacity: 0.85,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    fontFamily: 'Nunito',
  },
  deckNameSelected: {
    color: APP_COLORS.primary,
  },
  deckMeta: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  continueButton: {
    backgroundColor: APP_COLORS.primary,
  },
  continueDisabled: {
    opacity: 0.5,
  },
  continueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  continueTextDisabled: {
    color: '#FFFFFF',
  },
});

/**
 * Deck editor route.
 *
 * Loads an existing deck by ID for editing, or creates a new empty deck
 * when the ID is "new". All edits stay local until the user saves.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

import type { Deck } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addDeck, updateDeck } from '@/store/decksSlice';
import DeckEditorView from '@/components/editor/DeckEditorView';
import Button from '@/components/common/Button';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateDeckId(): string {
  return `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyDeck(name: string): Deck {
  const now = new Date().toISOString();
  return {
    id: generateDeckId(),
    name,
    isPreset: false,
    columns: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Creation dialog — shown when ID is "new"
// ---------------------------------------------------------------------------

interface CreationDialogProps {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function CreationDialog({ onConfirm, onCancel }: CreationDialogProps) {
  const [name, setName] = useState('');

  return (
    <View style={dialogStyles.overlay}>
      <View style={dialogStyles.modal}>
        <Text style={dialogStyles.title}>New Deck</Text>
        <Text style={dialogStyles.subtitle}>
          Give your deck a name to get started.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. CVC Words"
          placeholderTextColor={APP_COLORS.textSecondary}
          style={dialogStyles.input}
          maxLength={40}
          autoFocus
          accessibilityLabel="Deck name"
        />

        <View style={dialogStyles.actions}>
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
          <Button
            title="Create"
            variant="primary"
            onPress={() => onConfirm(name.trim() || 'Untitled Deck')}
          />
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function DeckEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isNew = id === 'new';

  const existingDeck = useAppSelector((state) =>
    state.decks.decks.find((d) => d.id === id),
  );

  // For "new" decks, we start with the creation dialog
  const [newDeck, setNewDeck] = useState<Deck | null>(null);
  const [showCreationDialog, setShowCreationDialog] = useState(isNew);

  // The deck to edit: either the existing one from Redux or a freshly created one
  const editableDeck = useMemo(() => {
    if (newDeck) return newDeck;
    if (existingDeck) {
      // Deep clone to avoid mutating Redux state
      return {
        ...existingDeck,
        columns: existingDeck.columns.map((col) => ({
          ...col,
          graphemes: col.graphemes.map((g) => ({ ...g })),
        })),
      };
    }
    return null;
  }, [existingDeck, newDeck]);

  const handleCreationConfirm = useCallback((name: string) => {
    setNewDeck(createEmptyDeck(name));
    setShowCreationDialog(false);
  }, []);

  const handleCreationCancel = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  const handleSave = useCallback(
    (deck: Deck) => {
      if (isNew || newDeck) {
        dispatch(addDeck(deck));
      } else {
        dispatch(updateDeck(deck));
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    },
    [isNew, newDeck, dispatch, router],
  );

  const handleCancel = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  // Show creation dialog for new decks
  if (showCreationDialog) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ headerShown: false }} />
        <CreationDialog
          onConfirm={handleCreationConfirm}
          onCancel={handleCreationCancel}
        />
      </View>
    );
  }

  // Deck not found
  if (!editableDeck) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Deck not found.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeckEditorView
        deck={editableDeck}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.background,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: APP_COLORS.secondary,
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// Dialog styles
// ---------------------------------------------------------------------------

const dialogStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    fontFamily: 'Nunito',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: APP_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

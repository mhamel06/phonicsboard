/**
 * Playlist editor route.
 *
 * Handles both "new" (create) and existing (edit) playlist flows.
 * For new playlists, shows DeckLinkDialog first, then the editor.
 * For existing playlists, loads from Redux and opens the editor directly.
 * Local editing state until Save, then dispatches to Redux.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

import type { Playlist } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addPlaylist, updatePlaylist } from '@/store/playlistsSlice';
import PlaylistEditorView from '@/components/editor/PlaylistEditorView';
import DeckLinkDialog from '@/components/editor/DeckLinkDialog';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function PlaylistEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isNew = id === 'new';

  // Fetch data from Redux
  const existingPlaylist = useAppSelector((state) =>
    isNew ? undefined : state.playlists.playlists.find((p) => p.id === id),
  );

  const allDecks = useAppSelector((state) => state.decks.decks);

  // For new playlists, we need the user to pick a deck first
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(
    existingPlaylist?.linkedDeckId ?? null,
  );
  const [showDeckDialog, setShowDeckDialog] = useState(isNew);

  // Find the linked deck
  const linkedDeck = useMemo(
    () => allDecks.find((d) => d.id === selectedDeckId) ?? null,
    [allDecks, selectedDeckId],
  );

  // --- Handlers --------------------------------------------------------------

  const handleDeckSelect = useCallback((deckId: string) => {
    setSelectedDeckId(deckId);
    setShowDeckDialog(false);
  }, []);

  const handleDeckDialogCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(
    (playlist: Playlist) => {
      if (isNew || !existingPlaylist) {
        dispatch(addPlaylist(playlist));
      } else {
        dispatch(updatePlaylist(playlist));
      }
      router.back();
    },
    [isNew, existingPlaylist, dispatch, router],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // --- Render ----------------------------------------------------------------

  // Not-found state for existing playlist
  if (!isNew && !existingPlaylist) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Playlist not found.</Text>
      </View>
    );
  }

  // Show deck link dialog for new playlists
  if (showDeckDialog) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ headerShown: false }} />
        <DeckLinkDialog
          decks={allDecks}
          onSelect={handleDeckSelect}
          onCancel={handleDeckDialogCancel}
        />
      </View>
    );
  }

  // No linked deck resolved (should not happen normally)
  if (!linkedDeck) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Linked deck not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <PlaylistEditorView
        playlist={existingPlaylist ?? null}
        linkedDeck={linkedDeck}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
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
  },
  errorText: {
    fontSize: 16,
    color: APP_COLORS.secondary,
    fontWeight: '600',
  },
});

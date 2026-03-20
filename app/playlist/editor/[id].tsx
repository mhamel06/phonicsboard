/**
 * Playlist editor route.
 *
 * Handles both "new" (create) and existing (edit) playlist flows.
 * For new playlists, shows DeckLinkDialog first, then the editor.
 * For existing playlists, loads from Redux and opens the editor directly.
 * Local editing state until Save, then dispatches to Redux.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

import type { Playlist } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addPlaylist, updatePlaylist } from '@/store/playlistsSlice';
import { useHydrated } from '@/hooks/usePersistence';
import Button from '@/components/common/Button';
import PlaylistEditorView from '@/components/editor/PlaylistEditorView';
import DeckLinkDialog from '@/components/editor/DeckLinkDialog';

// Small helper to avoid inline component in render
function RedirectButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <Button title={title} variant="primary" onPress={onPress} />;
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function PlaylistEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hydrated = useHydrated();

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

  // When hydration completes and we find the playlist, update the selected deck
  useEffect(() => {
    if (hydrated && existingPlaylist && !selectedDeckId) {
      setSelectedDeckId(existingPlaylist.linkedDeckId);
    }
  }, [hydrated, existingPlaylist, selectedDeckId]);

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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/playlists');
    }
  }, [router]);

  const handleSave = useCallback(
    (playlist: Playlist) => {
      if (isNew || !existingPlaylist) {
        dispatch(addPlaylist(playlist));
      } else {
        dispatch(updatePlaylist(playlist));
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/playlists');
      }
    },
    [isNew, existingPlaylist, dispatch, router],
  );

  const handleCancel = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/playlists');
    }
  }, [router]);

  // --- Render ----------------------------------------------------------------

  // Wait for persistence hydration before deciding "not found"
  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
      </View>
    );
  }

  // Not-found state for existing playlist — redirect to playlists list
  if (!isNew && !existingPlaylist) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>
          Playlist not found. It may have been deleted or not saved.
        </Text>
        <RedirectButton
          title="Back to Playlists"
          onPress={() => router.replace('/playlists')}
        />
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

  // No linked deck resolved — let user pick a different deck instead of dead end
  if (!linkedDeck) {
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
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: APP_COLORS.secondary,
    fontWeight: '600',
  },
});

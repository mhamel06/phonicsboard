/**
 * Share import route — /share/[code]
 *
 * When a user visits phonics.staylo.io/share/ABC123, this screen
 * looks up the shared resource, shows a preview, and offers an
 * "Import to My Decks" button. Works for both authenticated and guest users.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

import { APP_COLORS } from '@/utils/colors';
import { useSharing } from '@/hooks/useSharing';
import { getSharedResourcePreview } from '@/services/sharing';
import type { Deck, Playlist } from '@/engine/types';

type PreviewData = {
  resourceType: 'deck' | 'playlist';
  data: Deck | Playlist;
};

export default function ShareImportScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const { importFromCode, isSharing } = useSharing();

  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  // --- Fetch preview on mount ---

  useEffect(() => {
    if (!code) {
      setError('No share code provided');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPreview() {
      const result = await getSharedResourcePreview(code!);

      if (cancelled) return;

      if (!result) {
        setError('Share code not found or has expired');
      } else {
        setPreview(result);
      }
      setIsLoading(false);
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [code]);

  // --- Import handler ---

  const handleImport = useCallback(async () => {
    if (!code) return;

    const success = await importFromCode(code);
    if (success) {
      setImported(true);
    } else {
      setError('Failed to import. Please try again.');
    }
  }, [code, importFromCode]);

  const handleGoHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  // --- Render helpers ---

  const renderDeckPreview = (deck: Deck) => (
    <View style={styles.previewCard}>
      <Text style={styles.previewLabel}>Deck</Text>
      <Text style={styles.previewName}>{deck.name}</Text>
      <Text style={styles.previewDetail}>
        {deck.columns.length} column{deck.columns.length !== 1 ? 's' : ''}
      </Text>
      <Text style={styles.previewDetail}>
        {deck.columns.reduce((sum, col) => sum + col.graphemes.length, 0)} tiles
        total
      </Text>
    </View>
  );

  const renderPlaylistPreview = (playlist: Playlist) => (
    <View style={styles.previewCard}>
      <Text style={styles.previewLabel}>Playlist</Text>
      <Text style={styles.previewName}>{playlist.name}</Text>
      <Text style={styles.previewDetail}>
        {playlist.words.length} word{playlist.words.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  // --- Loading state ---

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Shared Resource' }} />
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
        <Text style={styles.loadingText}>Loading shared resource...</Text>
      </View>
    );
  }

  // --- Error state ---

  if (error && !preview) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  // --- Success state (after import) ---

  if (imported) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Imported!' }} />
        <Text style={styles.successText}>Successfully imported!</Text>
        <Text style={styles.successDetail}>
          The {preview?.resourceType} has been added to your collection.
        </Text>
        <Pressable style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Go to My Decks</Text>
        </Pressable>
      </View>
    );
  }

  // --- Preview state ---

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Import Shared Resource' }} />

      <Text style={styles.heading}>Someone shared this with you</Text>

      {preview?.resourceType === 'deck'
        ? renderDeckPreview(preview.data as Deck)
        : preview
          ? renderPlaylistPreview(preview.data as Playlist)
          : null}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={[styles.importButton, isSharing && styles.buttonDisabled]}
        onPress={handleImport}
        disabled={isSharing}
      >
        {isSharing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.importButtonText}>Import to My Decks</Text>
        )}
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={handleGoHome}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: APP_COLORS.background,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewName: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: 12,
  },
  previewDetail: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 16,
    color: APP_COLORS.textSecondary,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: 8,
  },
  successDetail: {
    fontSize: 16,
    color: APP_COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  importButton: {
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 12,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: APP_COLORS.textSecondary,
    fontSize: 16,
  },
});

import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import { useAppDispatch } from '@/store/store';
import { addDeck } from '@/store/decksSlice';
import { addPlaylist } from '@/store/playlistsSlice';
import {
  shareDeck as shareDeckService,
  sharePlaylist as sharePlaylistService,
  importSharedResource,
} from '@/services/sharing';
import type { Deck, Playlist } from '@/engine/types';

/** Copies text to clipboard, handling missing expo-clipboard gracefully. */
async function copyToClipboard(text: string): Promise<void> {
  try {
    const Clipboard = await import('expo-clipboard');
    await Clipboard.setStringAsync(text);
  } catch {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Not available
      }
    }
    console.warn('[useSharing] Could not copy to clipboard');
  }
}

interface UseSharingResult {
  /** Share a deck and copy the share code to clipboard. */
  shareDeck: (
    userId: string,
    deckId: string,
  ) => Promise<{ shareCode: string; shareUrl: string } | null>;
  /** Share a playlist and copy the share code to clipboard. */
  sharePlaylist: (
    userId: string,
    playlistId: string,
  ) => Promise<{ shareCode: string; shareUrl: string } | null>;
  /** Import a shared resource by its code into local state + Redux. */
  importFromCode: (code: string) => Promise<boolean>;
  /** Whether a share or import operation is in progress. */
  isSharing: boolean;
}

/**
 * Hook for sharing decks and playlists via share codes.
 * Handles Supabase interactions, clipboard operations, and Redux dispatch.
 */
export function useSharing(): UseSharingResult {
  const dispatch = useAppDispatch();
  const [isSharing, setIsSharing] = useState(false);

  const shareDeck = useCallback(
    async (userId: string, deckId: string) => {
      setIsSharing(true);
      try {
        const result = await shareDeckService(userId, deckId);

        await copyToClipboard(result.shareCode);

        return result;
      } catch (err) {
        console.warn('[useSharing] shareDeck failed:', err);
        return null;
      } finally {
        setIsSharing(false);
      }
    },
    [],
  );

  const sharePlaylist = useCallback(
    async (userId: string, playlistId: string) => {
      setIsSharing(true);
      try {
        const result = await sharePlaylistService(userId, playlistId);

        await copyToClipboard(result.shareCode);

        return result;
      } catch (err) {
        console.warn('[useSharing] sharePlaylist failed:', err);
        return null;
      } finally {
        setIsSharing(false);
      }
    },
    [],
  );

  const importFromCode = useCallback(
    async (code: string): Promise<boolean> => {
      setIsSharing(true);
      try {
        const resource = await importSharedResource(code);
        if (!resource) {
          return false;
        }

        // Determine if it's a deck or playlist by checking for deck-specific fields
        if ('columns' in resource) {
          const deck = resource as Deck;
          // Mark as non-preset and give it a fresh updatedAt
          const importedDeck: Deck = {
            ...deck,
            isPreset: false,
            updatedAt: new Date().toISOString(),
          };
          dispatch(addDeck(importedDeck));
        } else if ('words' in resource) {
          const playlist = resource as Playlist;
          const importedPlaylist: Playlist = {
            ...playlist,
            isPreset: false,
          };
          dispatch(addPlaylist(importedPlaylist));
        } else {
          console.warn('[useSharing] Unknown resource type');
          return false;
        }

        return true;
      } catch (err) {
        console.warn('[useSharing] importFromCode failed:', err);
        return false;
      } finally {
        setIsSharing(false);
      }
    },
    [dispatch],
  );

  return { shareDeck, sharePlaylist, importFromCode, isSharing };
}

/**
 * ShareButton — generates a share code for a deck or playlist.
 *
 * Shows a modal with the share code, URL, and copy-to-clipboard button.
 * Only functional when the user is authenticated; hidden for guests.
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { APP_COLORS } from '@/utils/colors';
import { useAppSelector } from '@/store/store';
import { useSharing } from '@/hooks/useSharing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShareButtonProps {
  resourceType: 'deck' | 'playlist';
  resourceId: string;
}

// ---------------------------------------------------------------------------
// Clipboard helper (expo-clipboard may not be installed yet)
// ---------------------------------------------------------------------------

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Dynamic import so the component doesn't crash if expo-clipboard is missing
    const Clipboard = await import('expo-clipboard');
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    // Fallback for web
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Clipboard API not available
      }
    }
    console.warn('[ShareButton] Could not copy to clipboard');
    return false;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ShareButton({
  resourceType,
  resourceId,
}: ShareButtonProps) {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);

  // Read the actual resource data from Redux so we can embed it in the share
  const deck = useAppSelector((state) =>
    resourceType === 'deck'
      ? state.decks.decks.find((d) => d.id === resourceId) ?? null
      : null,
  );
  const playlist = useAppSelector((state) =>
    resourceType === 'playlist'
      ? state.playlists.playlists.find((p) => p.id === resourceId) ?? null
      : null,
  );

  const { shareDeck, sharePlaylist, isSharing } = useSharing();

  const [modalVisible, setModalVisible] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Don't render for guests
  if (!isAuthenticated) return null;

  const handleShare = async () => {
    setError(null);
    setCopied(false);
    setShareCode(null);
    setShareUrl(null);

    if (!userId) {
      setError('Sign in to share');
      setModalVisible(true);
      return;
    }

    const resourceData = resourceType === 'deck' ? deck : playlist;
    if (!resourceData) {
      setError('Resource not found');
      setModalVisible(true);
      return;
    }

    setModalVisible(true);

    const result =
      resourceType === 'deck'
        ? await shareDeck(userId, resourceData)
        : await sharePlaylist(userId, resourceData);

    if (result) {
      setShareCode(result.shareCode);
      setShareUrl(result.shareUrl);
    } else {
      setError('Could not generate share link. Try again.');
    }
  };

  const handleCopyCode = async () => {
    if (!shareCode) return;
    const ok = await copyToClipboard(shareCode);
    if (ok) setCopied(true);
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;
    const ok = await copyToClipboard(shareUrl);
    if (ok) setCopied(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setCopied(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : undefined,
          isSharing ? styles.buttonDisabled : undefined,
        ]}
        onPress={handleShare}
        disabled={isSharing}
        accessibilityRole="button"
        accessibilityLabel="Share"
        hitSlop={8}
      >
        {isSharing ? (
          <ActivityIndicator size="small" color={APP_COLORS.primary} />
        ) : (
          <Text style={styles.buttonLabel}>Share</Text>
        )}
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.modalTitle}>
              Share {resourceType === 'deck' ? 'Deck' : 'Playlist'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {isSharing && !shareCode && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={APP_COLORS.primary} />
                <Text style={styles.loadingText}>
                  Generating share code...
                </Text>
              </View>
            )}

            {shareCode && (
              <>
                <Text style={styles.label}>Share Code</Text>
                <Pressable style={styles.codeBox} onPress={handleCopyCode}>
                  <Text style={styles.codeText}>{shareCode}</Text>
                </Pressable>

                <Text style={styles.label}>Share URL</Text>
                <Pressable style={styles.urlBox} onPress={handleCopyUrl}>
                  <Text style={styles.urlText} numberOfLines={1}>
                    {shareUrl}
                  </Text>
                </Pressable>

                <Pressable style={styles.copyButton} onPress={handleCopyCode}>
                  <Text style={styles.copyButtonText}>
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Text>
                </Pressable>
              </>
            )}

            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 12,
  },
  codeBox: {
    backgroundColor: APP_COLORS.background,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 28,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  urlBox: {
    backgroundColor: APP_COLORS.background,
    borderRadius: 8,
    padding: 12,
  },
  urlText: {
    fontSize: 13,
    color: APP_COLORS.primary,
  },
  copyButton: {
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: APP_COLORS.textSecondary,
    fontSize: 15,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    color: APP_COLORS.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
});

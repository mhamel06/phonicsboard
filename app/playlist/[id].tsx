/**
 * Playlist play route — renders the word chain player for a given playlist ID.
 *
 * Top controls: Back, Shuffle (placeholder), Focus toggle.
 * Center: PlaylistPlayer with chevron navigation.
 * Bottom: WordChainBar (hidden in focus mode).
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setActivePlaylist,
  nextWordAction,
  previousWordAction,
  goToWordAction,
  toggleFocusModeAction,
  toggleShuffleAction,
} from '@/store/playlistsSlice';
import PlaylistPlayer from '@/components/playlist/PlaylistPlayer';
import WordChainBar from '@/components/playlist/WordChainBar';
import ScaleControls from '@/components/common/ScaleControls';
import { APP_COLORS } from '@/utils/colors';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import useDisplayScale from '@/hooks/useDisplayScale';
import KeyboardHints from '@/components/common/KeyboardHints';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaylistPlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const playlist = useAppSelector((state) =>
    state.playlists.playlists.find((p) => p.id === id),
  );
  const playlistState = useAppSelector(
    (state) => state.playlists.activePlaylistState,
  );

  const [showHints, setShowHints] = useState(false);
  const { scale, scaleUp, scaleDown, resetScale, canScaleUp, canScaleDown } =
    useDisplayScale();

  // Initialize active playlist state on mount
  useEffect(() => {
    if (playlist) {
      dispatch(setActivePlaylist(playlist));
    }
    return () => {
      dispatch(setActivePlaylist(null));
    };
  }, [playlist, dispatch]);

  // Keyboard navigation (web only)
  const keyboardConfig = useMemo(
    () => ({
      arrowleft: () => dispatch(previousWordAction()),
      arrowright: () => {
        if (playlist) dispatch(nextWordAction(playlist));
      },
      escape: () => {
        if (playlistState?.isFocusMode) {
          dispatch(toggleFocusModeAction());
        } else {
          router.canGoBack() ? router.back() : router.replace('/playlists');
        }
      },
      f: () => dispatch(toggleFocusModeAction()),
      s: () => {
        if (playlist) dispatch(toggleShuffleAction(playlist));
      },
      ' ': () => {
        /* Space — replay audio (placeholder for future audio support) */
      },
      'shift+?': () => setShowHints((prev) => !prev),
    }),
    [dispatch, playlist, playlistState, router],
  );
  useKeyboardNav(keyboardConfig);

  const playlistHints = useMemo(
    () => [
      { key: '\u2190', action: 'Previous word' },
      { key: '\u2192', action: 'Next word' },
      { key: 'Esc', action: 'Exit focus mode / Go back' },
      { key: 'F', action: 'Toggle focus mode' },
      { key: 'S', action: 'Toggle shuffle' },
      { key: 'Space', action: 'Replay audio' },
    ],
    [],
  );

  // Loading / not found
  if (!playlist || !playlistState) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          {playlist ? 'Loading...' : 'Playlist not found'}
        </Text>
      </View>
    );
  }

  const isFocus = playlistState.isFocusMode;

  const handleNext = () => dispatch(nextWordAction(playlist));
  const handlePrevious = () => dispatch(previousWordAction());
  const handleGoTo = (index: number) => dispatch(goToWordAction(index));
  const handleToggleFocus = () => dispatch(toggleFocusModeAction());
  const handleToggleShuffle = () => dispatch(toggleShuffleAction(playlist));
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/playlists');
    }
  };

  const ScreenWrapper = isFocus ? Pressable : View;
  const screenWrapperProps = isFocus
    ? { onPress: handleToggleFocus, style: styles.screen }
    : { style: styles.screen };

  return (
    <ScreenWrapper {...screenWrapperProps}>
      {/* Top controls — hidden in focus mode */}
      {!isFocus && (
        <View style={styles.topBar}>
          <Pressable
            onPress={handleBack}
            style={styles.topButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.topButtonText}>Back</Text>
          </Pressable>

          <Text style={styles.title} numberOfLines={1}>
            {playlist.name}
          </Text>

          <Pressable
            onPress={handleToggleShuffle}
            style={[
              styles.topButton,
              playlistState.isShuffled && styles.topButtonActive,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Toggle shuffle"
          >
            <Text
              style={[
                styles.topButtonText,
                playlistState.isShuffled && styles.topButtonTextActive,
              ]}
            >
              Shuffle
            </Text>
          </Pressable>

          <Pressable
            onPress={handleToggleFocus}
            style={styles.topButton}
            accessibilityRole="button"
            accessibilityLabel="Toggle focus mode"
          >
            <Text style={styles.topButtonText}>Focus</Text>
          </Pressable>
        </View>
      )}

      {/* Player area */}
      <PlaylistPlayer
        playlist={playlist}
        playlistState={playlistState}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleFocus={handleToggleFocus}
        scale={scale}
      />

      {/* Word chain bar — hidden in focus mode */}
      {!isFocus && (
        <WordChainBar
          playlist={playlist}
          currentIndex={playlistState.currentIndex}
          onGoTo={handleGoTo}
        />
      )}

      {/* Focus mode exit tap zone */}
      {isFocus && (
        <Pressable
          onPress={handleToggleFocus}
          style={styles.focusExitHint}
          accessibilityRole="button"
          accessibilityLabel="Exit focus mode"
        >
          <Text style={styles.focusExitText}>Tap to exit focus mode</Text>
        </Pressable>
      )}

      {!isFocus && (
        <ScaleControls
          scale={scale}
          onScaleUp={scaleUp}
          onScaleDown={scaleDown}
          onReset={resetScale}
          canScaleUp={canScaleUp}
          canScaleDown={canScaleDown}
        />
      )}

      {!isFocus && <KeyboardHints hints={playlistHints} visible={showHints} />}
    </ScreenWrapper>
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
  emptyText: {
    fontSize: 18,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  topButtonActive: {
    backgroundColor: APP_COLORS.textPrimary,
  },
  topButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
    fontFamily: 'Inter',
  },
  topButtonTextActive: {
    color: '#FFFFFF',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    fontFamily: 'Nunito',
    marginHorizontal: 8,
  },
  focusExitHint: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  focusExitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});

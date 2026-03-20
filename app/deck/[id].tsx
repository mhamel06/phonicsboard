/**
 * Deck play route — the core blending board screen.
 *
 * Loads a deck by ID from the Redux store, initializes deck state,
 * and renders the DeckControls + DeckBoard layout.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

import type { Grapheme } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setActiveDeck,
  placeTileAction,
  resetCardsAction,
  shuffleAction,
  addToHistoryAction,
} from '@/store/decksSlice';
import DeckBoard from '@/components/deck/DeckBoard';
import DeckControls from '@/components/deck/DeckControls';
import ScaleControls from '@/components/common/ScaleControls';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import useDisplayScale from '@/hooks/useDisplayScale';
import KeyboardHints from '@/components/common/KeyboardHints';

// ---------------------------------------------------------------------------
// History modal (simple inline for now)
// ---------------------------------------------------------------------------

interface HistoryOverlayProps {
  history: Grapheme[][];
  onClose: () => void;
}

function HistoryOverlay({ history, onClose }: HistoryOverlayProps) {
  return (
    <View style={historyStyles.overlay}>
      <View style={historyStyles.modal}>
        <View style={historyStyles.header}>
          <Text style={historyStyles.title}>Word History</Text>
          <Text
            style={historyStyles.close}
            onPress={onClose}
            accessibilityRole="button"
          >
            Close
          </Text>
        </View>
        {history.length === 0 ? (
          <Text style={historyStyles.empty}>No words blended yet.</Text>
        ) : (
          history.map((word, index) => (
            <View key={`word-${index}`} style={historyStyles.wordRow}>
              <Text style={historyStyles.wordIndex}>{index + 1}.</Text>
              <Text style={historyStyles.wordText}>
                {word.map((g) => g.text).join('')}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function DeckPlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const deck = useAppSelector((state) =>
    state.decks.decks.find((d) => d.id === id),
  );
  const deckState = useAppSelector((state) => state.decks.activeDeckState);

  const [showHistory, setShowHistory] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const { scale, scaleUp, scaleDown, resetScale, canScaleUp, canScaleDown } =
    useDisplayScale();

  // Initialize deck state when the screen mounts or deck changes
  useEffect(() => {
    if (deck) {
      dispatch(setActiveDeck(deck));
    }

    return () => {
      dispatch(setActiveDeck(null));
    };
  }, [deck, dispatch]);

  const handleBack = useCallback(() => {
    // Save current word to history before leaving
    if (deckState) {
      dispatch(addToHistoryAction());
    }
    router.back();
  }, [deckState, dispatch, router]);

  const handleTilePress = useCallback(
    (columnIndex: number, grapheme: Grapheme) => {
      dispatch(placeTileAction({ columnIndex, grapheme }));
    },
    [dispatch],
  );

  const handleShuffle = useCallback(() => {
    if (deck) {
      dispatch(shuffleAction(deck.id));
    }
  }, [deck, dispatch]);

  const handleReset = useCallback(() => {
    // Save current word to history before resetting
    if (deckState) {
      dispatch(addToHistoryAction());
    }
    dispatch(resetCardsAction());
  }, [deckState, dispatch]);

  const handleHistory = useCallback(() => {
    setShowHistory((prev) => !prev);
  }, []);

  // Keyboard navigation (web only)
  const keyboardConfig = useMemo(
    () => ({
      escape: handleBack,
      r: handleReset,
      s: handleShuffle,
      h: handleHistory,
      'shift+?': () => setShowHints((prev) => !prev),
    }),
    [handleBack, handleReset, handleShuffle, handleHistory],
  );
  useKeyboardNav(keyboardConfig);

  const deckHints = useMemo(
    () => [
      { key: 'Esc', action: 'Go back' },
      { key: 'R', action: 'Reset cards' },
      { key: 'S', action: 'Shuffle' },
      { key: 'H', action: 'Toggle history' },
    ],
    [],
  );

  // Loading / not found states
  if (!deck) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Deck not found.</Text>
      </View>
    );
  }

  if (!deckState) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading deck...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <DeckControls
        onBack={handleBack}
        onShuffle={handleShuffle}
        onReset={handleReset}
        onHistory={handleHistory}
        deckName={deck.name}
      />

      <DeckBoard
        deck={deck}
        deckState={deckState}
        onTilePress={handleTilePress}
        onShuffle={handleShuffle}
        onReset={handleReset}
        onHistory={handleHistory}
        scale={scale}
      />

      {showHistory && (
        <HistoryOverlay
          history={deckState.history}
          onClose={() => setShowHistory(false)}
        />
      )}

      <ScaleControls
        scale={scale}
        onScaleUp={scaleUp}
        onScaleDown={scaleDown}
        onReset={resetScale}
        canScaleUp={canScaleUp}
        canScaleDown={canScaleDown}
      />

      <KeyboardHints hints={deckHints} visible={showHints} />
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
  },
  errorText: {
    fontSize: 16,
    color: APP_COLORS.secondary,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: APP_COLORS.textSecondary,
  },
});

// ---------------------------------------------------------------------------
// History overlay styles
// ---------------------------------------------------------------------------

const historyStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  close: {
    fontSize: 15,
    fontWeight: '500',
    color: APP_COLORS.primary,
  },
  empty: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 24,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  wordIndex: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    width: 32,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
    letterSpacing: 1,
  },
});

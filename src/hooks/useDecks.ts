import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setActiveDeck,
  placeTileAction,
  resetCardsAction,
  shuffleAction,
  addToHistoryAction,
} from '@/store/decksSlice';
import type { Grapheme } from '@/engine/types';

/**
 * Hook for deck operations.
 * Provides access to all decks, the active deck session state,
 * and memoized callbacks for deck interactions.
 */
export function useDecks() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.decks.decks);
  const activeDeckState = useAppSelector(
    (state) => state.decks.activeDeckState,
  );

  const selectDeck = useCallback(
    (id: string) => {
      const deck = decks.find((d) => d.id === id) ?? null;
      dispatch(setActiveDeck(deck));
    },
    [decks, dispatch],
  );

  const placeTile = useCallback(
    (colIndex: number, grapheme: Grapheme) => {
      dispatch(placeTileAction({ columnIndex: colIndex, grapheme }));
    },
    [dispatch],
  );

  const shuffle = useCallback(() => {
    if (!activeDeckState) return;
    dispatch(shuffleAction(activeDeckState.deckId));
  }, [activeDeckState, dispatch]);

  const reset = useCallback(() => {
    dispatch(resetCardsAction());
  }, [dispatch]);

  const addToHistory = useCallback(() => {
    dispatch(addToHistoryAction());
  }, [dispatch]);

  return useMemo(
    () => ({
      decks,
      activeDeckState,
      selectDeck,
      placeTile,
      shuffle,
      reset,
      addToHistory,
    }),
    [decks, activeDeckState, selectDeck, placeTile, shuffle, reset, addToHistory],
  );
}

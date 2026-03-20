import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Deck, DeckState, Grapheme } from '@/engine/types';
import {
  createDeckState,
  placeTile,
  resetCards,
  shuffleAllColumns,
  addToHistory,
} from '@/engine/deck';
import { allDecks } from '@/data/presets/index';

// --- State ---

export interface DecksSliceState {
  decks: Deck[];
  activeDeckState: DeckState | null;
  isLoading: boolean;
}

const initialState: DecksSliceState = {
  decks: allDecks,
  activeDeckState: null,
  isLoading: false,
};

// --- Slice ---

const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDecks(state, action: PayloadAction<Deck[]>) {
      state.decks = action.payload;
    },

    setActiveDeck(state, action: PayloadAction<Deck | null>) {
      if (action.payload === null) {
        state.activeDeckState = null;
        return;
      }
      state.activeDeckState = createDeckState(action.payload);
    },

    placeTileAction(
      state,
      action: PayloadAction<{ columnIndex: number; grapheme: Grapheme }>,
    ) {
      if (!state.activeDeckState) return;
      const { columnIndex, grapheme } = action.payload;
      state.activeDeckState = placeTile(
        state.activeDeckState,
        columnIndex,
        grapheme,
      );
    },

    resetCardsAction(state) {
      if (!state.activeDeckState) return;
      state.activeDeckState = resetCards(state.activeDeckState);
    },

    shuffleAction(state, action: PayloadAction<string>) {
      const deckIndex = state.decks.findIndex((d) => d.id === action.payload);
      if (deckIndex === -1) return;
      state.decks[deckIndex] = shuffleAllColumns(state.decks[deckIndex]);
    },

    addToHistoryAction(state) {
      if (!state.activeDeckState) return;
      state.activeDeckState = addToHistory(state.activeDeckState);
    },
  },
});

export const {
  setDecks,
  setActiveDeck,
  placeTileAction,
  resetCardsAction,
  shuffleAction,
  addToHistoryAction,
} = decksSlice.actions;

export default decksSlice.reducer;

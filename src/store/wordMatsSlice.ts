import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Grapheme, WordMatMode, WordMatPreset, WordMatState } from '@/engine/types';
import {
  createWordMatState,
  addBox,
  removeBox,
  selectTile,
  placeTileInBox,
  clearBox,
  clearAllBoxes,
  switchMode,
} from '@/engine/word-mat';
import { allWordMatPresets } from '@/data/word-mats/index';

// --- State ---

export interface WordMatsSliceState {
  presets: WordMatPreset[];
  activeWordMatState: WordMatState | null;
}

const initialState: WordMatsSliceState = {
  presets: allWordMatPresets,
  activeWordMatState: null,
};

// --- Slice ---

const wordMatsSlice = createSlice({
  name: 'wordMats',
  initialState,
  reducers: {
    setActiveWordMat(state, action: PayloadAction<WordMatPreset | null>) {
      if (action.payload === null) {
        state.activeWordMatState = null;
        return;
      }
      state.activeWordMatState = createWordMatState(action.payload);
    },

    addBoxAction(state) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = addBox(state.activeWordMatState);
    },

    removeBoxAction(state, action: PayloadAction<string>) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = removeBox(
        state.activeWordMatState,
        action.payload,
      );
    },

    selectTileAction(state, action: PayloadAction<Grapheme>) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = selectTile(
        state.activeWordMatState,
        action.payload,
      );
    },

    placeTileInBoxAction(state, action: PayloadAction<string>) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = placeTileInBox(
        state.activeWordMatState,
        action.payload,
      );
    },

    clearBoxAction(state, action: PayloadAction<string>) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = clearBox(
        state.activeWordMatState,
        action.payload,
      );
    },

    clearAllBoxesAction(state) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = clearAllBoxes(state.activeWordMatState);
    },

    switchModeAction(state, action: PayloadAction<WordMatMode>) {
      if (!state.activeWordMatState) return;
      state.activeWordMatState = switchMode(
        state.activeWordMatState,
        action.payload,
      );
    },
  },
});

export const {
  setActiveWordMat,
  addBoxAction,
  removeBoxAction,
  selectTileAction,
  placeTileInBoxAction,
  clearBoxAction,
  clearAllBoxesAction,
  switchModeAction,
} = wordMatsSlice.actions;

export default wordMatsSlice.reducer;

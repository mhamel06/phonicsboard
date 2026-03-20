import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setActiveWordMat,
  addBoxAction,
  removeBoxAction,
  selectTileAction,
  placeTileInBoxAction,
  clearBoxAction,
  clearAllBoxesAction,
  switchModeAction,
} from '@/store/wordMatsSlice';
import type { Grapheme, WordMatMode } from '@/engine/types';

/**
 * Hook for word mat operations.
 * Provides access to presets, the active word mat session state,
 * and memoized callbacks for Elkonin box interactions.
 */
export function useWordMat() {
  const dispatch = useAppDispatch();
  const presets = useAppSelector((state) => state.wordMats.presets);
  const activeWordMatState = useAppSelector(
    (state) => state.wordMats.activeWordMatState,
  );

  const selectPreset = useCallback(
    (id: string) => {
      const preset = presets.find((p) => p.id === id) ?? null;
      dispatch(setActiveWordMat(preset));
    },
    [presets, dispatch],
  );

  const addBox = useCallback(() => {
    dispatch(addBoxAction());
  }, [dispatch]);

  const removeBox = useCallback(
    (id: string) => {
      dispatch(removeBoxAction(id));
    },
    [dispatch],
  );

  const selectTile = useCallback(
    (grapheme: Grapheme) => {
      dispatch(selectTileAction(grapheme));
    },
    [dispatch],
  );

  const placeTile = useCallback(
    (boxId: string) => {
      dispatch(placeTileInBoxAction(boxId));
    },
    [dispatch],
  );

  const clearBox = useCallback(
    (id: string) => {
      dispatch(clearBoxAction(id));
    },
    [dispatch],
  );

  const clearAll = useCallback(() => {
    dispatch(clearAllBoxesAction());
  }, [dispatch]);

  const switchMode = useCallback(
    (mode: WordMatMode) => {
      dispatch(switchModeAction(mode));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      presets,
      activeWordMatState,
      selectPreset,
      addBox,
      removeBox,
      selectTile,
      placeTile,
      clearBox,
      clearAll,
      switchMode,
    }),
    [
      presets,
      activeWordMatState,
      selectPreset,
      addBox,
      removeBox,
      selectTile,
      placeTile,
      clearBox,
      clearAll,
      switchMode,
    ],
  );
}

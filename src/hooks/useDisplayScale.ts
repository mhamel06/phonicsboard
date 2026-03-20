/**
 * Hook for managing display scale — designed for projector/classroom use.
 *
 * Allows teachers to scale up tiles, cards, and text when projecting
 * for a class. Persists preference via Redux + AsyncStorage.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { setDisplayScale } from '@/store/settingsSlice';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Allowed scale steps */
const SCALE_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0] as const;

const MIN_SCALE = SCALE_STEPS[0];
const MAX_SCALE = SCALE_STEPS[SCALE_STEPS.length - 1];
const DEFAULT_SCALE = 1.0;

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface DisplayScaleControls {
  /** Current scale factor (0.5 – 2.0) */
  scale: number;
  /** Set scale to an exact value (clamped to valid steps) */
  setScale: (value: number) => void;
  /** Move to the next higher scale step */
  scaleUp: () => void;
  /** Move to the next lower scale step */
  scaleDown: () => void;
  /** Reset scale to 1.0 */
  resetScale: () => void;
  /** Multiply a base size by the current scale */
  scaledSize: (baseSize: number) => number;
  /** Whether we can scale up further */
  canScaleUp: boolean;
  /** Whether we can scale down further */
  canScaleDown: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export default function useDisplayScale(): DisplayScaleControls {
  const dispatch = useAppDispatch();
  const scale = useAppSelector((state) => state.settings.displayScale);

  // Find current index in scale steps
  const currentIndex = useMemo(() => {
    const idx = SCALE_STEPS.indexOf(scale as (typeof SCALE_STEPS)[number]);
    // If scale is not an exact step, find the closest
    if (idx === -1) {
      let closest = 0;
      let minDiff = Math.abs(SCALE_STEPS[0] - scale);
      for (let i = 1; i < SCALE_STEPS.length; i++) {
        const diff = Math.abs(SCALE_STEPS[i] - scale);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
      return closest;
    }
    return idx;
  }, [scale]);

  const canScaleUp = currentIndex < SCALE_STEPS.length - 1;
  const canScaleDown = currentIndex > 0;

  const setScale = useCallback(
    (value: number) => {
      const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
      dispatch(setDisplayScale(clamped));
    },
    [dispatch],
  );

  const scaleUp = useCallback(() => {
    if (canScaleUp) {
      dispatch(setDisplayScale(SCALE_STEPS[currentIndex + 1]));
    }
  }, [canScaleUp, currentIndex, dispatch]);

  const scaleDown = useCallback(() => {
    if (canScaleDown) {
      dispatch(setDisplayScale(SCALE_STEPS[currentIndex - 1]));
    }
  }, [canScaleDown, currentIndex, dispatch]);

  const resetScale = useCallback(() => {
    dispatch(setDisplayScale(DEFAULT_SCALE));
  }, [dispatch]);

  const scaledSize = useCallback(
    (baseSize: number) => baseSize * scale,
    [scale],
  );

  // Keyboard shortcuts (web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (!isModifier) return;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        scaleUp();
      } else if (e.key === '-') {
        e.preventDefault();
        scaleDown();
      } else if (e.key === '0') {
        e.preventDefault();
        resetScale();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [scaleUp, scaleDown, resetScale]);

  return {
    scale,
    setScale,
    scaleUp,
    scaleDown,
    resetScale,
    scaledSize,
    canScaleUp,
    canScaleDown,
  };
}

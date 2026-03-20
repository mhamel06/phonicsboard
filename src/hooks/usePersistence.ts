import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { setDecks } from '@/store/decksSlice';
import { setPlaylists } from '@/store/playlistsSlice';
import { toggleAudio, setTheme, toggleFocusDefault } from '@/store/settingsSlice';
import {
  saveDecks,
  loadDecks,
  savePlaylists,
  loadPlaylists,
  saveSettings,
  loadSettings,
} from '@/utils/storage';
import type { SettingsState } from '@/store/settingsSlice';

/** Debounce delay for persisting state changes (ms). */
const DEBOUNCE_MS = 500;

/**
 * Hook that auto-saves Redux state to AsyncStorage.
 * On mount, loads persisted data and dispatches to the store.
 * Subscribes to store changes and debounces writes.
 *
 * Call this once at the app root level.
 */
export function usePersistence() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.decks.decks);
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const settings = useAppSelector((state) => state.settings);

  const isHydrated = useRef(false);
  const debounceTimers = useRef<{
    decks: ReturnType<typeof setTimeout> | null;
    playlists: ReturnType<typeof setTimeout> | null;
    settings: ReturnType<typeof setTimeout> | null;
  }>({ decks: null, playlists: null, settings: null });

  // --- Hydrate from storage on mount ---

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const [savedDecks, savedPlaylists, savedSettings] = await Promise.all([
        loadDecks(),
        loadPlaylists(),
        loadSettings(),
      ]);

      if (cancelled) return;

      if (savedDecks) {
        dispatch(setDecks(savedDecks));
      }
      if (savedPlaylists) {
        dispatch(setPlaylists(savedPlaylists));
      }
      if (savedSettings) {
        applySettings(savedSettings);
      }

      isHydrated.current = true;
    }

    function applySettings(saved: SettingsState) {
      // Apply each setting individually since there's no bulk setter
      if (saved.audioEnabled !== settings.audioEnabled) {
        dispatch(toggleAudio());
      }
      if (saved.focusModeDefault !== settings.focusModeDefault) {
        dispatch(toggleFocusDefault());
      }
      if (saved.theme !== settings.theme) {
        dispatch(setTheme(saved.theme));
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Debounced saves ---

  useEffect(() => {
    if (!isHydrated.current) return;

    if (debounceTimers.current.decks) {
      clearTimeout(debounceTimers.current.decks);
    }
    debounceTimers.current.decks = setTimeout(() => {
      saveDecks(decks);
    }, DEBOUNCE_MS);
  }, [decks]);

  useEffect(() => {
    if (!isHydrated.current) return;

    if (debounceTimers.current.playlists) {
      clearTimeout(debounceTimers.current.playlists);
    }
    debounceTimers.current.playlists = setTimeout(() => {
      savePlaylists(playlists);
    }, DEBOUNCE_MS);
  }, [playlists]);

  useEffect(() => {
    if (!isHydrated.current) return;

    if (debounceTimers.current.settings) {
      clearTimeout(debounceTimers.current.settings);
    }
    debounceTimers.current.settings = setTimeout(() => {
      saveSettings(settings);
    }, DEBOUNCE_MS);
  }, [settings]);

  // --- Cleanup timers on unmount ---

  useEffect(() => {
    return () => {
      const timers = debounceTimers.current;
      if (timers.decks) clearTimeout(timers.decks);
      if (timers.playlists) clearTimeout(timers.playlists);
      if (timers.settings) clearTimeout(timers.settings);
    };
  }, []);
}

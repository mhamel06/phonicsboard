import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Deck, Playlist } from '@/engine/types';
import type { SettingsState } from '@/store/settingsSlice';

// --- Storage Keys ---

const KEYS = {
  DECKS: '@phonicsboard/decks',
  PLAYLISTS: '@phonicsboard/playlists',
  SETTINGS: '@phonicsboard/settings',
} as const;

// --- Deck Persistence ---

/** Saves the full decks array to AsyncStorage. */
export async function saveDecks(decks: Deck[]): Promise<void> {
  const json = JSON.stringify(decks);
  await AsyncStorage.setItem(KEYS.DECKS, json);
}

/** Loads saved decks from AsyncStorage. Returns null if none exist. */
export async function loadDecks(): Promise<Deck[] | null> {
  const json = await AsyncStorage.getItem(KEYS.DECKS);
  if (json === null) return null;

  try {
    return JSON.parse(json) as Deck[];
  } catch {
    return null;
  }
}

// --- Playlist Persistence ---

/** Saves the full playlists array to AsyncStorage. */
export async function savePlaylists(playlists: Playlist[]): Promise<void> {
  const json = JSON.stringify(playlists);
  await AsyncStorage.setItem(KEYS.PLAYLISTS, json);
}

/** Loads saved playlists from AsyncStorage. Returns null if none exist. */
export async function loadPlaylists(): Promise<Playlist[] | null> {
  const json = await AsyncStorage.getItem(KEYS.PLAYLISTS);
  if (json === null) return null;

  try {
    return JSON.parse(json) as Playlist[];
  } catch {
    return null;
  }
}

// --- Settings Persistence ---

/** Saves settings to AsyncStorage. */
export async function saveSettings(settings: SettingsState): Promise<void> {
  const json = JSON.stringify(settings);
  await AsyncStorage.setItem(KEYS.SETTINGS, json);
}

/** Loads saved settings from AsyncStorage. Returns null if none exist. */
export async function loadSettings(): Promise<SettingsState | null> {
  const json = await AsyncStorage.getItem(KEYS.SETTINGS);
  if (json === null) return null;

  try {
    return JSON.parse(json) as SettingsState;
  } catch {
    return null;
  }
}

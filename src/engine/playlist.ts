// Playlist engine — pure functions, ZERO React dependencies

import type { Playlist, PlaylistState, PlaylistWord } from './types';

/**
 * Creates initial runtime state for a playlist session.
 * Starts at the first word with focus mode off.
 */
export function createPlaylistState(playlist: Playlist): PlaylistState {
  return {
    playlistId: playlist.id,
    currentIndex: 0,
    isFocusMode: false,
  };
}

/**
 * Advances to the next word in the playlist.
 * Clamps at the last word (does not wrap around).
 */
export function nextWord(
  state: PlaylistState,
  playlist: Playlist,
): PlaylistState {
  const maxIndex = playlist.words.length - 1;

  if (state.currentIndex >= maxIndex) {
    return state;
  }

  return {
    ...state,
    currentIndex: state.currentIndex + 1,
  };
}

/**
 * Goes back to the previous word in the playlist.
 * Clamps at the first word (does not wrap around).
 */
export function previousWord(state: PlaylistState): PlaylistState {
  if (state.currentIndex <= 0) {
    return state;
  }

  return {
    ...state,
    currentIndex: state.currentIndex - 1,
  };
}

/**
 * Jumps to a specific word index in the playlist.
 * Returns unchanged state if index is out of bounds.
 * Note: Caller is responsible for ensuring index is within playlist.words bounds.
 */
export function goToWord(
  state: PlaylistState,
  index: number,
): PlaylistState {
  if (index < 0) {
    return state;
  }

  return {
    ...state,
    currentIndex: index,
  };
}

/**
 * Toggles focus mode on/off.
 * In focus mode, surrounding words are hidden to reduce distraction.
 */
export function toggleFocusMode(state: PlaylistState): PlaylistState {
  return {
    ...state,
    isFocusMode: !state.isFocusMode,
  };
}

/**
 * Returns the current word from the playlist based on state index.
 * Throws if index is out of bounds (indicates a bug in state management).
 */
export function getCurrentWord(
  state: PlaylistState,
  playlist: Playlist,
): PlaylistWord {
  const word = playlist.words[state.currentIndex];

  if (!word) {
    throw new RangeError(
      `Playlist index ${state.currentIndex} is out of bounds (playlist has ${playlist.words.length} words)`,
    );
  }

  return word;
}

/**
 * Compares two playlist words and returns the index of the first
 * position where the grapheme text differs.
 * Returns -1 if the words are identical or if both are empty.
 *
 * This is used for word-chain highlighting: when moving from one word
 * to the next, the changed phoneme position should be visually emphasized.
 */
export function getChangedPhoneme(
  prev: PlaylistWord,
  next: PlaylistWord,
): number {
  const maxLen = Math.max(prev.graphemes.length, next.graphemes.length);

  for (let i = 0; i < maxLen; i++) {
    const prevGrapheme = prev.graphemes[i] ?? '';
    const nextGrapheme = next.graphemes[i] ?? '';

    if (prevGrapheme !== nextGrapheme) {
      return i;
    }
  }

  return -1;
}

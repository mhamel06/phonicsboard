import { describe, it, expect } from 'vitest';
import {
  createPlaylistState,
  nextWord,
  previousWord,
  goToWord,
  toggleFocusMode,
  getCurrentWord,
  getChangedPhoneme,
} from '../../src/engine/playlist';
import type { Playlist, PlaylistWord } from '../../src/engine/types';

// === Test Helpers ===

function makeWord(graphemes: string[], position: number): PlaylistWord {
  return { graphemes, position };
}

function makePlaylist(words: PlaylistWord[]): Playlist {
  return {
    id: 'playlist-1',
    name: 'Test Playlist',
    linkedDeckId: 'deck-1',
    words,
    isPreset: false,
    createdAt: '2026-01-01',
  };
}

const samplePlaylist = makePlaylist([
  makeWord(['c', 'a', 't'], 0),
  makeWord(['c', 'a', 'p'], 1),
  makeWord(['c', 'u', 'p'], 2),
  makeWord(['p', 'u', 'p'], 3),
]);

// === Tests ===

describe('createPlaylistState', () => {
  it('creates state starting at index 0 with focus mode off', () => {
    const state = createPlaylistState(samplePlaylist);

    expect(state.playlistId).toBe('playlist-1');
    expect(state.currentIndex).toBe(0);
    expect(state.isFocusMode).toBe(false);
  });
});

describe('nextWord', () => {
  it('advances the index by one', () => {
    const state = createPlaylistState(samplePlaylist);
    const result = nextWord(state, samplePlaylist);

    expect(result.currentIndex).toBe(1);
  });

  it('advances through multiple words', () => {
    let state = createPlaylistState(samplePlaylist);
    state = nextWord(state, samplePlaylist);
    state = nextWord(state, samplePlaylist);

    expect(state.currentIndex).toBe(2);
  });

  it('clamps at the last word', () => {
    let state = createPlaylistState(samplePlaylist);
    // Advance to last word
    state = nextWord(state, samplePlaylist); // 1
    state = nextWord(state, samplePlaylist); // 2
    state = nextWord(state, samplePlaylist); // 3

    // Try going past the end
    const result = nextWord(state, samplePlaylist);

    expect(result.currentIndex).toBe(3);
    expect(result).toBe(state); // returns same reference
  });

  it('does not mutate original state', () => {
    const state = createPlaylistState(samplePlaylist);
    nextWord(state, samplePlaylist);

    expect(state.currentIndex).toBe(0);
  });
});

describe('previousWord', () => {
  it('goes back by one', () => {
    let state = createPlaylistState(samplePlaylist);
    state = nextWord(state, samplePlaylist); // 1
    state = nextWord(state, samplePlaylist); // 2

    const result = previousWord(state);

    expect(result.currentIndex).toBe(1);
  });

  it('clamps at the first word', () => {
    const state = createPlaylistState(samplePlaylist);

    const result = previousWord(state);

    expect(result.currentIndex).toBe(0);
    expect(result).toBe(state); // returns same reference
  });

  it('does not mutate original state', () => {
    let state = createPlaylistState(samplePlaylist);
    state = nextWord(state, samplePlaylist);
    const snapshot = state.currentIndex;

    previousWord(state);

    expect(state.currentIndex).toBe(snapshot);
  });
});

describe('goToWord', () => {
  it('jumps to specified index', () => {
    const state = createPlaylistState(samplePlaylist);
    const result = goToWord(state, 2);

    expect(result.currentIndex).toBe(2);
  });

  it('returns unchanged state for negative index', () => {
    const state = createPlaylistState(samplePlaylist);
    const result = goToWord(state, -1);

    expect(result).toBe(state);
  });

  it('allows setting index to 0', () => {
    let state = createPlaylistState(samplePlaylist);
    state = nextWord(state, samplePlaylist);

    const result = goToWord(state, 0);

    expect(result.currentIndex).toBe(0);
  });
});

describe('toggleFocusMode', () => {
  it('enables focus mode when off', () => {
    const state = createPlaylistState(samplePlaylist);
    const result = toggleFocusMode(state);

    expect(result.isFocusMode).toBe(true);
  });

  it('disables focus mode when on', () => {
    let state = createPlaylistState(samplePlaylist);
    state = toggleFocusMode(state);
    const result = toggleFocusMode(state);

    expect(result.isFocusMode).toBe(false);
  });

  it('preserves other state fields', () => {
    let state = createPlaylistState(samplePlaylist);
    state = nextWord(state, samplePlaylist);
    const result = toggleFocusMode(state);

    expect(result.playlistId).toBe(state.playlistId);
    expect(result.currentIndex).toBe(state.currentIndex);
  });
});

describe('getCurrentWord', () => {
  it('returns the word at current index', () => {
    const state = createPlaylistState(samplePlaylist);
    const word = getCurrentWord(state, samplePlaylist);

    expect(word.graphemes).toEqual(['c', 'a', 't']);
    expect(word.position).toBe(0);
  });

  it('returns correct word after advancing', () => {
    let state = createPlaylistState(samplePlaylist);
    state = nextWord(state, samplePlaylist);
    state = nextWord(state, samplePlaylist);

    const word = getCurrentWord(state, samplePlaylist);

    expect(word.graphemes).toEqual(['c', 'u', 'p']);
  });

  it('throws RangeError for out-of-bounds index', () => {
    const state = { playlistId: 'p', currentIndex: 99, isFocusMode: false };

    expect(() => getCurrentWord(state, samplePlaylist)).toThrow(RangeError);
  });
});

describe('getChangedPhoneme', () => {
  it('identifies the changed position (last phoneme)', () => {
    const prev = makeWord(['c', 'a', 't'], 0);
    const next = makeWord(['c', 'a', 'p'], 1);

    expect(getChangedPhoneme(prev, next)).toBe(2);
  });

  it('identifies the changed position (middle phoneme)', () => {
    const prev = makeWord(['c', 'a', 'p'], 1);
    const next = makeWord(['c', 'u', 'p'], 2);

    expect(getChangedPhoneme(prev, next)).toBe(1);
  });

  it('identifies the changed position (first phoneme)', () => {
    const prev = makeWord(['c', 'u', 'p'], 2);
    const next = makeWord(['p', 'u', 'p'], 3);

    expect(getChangedPhoneme(prev, next)).toBe(0);
  });

  it('returns -1 for identical words', () => {
    const word = makeWord(['c', 'a', 't'], 0);

    expect(getChangedPhoneme(word, word)).toBe(-1);
  });

  it('returns -1 for two empty words', () => {
    const empty = makeWord([], 0);

    expect(getChangedPhoneme(empty, empty)).toBe(-1);
  });

  it('handles words of different lengths', () => {
    const short = makeWord(['c', 'a', 't'], 0);
    const long = makeWord(['c', 'a', 't', 's'], 1);

    expect(getChangedPhoneme(short, long)).toBe(3);
  });

  it('detects first difference when multiple positions differ', () => {
    const prev = makeWord(['c', 'a', 't'], 0);
    const next = makeWord(['b', 'i', 'g'], 1);

    expect(getChangedPhoneme(prev, next)).toBe(0);
  });
});

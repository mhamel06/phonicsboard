import { describe, it, expect } from 'vitest';
import {
  createDeckState,
  placeTile,
  resetCards,
  shuffleColumn,
  shuffleAllColumns,
  toggleColumnCollapse,
  getHistory,
  addToHistory,
  isVowelGrapheme,
} from '../../src/engine/deck';
import type { Deck, DeckColumn, Grapheme } from '../../src/engine/types';

// === Test Helpers ===

function makeGrapheme(
  text: string,
  type: Grapheme['type'] = 'consonant',
  color: Grapheme['color'] = 'blue',
): Grapheme {
  return { id: `g-${text}`, text, type, color };
}

function makeColumn(
  position: number,
  graphemes: Grapheme[],
  isCollapsed = false,
): DeckColumn {
  return {
    id: `col-${position}`,
    position,
    graphemes,
    isCollapsed,
  };
}

function makeDeck(columns: DeckColumn[]): Deck {
  return {
    id: 'deck-1',
    name: 'Test Deck',
    isPreset: false,
    columns,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };
}

// === Tests ===

describe('createDeckState', () => {
  it('creates state with null cards matching column count', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('b')]),
      makeColumn(1, [makeGrapheme('a', 'vowel', 'green')]),
      makeColumn(2, [makeGrapheme('t')]),
    ]);

    const state = createDeckState(deck);

    expect(state.deckId).toBe('deck-1');
    expect(state.activeCards).toEqual([null, null, null]);
    expect(state.history).toEqual([]);
  });

  it('creates empty active cards for deck with no columns', () => {
    const deck = makeDeck([]);
    const state = createDeckState(deck);

    expect(state.activeCards).toEqual([]);
  });
});

describe('placeTile', () => {
  it('places grapheme in correct slot', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('b')]),
      makeColumn(1, [makeGrapheme('a', 'vowel', 'green')]),
      makeColumn(2, [makeGrapheme('t')]),
    ]);
    const state = createDeckState(deck);
    const tile = makeGrapheme('b');

    const result = placeTile(state, 0, tile);

    expect(result.activeCards[0]).toEqual(tile);
    expect(result.activeCards[1]).toBeNull();
    expect(result.activeCards[2]).toBeNull();
  });

  it('replaces existing tile in a slot', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('b'), makeGrapheme('c')]),
    ]);
    let state = createDeckState(deck);

    state = placeTile(state, 0, makeGrapheme('b'));
    state = placeTile(state, 0, makeGrapheme('c'));

    expect(state.activeCards[0]?.text).toBe('c');
  });

  it('returns unchanged state for out-of-bounds index', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('b')])]);
    const state = createDeckState(deck);

    const result = placeTile(state, 5, makeGrapheme('x'));

    expect(result).toBe(state);
  });

  it('returns unchanged state for negative index', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('b')])]);
    const state = createDeckState(deck);

    const result = placeTile(state, -1, makeGrapheme('x'));

    expect(result).toBe(state);
  });

  it('does not mutate original state', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('b')])]);
    const state = createDeckState(deck);
    const original = { ...state, activeCards: [...state.activeCards] };

    placeTile(state, 0, makeGrapheme('b'));

    expect(state).toEqual(original);
  });
});

describe('resetCards', () => {
  it('clears all slots to null', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('b')]),
      makeColumn(1, [makeGrapheme('a', 'vowel', 'green')]),
      makeColumn(2, [makeGrapheme('t')]),
    ]);
    let state = createDeckState(deck);
    state = placeTile(state, 0, makeGrapheme('b'));
    state = placeTile(state, 1, makeGrapheme('a', 'vowel', 'green'));
    state = placeTile(state, 2, makeGrapheme('t'));

    const result = resetCards(state);

    expect(result.activeCards).toEqual([null, null, null]);
  });

  it('preserves history when resetting', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('b')])]);
    let state = createDeckState(deck);
    state = placeTile(state, 0, makeGrapheme('b'));
    state = addToHistory(state);
    state = resetCards(state);

    expect(state.history).toHaveLength(1);
    expect(state.activeCards).toEqual([null]);
  });
});

describe('shuffleColumn', () => {
  it('returns a column with the same graphemes', () => {
    const graphemes = [
      makeGrapheme('b'),
      makeGrapheme('c'),
      makeGrapheme('d'),
      makeGrapheme('f'),
    ];
    const column = makeColumn(0, graphemes);

    const result = shuffleColumn(column);

    expect(result.graphemes).toHaveLength(4);
    expect(result.graphemes.map((g) => g.text).sort()).toEqual(
      ['b', 'c', 'd', 'f'],
    );
  });

  it('preserves column metadata', () => {
    const column = makeColumn(2, [makeGrapheme('x')], true);
    const result = shuffleColumn(column);

    expect(result.id).toBe(column.id);
    expect(result.position).toBe(2);
    expect(result.isCollapsed).toBe(true);
  });

  it('does not mutate original column', () => {
    const graphemes = [makeGrapheme('a', 'vowel'), makeGrapheme('b')];
    const column = makeColumn(0, graphemes);
    const originalIds = column.graphemes.map((g) => g.id);

    shuffleColumn(column);

    expect(column.graphemes.map((g) => g.id)).toEqual(originalIds);
  });

  it('randomizes order (statistical test)', () => {
    const graphemes = Array.from({ length: 10 }, (_, i) =>
      makeGrapheme(String(i)),
    );
    const column = makeColumn(0, graphemes);

    // Run multiple shuffles and check at least one differs from original
    const results = Array.from({ length: 20 }, () => shuffleColumn(column));
    const original = graphemes.map((g) => g.text).join(',');
    const anyDifferent = results.some(
      (r) => r.graphemes.map((g) => g.text).join(',') !== original,
    );

    expect(anyDifferent).toBe(true);
  });
});

describe('shuffleAllColumns', () => {
  it('shuffles every column independently', () => {
    const deck = makeDeck([
      makeColumn(0, Array.from({ length: 8 }, (_, i) => makeGrapheme(`a${i}`))),
      makeColumn(1, Array.from({ length: 8 }, (_, i) => makeGrapheme(`b${i}`))),
    ]);

    const result = shuffleAllColumns(deck);

    expect(result.columns).toHaveLength(2);
    expect(result.columns[0].graphemes).toHaveLength(8);
    expect(result.columns[1].graphemes).toHaveLength(8);
  });

  it('does not mutate original deck', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('x'), makeGrapheme('y')]),
    ]);
    const originalTexts = deck.columns[0].graphemes.map((g) => g.text);

    shuffleAllColumns(deck);

    expect(deck.columns[0].graphemes.map((g) => g.text)).toEqual(originalTexts);
  });
});

describe('toggleColumnCollapse', () => {
  it('collapses an expanded column', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('a', 'vowel')])]);

    const result = toggleColumnCollapse(deck, 0);

    expect(result.columns[0].isCollapsed).toBe(true);
  });

  it('expands a collapsed column', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('a', 'vowel')], true)]);

    const result = toggleColumnCollapse(deck, 0);

    expect(result.columns[0].isCollapsed).toBe(false);
  });

  it('returns unchanged deck for out-of-bounds index', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('a', 'vowel')])]);

    const result = toggleColumnCollapse(deck, 5);

    expect(result).toBe(deck);
  });
});

describe('history tracking', () => {
  it('addToHistory snapshots current cards', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('c')]),
      makeColumn(1, [makeGrapheme('a', 'vowel', 'green')]),
      makeColumn(2, [makeGrapheme('t')]),
    ]);
    let state = createDeckState(deck);
    state = placeTile(state, 0, makeGrapheme('c'));
    state = placeTile(state, 1, makeGrapheme('a', 'vowel', 'green'));
    state = placeTile(state, 2, makeGrapheme('t'));

    state = addToHistory(state);

    const history = getHistory(state);
    expect(history).toHaveLength(1);
    expect(history[0].map((g) => g.text)).toEqual(['c', 'a', 't']);
  });

  it('does not add empty words to history', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('b')])]);
    const state = createDeckState(deck);

    const result = addToHistory(state);

    expect(result.history).toHaveLength(0);
    expect(result).toBe(state);
  });

  it('only includes non-null cards in snapshot', () => {
    const deck = makeDeck([
      makeColumn(0, [makeGrapheme('c')]),
      makeColumn(1, [makeGrapheme('a', 'vowel', 'green')]),
      makeColumn(2, [makeGrapheme('t')]),
    ]);
    let state = createDeckState(deck);
    state = placeTile(state, 0, makeGrapheme('c'));
    // leave slot 1 empty
    state = placeTile(state, 2, makeGrapheme('t'));

    state = addToHistory(state);

    expect(state.history[0]).toHaveLength(2);
    expect(state.history[0].map((g) => g.text)).toEqual(['c', 't']);
  });

  it('accumulates multiple history entries', () => {
    const deck = makeDeck([makeColumn(0, [makeGrapheme('a', 'vowel')])]);
    let state = createDeckState(deck);

    state = placeTile(state, 0, makeGrapheme('a', 'vowel'));
    state = addToHistory(state);

    state = placeTile(state, 0, makeGrapheme('e', 'vowel'));
    state = addToHistory(state);

    expect(state.history).toHaveLength(2);
    expect(state.history[0][0].text).toBe('a');
    expect(state.history[1][0].text).toBe('e');
  });
});

describe('isVowelGrapheme', () => {
  it('identifies vowel type as vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('a', 'vowel', 'green'))).toBe(true);
  });

  it('identifies vowel_team as vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('ea', 'vowel_team', 'teal'))).toBe(true);
  });

  it('identifies r_controlled as vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('ar', 'r_controlled', 'teal'))).toBe(true);
  });

  it('identifies schwa as vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('e', 'schwa', 'green'))).toBe(true);
  });

  it('identifies consonant as non-vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('b'))).toBe(false);
  });

  it('identifies digraph as non-vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('sh', 'digraph', 'orange'))).toBe(false);
  });

  it('identifies blend as non-vowel', () => {
    expect(isVowelGrapheme(makeGrapheme('cr', 'blend', 'blue'))).toBe(false);
  });
});

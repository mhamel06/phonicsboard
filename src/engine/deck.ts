// Deck engine — pure functions, ZERO React dependencies

import type { Deck, DeckColumn, DeckState, Grapheme } from './types';

/**
 * Creates initial runtime state for a deck session.
 * Active cards array matches the number of columns, all initially null.
 */
export function createDeckState(deck: Deck): DeckState {
  return {
    deckId: deck.id,
    activeCards: deck.columns.map(() => null),
    history: [],
  };
}

/**
 * Places a grapheme tile into the card slot at the given column index.
 * Returns a new state with the tile placed; does not mutate the original.
 */
export function placeTile(
  state: DeckState,
  columnIndex: number,
  grapheme: Grapheme,
): DeckState {
  if (columnIndex < 0 || columnIndex >= state.activeCards.length) {
    return state;
  }

  const activeCards = [...state.activeCards];
  activeCards[columnIndex] = grapheme;

  return { ...state, activeCards };
}

/**
 * Clears all card slots back to null.
 */
export function resetCards(state: DeckState): DeckState {
  return {
    ...state,
    activeCards: state.activeCards.map(() => null),
  };
}

/**
 * Returns a new column with its graphemes in a random order.
 * Uses Fisher-Yates shuffle for uniform distribution.
 */
export function shuffleColumn(column: DeckColumn): DeckColumn {
  const graphemes = [...column.graphemes];

  for (let i = graphemes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [graphemes[i], graphemes[j]] = [graphemes[j], graphemes[i]];
  }

  return { ...column, graphemes };
}

/**
 * Shuffles every column in the deck independently.
 */
export function shuffleAllColumns(deck: Deck): Deck {
  return {
    ...deck,
    columns: deck.columns.map(shuffleColumn),
  };
}

/**
 * Toggles the collapsed state of a specific column.
 */
export function toggleColumnCollapse(
  deck: Deck,
  columnIndex: number,
): Deck {
  if (columnIndex < 0 || columnIndex >= deck.columns.length) {
    return deck;
  }

  const columns = deck.columns.map((col, i) =>
    i === columnIndex ? { ...col, isCollapsed: !col.isCollapsed } : col,
  );

  return { ...deck, columns };
}

/**
 * Returns the full history of previously displayed words.
 */
export function getHistory(state: DeckState): Grapheme[][] {
  return state.history;
}

/**
 * Snapshots the current active cards into the history array.
 * Only non-null cards are included in the snapshot.
 * If all cards are null, no snapshot is added.
 */
export function addToHistory(state: DeckState): DeckState {
  const currentWord = state.activeCards.filter(
    (card): card is Grapheme => card !== null,
  );

  if (currentWord.length === 0) {
    return state;
  }

  return {
    ...state,
    history: [...state.history, currentWord],
  };
}

/**
 * Checks whether a grapheme is a vowel type.
 * Vowel types include: vowel, vowel_team, r_controlled, schwa.
 */
export function isVowelGrapheme(grapheme: Grapheme): boolean {
  return (
    grapheme.type === 'vowel' ||
    grapheme.type === 'vowel_team' ||
    grapheme.type === 'r_controlled' ||
    grapheme.type === 'schwa'
  );
}

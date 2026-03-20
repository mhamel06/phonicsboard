// Word Mat engine — pure functions, ZERO React dependencies

import type {
  ElkoninBox,
  Grapheme,
  WordMatMode,
  WordMatPreset,
  WordMatState,
} from './types';

/** Simple ID generator that does not depend on crypto.randomUUID */
function generateBoxId(): string {
  return `box-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Creates initial runtime state for a word mat session.
 * Starts in 'sounds' mode with no boxes and no selected tile.
 */
export function createWordMatState(preset: WordMatPreset): WordMatState {
  return {
    presetId: preset.id,
    mode: 'sounds',
    boxes: [],
    selectedTile: null,
  };
}

/**
 * Adds a new empty Elkonin box to the workspace.
 * The new box is appended at the end with syllableGroup 0.
 */
export function addBox(state: WordMatState): WordMatState {
  const newBox: ElkoninBox = {
    id: generateBoxId(),
    content: null,
    syllableGroup: 0,
  };

  return {
    ...state,
    boxes: [...state.boxes, newBox],
  };
}

/**
 * Removes an Elkonin box by its ID.
 * Returns unchanged state if boxId is not found.
 */
export function removeBox(
  state: WordMatState,
  boxId: string,
): WordMatState {
  const filtered = state.boxes.filter((box) => box.id !== boxId);

  if (filtered.length === state.boxes.length) {
    return state;
  }

  return {
    ...state,
    boxes: filtered,
  };
}

/**
 * Selects a grapheme tile from the keyboard.
 * The selected tile can then be placed into a box via placeTileInBox.
 */
export function selectTile(
  state: WordMatState,
  grapheme: Grapheme,
): WordMatState {
  return {
    ...state,
    selectedTile: grapheme,
  };
}

/**
 * Places the currently selected tile into the specified Elkonin box.
 * Clears the selected tile after placement.
 * Returns unchanged state if no tile is selected or boxId is not found.
 */
export function placeTileInBox(
  state: WordMatState,
  boxId: string,
): WordMatState {
  if (!state.selectedTile) {
    return state;
  }

  const boxExists = state.boxes.some((box) => box.id === boxId);
  if (!boxExists) {
    return state;
  }

  return {
    ...state,
    boxes: state.boxes.map((box) =>
      box.id === boxId ? { ...box, content: state.selectedTile } : box,
    ),
    selectedTile: null,
  };
}

/**
 * Clears the content of a specific Elkonin box.
 * Returns unchanged state if boxId is not found.
 */
export function clearBox(
  state: WordMatState,
  boxId: string,
): WordMatState {
  const boxExists = state.boxes.some((box) => box.id === boxId);
  if (!boxExists) {
    return state;
  }

  return {
    ...state,
    boxes: state.boxes.map((box) =>
      box.id === boxId ? { ...box, content: null } : box,
    ),
  };
}

/**
 * Clears the content of all Elkonin boxes.
 * Boxes remain in place; only their content is removed.
 */
export function clearAllBoxes(state: WordMatState): WordMatState {
  return {
    ...state,
    boxes: state.boxes.map((box) => ({ ...box, content: null })),
  };
}

/**
 * Switches the word mat operating mode.
 * Also deselects any currently selected tile.
 */
export function switchMode(
  state: WordMatState,
  mode: WordMatMode,
): WordMatState {
  return {
    ...state,
    mode,
    selectedTile: null,
  };
}

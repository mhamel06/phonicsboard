import { describe, it, expect } from 'vitest';
import {
  createWordMatState,
  addBox,
  removeBox,
  selectTile,
  placeTileInBox,
  clearBox,
  clearAllBoxes,
  switchMode,
} from '../../src/engine/word-mat';
import type { Grapheme, WordMatPreset } from '../../src/engine/types';

// === Test Helpers ===

function makeGrapheme(
  text: string,
  type: Grapheme['type'] = 'consonant',
  color: Grapheme['color'] = 'blue',
): Grapheme {
  return { id: `g-${text}`, text, type, color };
}

function makePreset(): WordMatPreset {
  return {
    id: 'preset-1',
    name: 'A-Z Tiles',
    keyboard: [
      {
        label: 'Consonants',
        tiles: [makeGrapheme('b'), makeGrapheme('c'), makeGrapheme('d')],
      },
      {
        label: 'Vowels',
        tiles: [
          makeGrapheme('a', 'vowel', 'green'),
          makeGrapheme('e', 'vowel', 'green'),
        ],
      },
    ],
  };
}

// === Tests ===

describe('createWordMatState', () => {
  it('creates state with defaults', () => {
    const state = createWordMatState(makePreset());

    expect(state.presetId).toBe('preset-1');
    expect(state.mode).toBe('sounds');
    expect(state.boxes).toEqual([]);
    expect(state.selectedTile).toBeNull();
  });
});

describe('addBox', () => {
  it('adds a new empty box', () => {
    const state = createWordMatState(makePreset());
    const result = addBox(state);

    expect(result.boxes).toHaveLength(1);
    expect(result.boxes[0].content).toBeNull();
    expect(result.boxes[0].syllableGroup).toBe(0);
    expect(result.boxes[0].id).toBeTruthy();
  });

  it('appends boxes sequentially', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    state = addBox(state);
    state = addBox(state);

    expect(state.boxes).toHaveLength(3);
    // Each box has a unique ID
    const ids = state.boxes.map((b) => b.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('does not mutate original state', () => {
    const state = createWordMatState(makePreset());
    addBox(state);

    expect(state.boxes).toHaveLength(0);
  });
});

describe('removeBox', () => {
  it('removes a box by ID', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    state = addBox(state);
    const boxId = state.boxes[0].id;

    const result = removeBox(state, boxId);

    expect(result.boxes).toHaveLength(1);
    expect(result.boxes[0].id).not.toBe(boxId);
  });

  it('returns unchanged state for unknown boxId', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);

    const result = removeBox(state, 'nonexistent');

    expect(result).toBe(state);
  });
});

describe('selectTile', () => {
  it('sets the selected tile', () => {
    const state = createWordMatState(makePreset());
    const tile = makeGrapheme('b');

    const result = selectTile(state, tile);

    expect(result.selectedTile).toEqual(tile);
  });

  it('replaces previously selected tile', () => {
    let state = createWordMatState(makePreset());
    state = selectTile(state, makeGrapheme('b'));
    state = selectTile(state, makeGrapheme('c'));

    expect(state.selectedTile?.text).toBe('c');
  });
});

describe('placeTileInBox', () => {
  it('places selected tile into the target box', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    const boxId = state.boxes[0].id;
    const tile = makeGrapheme('b');
    state = selectTile(state, tile);

    const result = placeTileInBox(state, boxId);

    expect(result.boxes[0].content).toEqual(tile);
    expect(result.selectedTile).toBeNull();
  });

  it('returns unchanged state if no tile is selected', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    const boxId = state.boxes[0].id;

    const result = placeTileInBox(state, boxId);

    expect(result).toBe(state);
  });

  it('returns unchanged state for unknown boxId', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    state = selectTile(state, makeGrapheme('b'));

    const result = placeTileInBox(state, 'nonexistent');

    expect(result).toBe(state);
  });

  it('replaces existing content in box', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    const boxId = state.boxes[0].id;

    state = selectTile(state, makeGrapheme('b'));
    state = placeTileInBox(state, boxId);

    state = selectTile(state, makeGrapheme('c'));
    state = placeTileInBox(state, boxId);

    expect(state.boxes[0].content?.text).toBe('c');
  });

  it('only affects the targeted box', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    state = addBox(state);
    const targetId = state.boxes[1].id;

    state = selectTile(state, makeGrapheme('x'));
    state = placeTileInBox(state, targetId);

    expect(state.boxes[0].content).toBeNull();
    expect(state.boxes[1].content?.text).toBe('x');
  });
});

describe('clearBox', () => {
  it('clears content of a specific box', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    const boxId = state.boxes[0].id;
    state = selectTile(state, makeGrapheme('b'));
    state = placeTileInBox(state, boxId);

    const result = clearBox(state, boxId);

    expect(result.boxes[0].content).toBeNull();
  });

  it('returns unchanged state for unknown boxId', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);

    const result = clearBox(state, 'nonexistent');

    expect(result).toBe(state);
  });
});

describe('clearAllBoxes', () => {
  it('clears content of all boxes', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    state = addBox(state);

    state = selectTile(state, makeGrapheme('b'));
    state = placeTileInBox(state, state.boxes[0].id);
    state = selectTile(state, makeGrapheme('a', 'vowel', 'green'));
    state = placeTileInBox(state, state.boxes[1].id);

    const result = clearAllBoxes(state);

    expect(result.boxes).toHaveLength(2);
    expect(result.boxes.every((box) => box.content === null)).toBe(true);
  });

  it('preserves box IDs and structure', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    const boxId = state.boxes[0].id;

    const result = clearAllBoxes(state);

    expect(result.boxes[0].id).toBe(boxId);
  });
});

describe('switchMode', () => {
  it('switches to graphemes mode', () => {
    const state = createWordMatState(makePreset());
    const result = switchMode(state, 'graphemes');

    expect(result.mode).toBe('graphemes');
  });

  it('switches to syllables mode', () => {
    const state = createWordMatState(makePreset());
    const result = switchMode(state, 'syllables');

    expect(result.mode).toBe('syllables');
  });

  it('clears selected tile when switching mode', () => {
    let state = createWordMatState(makePreset());
    state = selectTile(state, makeGrapheme('b'));

    const result = switchMode(state, 'graphemes');

    expect(result.selectedTile).toBeNull();
  });

  it('preserves boxes when switching mode', () => {
    let state = createWordMatState(makePreset());
    state = addBox(state);
    state = addBox(state);

    const result = switchMode(state, 'syllables');

    expect(result.boxes).toHaveLength(2);
  });
});

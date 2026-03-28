// === Phonics Types ===
// Pure TypeScript types — ZERO React/React Native dependencies

/** Classification of a grapheme by its phonics category */
export type GraphemeType =
  | 'consonant'
  | 'vowel'
  | 'blend'          // cr, pl, tr
  | 'digraph'        // ch, sh, th
  | 'vowel_team'     // ai, ea, ee
  | 'r_controlled'   // ar, er, ir
  | 'prefix'         // re-, un-, pre-
  | 'root'           // ject, spond, tract
  | 'suffix'         // es, ing, ed
  | 'schwa'          // unstressed vowel sound
  | 'heart'          // irregular/tricky words
  | 'blank';         // colored blank (phonemes-only mode)

/** Tile color used for phonics color-coding */
export type TileColor =
  | 'blue'        // consonants
  | 'green'       // vowels (A-Z tiles)
  | 'orange'      // digraphs
  | 'teal'        // vowel teams, r-controlled
  | 'purple'      // suffixes
  | 'pink'        // initial/final consonants (deck mode)
  | 'lavender'    // endings
  | 'yellow'      // vowel highlight (display)
  | 'white'       // consonant display
  | 'red'         // accent color
  | 'peach';      // accent color

/** A single grapheme tile */
export interface Grapheme {
  /** Unique identifier */
  id: string;
  /** Display text, 1-5 characters */
  text: string;
  /** Phonics classification */
  type: GraphemeType;
  /** Color-coding for the tile */
  color: TileColor;
}

// === Deck ===

/** A blending board deck containing columns of grapheme tiles */
export interface Deck {
  id: string;
  name: string;
  isPreset: boolean;
  columns: DeckColumn[];
  createdAt: string;
  updatedAt: string;
}

/** A single column within a deck */
export interface DeckColumn {
  id: string;
  /** Column position, 0-5 */
  position: number;
  /** Grapheme tiles in this column */
  graphemes: Grapheme[];
  /** Whether the column is visually collapsed */
  isCollapsed: boolean;
}

/** Runtime state for an active deck session */
export interface DeckState {
  deckId: string;
  /** Current word displayed in card slots, null = empty slot */
  activeCards: (Grapheme | null)[];
  /** Previously shown words */
  history: Grapheme[][];
}

// === Playlist ===

/** A sequence of words for blending practice */
export interface Playlist {
  id: string;
  name: string;
  linkedDeckId: string;
  words: PlaylistWord[];
  isPreset: boolean;
  createdAt: string;
}

/** A single word in a playlist, decomposed into graphemes */
export interface PlaylistWord {
  /** Ordered grapheme texts that form this word */
  graphemes: string[];
  /** Index position in the playlist chain */
  position: number;
  /** Which column positions are visible (if undefined, all are visible) */
  activeColumns?: number[];
}

/** Runtime state for an active playlist session */
export interface PlaylistState {
  playlistId: string;
  currentIndex: number;
  isFocusMode: boolean;
  isShuffled: boolean;
  /** Maps display position to original word index */
  shuffledOrder: number[];
}

// === Word Mat ===

/** Operating mode for the word mat */
export type WordMatMode = 'syllables' | 'sounds' | 'graphemes';

/** A predefined word mat configuration */
export interface WordMatPreset {
  id: string;
  name: string;
  keyboard: TileGroup[];
  theme?: WordMatTheme;
}

/** A labeled group of tiles on the word mat keyboard */
export interface TileGroup {
  label?: string;
  tiles: Grapheme[];
}

/** A single Elkonin box for segmenting sounds */
export interface ElkoninBox {
  id: string;
  /** The grapheme placed in this box, or null if empty */
  content: Grapheme | null;
  /** Which syllable group this box belongs to */
  syllableGroup: number;
}

/** Runtime state for an active word mat session */
export interface WordMatState {
  presetId: string;
  mode: WordMatMode;
  boxes: ElkoninBox[];
  selectedTile: Grapheme | null;
}

// === Progress ===

/** Tracks a student's progress across blending and spelling activities */
export interface StudentProgress {
  id: string;
  name: string;
  wordsBlended: number;
  wordsSpelled: number;
  /** Percentage correct per grapheme type */
  accuracy: Record<GraphemeType, number>;
  streak: number;
  totalSessions: number;
  lastActive: string;
}

// === Theme ===

/** Visual theme configuration for word mats */
export interface WordMatTheme {
  name: string;
  backgroundImage?: string;
  vowelColor: TileColor;
  accentColor: TileColor;
  brandLogo?: string;
}

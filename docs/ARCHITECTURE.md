# PhonicsBoard — Architecture & Design Plan

## 1. Product Vision

**PhonicsBoard** is a free, cross-platform phonics blending board web app for educators and students. It replicates the core value of Blend Reading (virtual blending boards, word chains, Elkonin boxes) while adding student-facing features that Blend lacks: audio support, gamification, progress tracking, and self-practice mode.

**Key differentiator:** Free for educators. Blend Reading charges $10/month for Pro features — PhonicsBoard makes all features free.

### Target Users
- **Primary:** K-3 teachers, reading specialists, literacy tutors
- **Secondary:** Parents doing home instruction, students (self-practice mode)
- **Tertiary:** School districts evaluating free alternatives

### Competitive Advantages Over Blend Reading
| Feature | Blend Reading | PhonicsBoard |
|---------|--------------|--------------|
| Price | $10/mo (Pro) | Free |
| Word Mats | Pro only | Free |
| Custom decks | 1 free, unlimited Pro | Unlimited free |
| Audio/TTS | None | Built-in phoneme audio |
| Student mode | None (teacher-only) | Self-practice with audio |
| Progress tracking | None | Per-student dashboard |
| Gamification | None | Points, streaks, badges |
| Offline | No | PWA with offline support |
| Open source | No | Yes |

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Expo (React Native + Web) | Same stack as Tessera/Azule — team expertise, single codebase for web + mobile |
| **Language** | TypeScript (strict) | Type safety for complex phonics data models |
| **Routing** | Expo Router (file-based) | Consistent with azule project patterns |
| **State** | Redux Toolkit | Complex state with multiple modules (decks, playlists, word mats) |
| **Rendering** | React Native + SVG | Cross-platform tile rendering, touch-friendly |
| **Audio** | expo-av | Phoneme pronunciation, TTS |
| **Storage** | AsyncStorage + SQLite | Local persistence for decks, playlists, progress |
| **Testing** | Vitest (engine) + Jest (components) | Fast unit tests for pure logic, component tests for UI |
| **E2E** | Playwright | Cross-browser testing |
| **Design** | Pencil.dev | Mockups before implementation |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

---

## 3. Architecture Overview

### 3.1 Domain-Driven Design — Bounded Contexts

```
┌─────────────────────────────────────────────────────┐
│                    PhonicsBoard                      │
├──────────┬──────────┬──────────┬────────────────────┤
│  Phonics │  Decks   │ Playlists│    Word Mats       │
│  Engine  │  Module  │  Module  │    Module          │
│ (shared) │          │          │                    │
├──────────┴──────────┴──────────┴────────────────────┤
│                 Progress Tracking                    │
├─────────────────────────────────────────────────────┤
│              Audio Engine (TTS/Phonemes)             │
├─────────────────────────────────────────────────────┤
│           Gamification (points, streaks)             │
├─────────────────────────────────────────────────────┤
│          Persistence (AsyncStorage/SQLite)           │
└─────────────────────────────────────────────────────┘
```

### 3.2 File Structure

```
/app                          # Expo Router pages
  /(tabs)/
    index.tsx                  # Home — Decks tab
    playlists.tsx              # Playlists tab
    word-mats.tsx              # Word Mats tab
    progress.tsx               # Progress dashboard
  /deck/
    [id].tsx                   # Deck play screen
    editor/[id].tsx            # Deck editor
  /playlist/
    [id].tsx                   # Playlist play screen
    editor/[id].tsx            # Playlist editor
  /word-mat/
    [preset].tsx               # Word Mat play screen
  _layout.tsx                  # Root layout

/src
  /engine                     # Pure TypeScript — ZERO React dependencies
    types.ts                   # All phonics types, enums, interfaces
    constants.ts               # Grapheme data, color mappings, presets
    phonics.ts                 # Phoneme/grapheme classification, vowel detection
    deck.ts                    # Deck state management, tile placement
    playlist.ts                # Word chain logic, navigation
    word-mat.ts                # Elkonin box management, tile placement
    scoring.ts                 # Gamification scoring logic

  /components
    /common
      Tile.tsx                 # Reusable phonics tile (color-coded)
      CardSlot.tsx             # Display slot for active word
      TabBar.tsx               # Top navigation (Playlists/Decks/Word Mats)
      Button.tsx               # Shared button component
      SearchFilter.tsx         # "Type to filter" search bar
      EmptyState.tsx           # Empty state with helpful message
    /deck
      DeckBoard.tsx            # Full blending board layout
      TileColumn.tsx           # Column of clickable tiles
      DeckControls.tsx         # Back/Shuffle/Reset/History
      DeckCard.tsx             # Deck selection card
    /playlist
      PlaylistPlayer.tsx       # Word chain player
      WordChainBar.tsx         # Bottom progress bar
      PlaylistCard.tsx         # Playlist list item
    /word-mat
      ElkoninBox.tsx           # Individual sound box
      ElkoninWorkspace.tsx     # Box creation workspace
      TileKeyboard.tsx         # Tile selection keyboard
      ModeSelector.tsx         # syllables/sounds/graphemes tabs
    /editor
      DeckEditor.tsx           # Deck creation/editing
      PlaylistEditor.tsx       # Playlist creation/editing
      ColorPalette.tsx         # Color picker sidebar
    /progress
      ProgressDashboard.tsx    # Student progress overview
      SkillMastery.tsx         # Individual skill tracking

  /hooks
    useDecks.ts                # Deck state management hook
    usePlaylists.ts            # Playlist state management hook
    useWordMat.ts              # Word Mat state management hook
    useAudio.ts                # Audio playback hook
    useProgress.ts             # Progress tracking hook

  /store                       # Redux Toolkit slices
    decksSlice.ts
    playlistsSlice.ts
    wordMatsSlice.ts
    progressSlice.ts
    settingsSlice.ts
    store.ts

  /data                        # Preloaded content
    presets/
      separated-blends.json    # Default Separated Blends deck
      combined-blends.json     # Default Combined Blends deck
    playlists/
      cvc-mix.json             # CVC word chain
      vowel-teams-mix.json     # Vowel teams word chain
    word-mats/
      az-tiles.json            # A-Z keyboard layout
      advanced-sounds.json     # Full phonics keyboard
      phonemes-only.json       # Color blocks only
    audio/
      phonemes/                # Individual phoneme audio files

  /utils
    colors.ts                  # Color palette and theme
    storage.ts                 # AsyncStorage/SQLite helpers
    audio.ts                   # Audio file loading utilities

/__tests__
  /engine                      # Pure engine tests (Vitest)
  /components                  # Component tests (Jest)
  /e2e                         # End-to-end tests (Playwright)

/assets                        # Images, fonts, sounds
/docs                          # Documentation
/config                        # Configuration files
/scripts                       # Build/deploy scripts
```

---

## 4. Core Data Model

```typescript
// === Phonics Types ===
type GraphemeType =
  | 'consonant'
  | 'vowel'
  | 'blend'           // cr, pl, tr
  | 'digraph'         // ch, sh, th
  | 'vowel_team'      // ai, ea, ee
  | 'r_controlled'    // ar, er, ir
  | 'suffix'          // es, ing, ed
  | 'schwa'           // ə
  | 'heart'           // irregular/tricky
  | 'blank'           // colored blank (phonemes only)

interface Grapheme {
  id: string
  text: string              // 1-5 characters
  type: GraphemeType
  color: TileColor
}

type TileColor =
  | 'blue'        // consonants
  | 'green'       // vowels (A-Z tiles)
  | 'orange'      // digraphs
  | 'teal'        // vowel teams, r-controlled
  | 'purple'      // suffixes
  | 'pink'        // initial/final consonants (deck mode)
  | 'lavender'    // endings
  | 'yellow'      // vowel highlight (display)
  | 'white'       // consonant display
  | 'red' | 'peach' // accent colors

// === Deck ===
interface Deck {
  id: string
  name: string
  isPreset: boolean
  columns: DeckColumn[]
  createdAt: string
  updatedAt: string
}

interface DeckColumn {
  id: string
  position: number          // 0-5
  graphemes: Grapheme[]
  isCollapsed: boolean
}

interface DeckState {
  deckId: string
  activeCards: (Grapheme | null)[]  // Current word in display slots
  history: Grapheme[][]             // Previously shown words
}

// === Playlist ===
interface Playlist {
  id: string
  name: string
  linkedDeckId: string
  words: PlaylistWord[]
  isPreset: boolean
  createdAt: string
}

interface PlaylistWord {
  graphemes: string[]        // Ordered grapheme texts
  position: number           // Index in chain
}

interface PlaylistState {
  playlistId: string
  currentIndex: number
  isFocusMode: boolean
}

// === Word Mat ===
type WordMatMode = 'syllables' | 'sounds' | 'graphemes'

interface WordMatPreset {
  id: string
  name: string
  keyboard: TileGroup[]
  theme?: WordMatTheme
}

interface TileGroup {
  label?: string
  tiles: Grapheme[]
}

interface ElkoninBox {
  id: string
  content: Grapheme | null
  syllableGroup: number
}

interface WordMatState {
  presetId: string
  mode: WordMatMode
  boxes: ElkoninBox[]
  selectedTile: Grapheme | null
}

// === Progress ===
interface StudentProgress {
  id: string
  name: string
  wordsBlended: number
  wordsSpelled: number
  accuracy: Record<GraphemeType, number>  // % correct per type
  streak: number
  totalSessions: number
  lastActive: string
}

// === Theme ===
interface WordMatTheme {
  name: string
  backgroundImage?: string
  vowelColor: TileColor
  accentColor: TileColor
  brandLogo?: string
}
```

---

## 5. Design System

### 5.1 Color Palette (Distinct from Blend Reading)

Blend uses blue gradients. PhonicsBoard uses a **warm, earthy palette** with pops of color:

| Element | Color | Hex |
|---------|-------|-----|
| **Background** | Warm cream/off-white | `#FFF8F0` |
| **Primary** | Forest green | `#2D6A4F` |
| **Secondary** | Warm coral | `#E07A5F` |
| **Accent** | Golden yellow | `#F2CC8F` |
| **Surface** | White | `#FFFFFF` |
| **Text primary** | Dark charcoal | `#264653` |
| **Text secondary** | Warm gray | `#6B7280` |

### 5.2 Tile Colors (Phonics Color Coding)

| Grapheme Type | Color | Hex |
|---------------|-------|-----|
| Consonants | Slate blue | `#7C9CBF` |
| Vowels | Warm coral | `#E07A5F` |
| Blends | Sage green | `#81B29A` |
| Digraphs | Amber | `#E9C46A` |
| Vowel teams | Teal | `#2A9D8F` |
| R-controlled | Dusty purple | `#9B8EC4` |
| Suffixes | Soft pink | `#F4A6C1` |
| Vowel display (active) | Warm gold | `#F2CC8F` |
| Consonant display (active) | White | `#FFFFFF` |
| Blank tiles | Various pastels | (6 colors) |

### 5.3 Typography

| Use | Font | Weight |
|-----|------|--------|
| Headings | Nunito | Bold (700) |
| Body | Inter | Regular (400) |
| Tiles | Nunito | Bold (700) |
| Navigation | Inter | Medium (500) |

### 5.4 Design Principles

1. **Clean & modern** — Flat design, no heavy shadows, subtle borders
2. **Touch-first** — Minimum 48x48px tap targets for tiles
3. **High contrast** — WCAG AA compliance for all text/tile combinations
4. **Playful but professional** — Friendly for kids, credible for teachers
5. **Consistent spacing** — 8px grid system
6. **Card-based layout** — Cards for navigation, tiles for interaction

---

## 6. Page Map & User Flows

### 6.1 Pages (10 screens)

1. **Home / Decks Tab** — Card grid of available decks + "+ New" button
2. **Playlists Tab** — List of playlists with play/copy buttons, Library/My sub-tabs
3. **Word Mats Tab** — Card grid of preset word mats
4. **Progress Tab** — Student progress dashboard (NEW - not in Blend)
5. **Deck Play Screen** — Full blending board with tile columns and card slots
6. **Playlist Play Screen** — Word cards + word chain bar + focus mode
7. **Word Mat Play Screen** — Elkonin boxes + tile keyboard + mode selector
8. **Deck Editor** — Column/tile editor with color palette
9. **Playlist Editor** — Word chain builder linked to a deck
10. **Settings / About** — App info, theme toggle, data export

### 6.2 Navigation Structure

```
Tab Bar (bottom on mobile, top on web)
├── Decks (home)
│   ├── Deck Play → [Back to Decks]
│   └── Deck Editor → [Save → Decks]
├── Playlists
│   ├── Blend Library / My Playlists (sub-tabs)
│   ├── Playlist Play → [Back to Playlists]
│   └── Playlist Editor → [Save → Playlists]
├── Word Mats
│   └── Word Mat Play → [Back to Word Mats]
└── Progress (NEW)
    └── Student Detail → [Back to Progress]
```

---

## 7. Release Phases

### Phase 1: Core Blending Board (MVP)
**Goal:** Feature parity with Blend Reading Free tier
- Home screen with tab navigation
- Separated Blends & Combined Blends preset decks
- Deck play screen (tile → card placement, shuffle, reset)
- Basic playlist player with CVC Mix
- Responsive web layout (tablet + desktop)

### Phase 2: Full Feature Parity
**Goal:** Match Blend Reading Pro (but free)
- All 6 preset playlists
- Word Mats (all 4 presets)
- Elkonin box interaction
- Custom deck creation/editing
- Custom playlist creation/editing
- Focus mode
- History tracking

### Phase 3: Differentiation Features
**Goal:** Surpass Blend Reading
- Audio/TTS for phoneme pronunciation
- Student self-practice mode
- Progress tracking dashboard
- Basic gamification (points, streaks)
- Offline PWA support
- QR code sharing for decks/playlists

### Phase 4: Advanced Features
**Goal:** Premium-level features, all free
- AI-generated word chains based on student weaknesses
- Adaptive difficulty
- Decodable reader integration
- Multi-student classroom mode
- Custom themes
- Parent home-practice mode

---

## 8. Semantic Versioning

| Version | Milestone |
|---------|-----------|
| v0.1.0 | Project scaffolding, engine types, Expo setup |
| v0.2.0 | Core engine (deck, playlist, word mat logic) |
| v0.3.0 | UI components, deck play screen |
| v0.4.0 | Playlist player, word chain navigation |
| v0.5.0 | Word Mat with Elkonin boxes |
| v0.6.0 | Editors (deck + playlist creation) |
| v0.7.0 | Audio integration, phoneme pronunciation |
| v0.8.0 | Progress tracking, student profiles |
| v0.9.0 | Gamification, offline support |
| v1.0.0 | Public release — free for educators |

---

## 9. Linear Issue Workflow

- All issues assigned to **PhonicsBoard** project in Linear
- Team: **ModestMind** (prefix: MOD-)
- Issue states: Backlog → In Progress → Done
- Every feature must have tests before marking Done
- PR titles reference Linear issue

---

## 10. Key Architectural Decisions

### ADR-001: Expo over Next.js
**Decision:** Use Expo (React Native + Web) instead of Next.js or plain React
**Why:** Consistent with team's Tessera/Azule project; enables future iOS/Android native apps from same codebase; file-based routing via Expo Router.

### ADR-002: Pure Engine Layer
**Decision:** All phonics logic in `/src/engine` with ZERO React dependencies
**Why:** Enables exhaustive unit testing with Vitest (fast, no DOM); engine can be reused across platforms; clean separation of concerns.

### ADR-003: Warm Palette (Not Blue)
**Decision:** Use warm cream/coral/green palette instead of Blend's blue gradients
**Why:** Visual differentiation from competitor; warm colors feel inviting for young learners; distinct brand identity.

### ADR-004: Free-First Model
**Decision:** All features free, no paywall
**Why:** Core product strategy — undercut Blend Reading's $10/mo pricing; build trust with educator community; potential for school district adoption.

### ADR-005: SVG Rendering over Canvas
**Decision:** Use react-native-svg for tile rendering instead of canvas
**Why:** Better accessibility (screen readers can traverse SVG); easier touch event handling; consistent cross-platform behavior; Blend's canvas approach has accessibility gaps.

# Blend Reading — Comprehensive Product & Market Research

**Prepared for:** App Development Reference (Claude Code + Pencil.dev)
**Date:** March 19, 2026
**Purpose:** Detailed analysis of Blend Reading's functionality, mechanics, UI patterns, and the broader reading education landscape to inform the design of a similar but distinct phonics app.

---

## 1. EXECUTIVE SUMMARY

Blend Reading (blendreading.com / app.blendreading.com) is a modern, web-based virtual blending board designed by and for educators. It digitizes the traditional physical blending board — a key tool in Orton-Gillingham and structured literacy instruction — into three core interactive modules: **Decks** (blending boards), **Playlists** (word chains), and **Word Mats** (spelling with Elkonin boxes). The app is built with Flutter and runs cross-platform on web, iOS, and Android. It targets teachers, reading specialists, and tutors rather than students directly, serving as a classroom instruction tool rather than a self-guided student game.

---

## 2. WHAT IS A BLENDING BOARD?

### Historical Background

A blending board is a phonics instruction tool rooted in the **Orton-Gillingham method**, developed in the 1930s by physician Samuel Orton and educator Anna Gillingham. Their approach emphasized structured, phonetic, multisensory literacy instruction. Blending boards evolved as a practical tool to support this method.

A **physical blending board** consists of:
- A deck of cards with individual phonemes (sounds) written on them
- A wooden or plastic stand that holds several cards side by side
- The instructor arranges cards to form words, then swaps one phoneme at a time

### How Blending Drills Work

1. The teacher selects phoneme cards and places them on the board to spell a word (e.g., "c-a-t")
2. Students sound out each phoneme individually, then blend them together to read the word
3. The teacher swaps ONE card at a time (e.g., changes "c" to "b" to make "b-a-t")
4. Students identify what changed and read the new word
5. This continues through a "word chain" — a sequence where each word differs by one sound

This process builds **phonemic awareness** (understanding individual sounds), **decoding skills** (letter-sound correspondence), and **reading fluency** (automatic word recognition).

### Why Virtual Blending Boards?

Virtual versions like Blend offer advantages over physical boards:
- No fumbling with physical cards during instruction
- Pre-planned word chains (playlists) for smoother lessons
- Automatic vowel color-coding
- Customizable decks for differentiated instruction
- Cross-device access for lesson planning on the go
- Shareable resources between educators via QR codes

---

## 3. BLEND READING — PRODUCT DEEP DIVE

### 3.1 Architecture & Platform

| Attribute | Detail |
|-----------|--------|
| **Framework** | Flutter (cross-platform) |
| **Web App** | app.blendreading.com |
| **iOS** | Available as "Blending Board" on App Store (iOS 13.0+) |
| **Android** | Available on Google Play (com.flutter_android.blendingboardapp) |
| **Rendering** | Canvas-based (Flutter Web renders to HTML canvas) |
| **Screen Size** | Optimized for 1024x768 or larger |
| **Offline** | Web app — requires internet connection |

### 3.2 Three Core Modules

The app has three main tabs accessible from the home screen:

#### MODULE 1: DECKS (Blending Board)

**Purpose:** Interactive virtual blending board for live phonics instruction.

**UI Layout:**
- **Top area:** 4-6 large white card slots arranged horizontally — this is where the active word is displayed
- **Bottom area:** Color-coded grapheme tile columns beneath each card slot
- **Top-left controls:** Back, Shuffle, Reset buttons
- **Top-right:** Deck name label + History button
- **Bottom-right:** Expand/collapse arrow for tile columns

**How It Works:**
1. Teacher opens a deck (e.g., "Separated Blends" or "Combined Blends")
2. Below each card slot is a column of clickable grapheme tiles
3. Clicking a tile places that grapheme into the card slot above
4. Each column represents a position in the word (onset, vowel, coda, etc.)
5. Teacher clicks tiles to build words, changing one sound at a time
6. Students read aloud as the teacher manipulates the board

**Color Coding System:**
| Color | Grapheme Type | Examples |
|-------|--------------|----------|
| **Purple/Pink** | Consonants (single) | b, c, d, f, g, h, j, k, l, m, n, p, r, s, t, v, w, z |
| **Green/Teal** | Consonant blends/clusters | cr, pl, pr, qu, tr, sc, str |
| **Orange/Peach** | Vowels & vowel teams | a, e, i, o, u, ai, ay, ea, ee, ei, igh, oa, ue, ui, oo, ow, oy |
| **Light teal** | Medial consonants | c, f, l, m, n, p, s, x |
| **Pink/Magenta** | Final consonants & doubles | b, c, d, f, ff, g, k, l, ll, m, n, p, r, s, ss, t, v, x |
| **Light purple** | Endings/suffixes | e, es, s |
| **Yellow/Cream** | Vowels in the card display area — vowel cards have a yellow background to visually distinguish them |

**Key Features:**
- **Up to 6 columns** — adjustable during the drill
- **Custom grapheme cards** with up to 5 letters each
- **Automatic vowel color-coding** — vowels are highlighted yellow in the display
- **Shuffle button** — randomizes the order of tiles within columns
- **Reset button** — clears all cards from the display
- **History button** — shows previously displayed words during the session
- **Column collapse (X button)** — hide columns not needed for a lesson
- **Expand/collapse arrow** — toggle tile visibility

**Pre-loaded Decks (Free):**
1. **Separated Blends** — 6 columns: initial consonants, consonant blends, vowels, medial consonants, final consonants, endings
2. **Combined Blends** — similar structure with blends combined into single tiles

#### MODULE 2: PLAYLISTS (Word Chains)

**Purpose:** Pre-planned word chains for streamlined blending drills.

**UI Layout:**
- **Center:** Large word cards displayed (same card style as Decks, with yellow vowel highlighting)
- **Bottom:** Horizontal scrollable word list showing the full chain, with current word in **bold**
- **Top-left controls:** Back, Shuffle, Focus buttons
- **Left/Right arrows:** Navigate forward and backward through the chain
- **Header:** Shows linked deck name + playlist name (e.g., "Separated Blends > CVC Mix")

**How It Works:**
1. Teacher selects a playlist from the Blend Library or My Playlists
2. The first word in the chain appears as cards on screen
3. Clicking the right arrow advances to the next word
4. Each subsequent word changes by ONE sound from the previous word
5. The word list at the bottom tracks progress through the chain
6. "Focus" mode hides the word list for distraction-free presentation

**Word Chain Logic:**
Each word in the chain differs from the previous by exactly one phoneme substitution. Example from "CVC Mix":
> cup → cut → rut → rat → hat → sat → mat → met → meg → beg → bed → bell → well → ...

This is pedagogically deliberate — it forces students to notice which sound changed and blend the new word.

**Pre-loaded Playlists (Free - Blend Library):**
1. **CVC Mix** — Simple consonant-vowel-consonant words
2. **Vowel Teams Mix** — Words with vowel team patterns (ai, ea, oa, etc.)
3. **Morphology Mix** — Words with prefixes and suffixes
4. **s, a, t, m, p** — Words using only these 5 common letters
5. **The Not So Lazy Schwa** — Words featuring the schwa sound
6. **Letter f** — Words focusing on the letter f

**Key Features:**
- **Blend Library tab** — curated playlists by reading specialist "Summer"
- **My Playlists tab** — user's custom playlists
- **Sort By dropdown** — organize by Default, alphabetical, etc.
- **Type to filter** — search/filter playlists by name
- **Play button** — launch a playlist
- **Copy button** — duplicate a playlist for customization
- **Focus mode** — hides the word list at the bottom for clean presentation
- **Export from Deck History** — completed blending drill history can be converted to a reusable playlist

#### MODULE 3: WORD MATS (Pro Only)

**Purpose:** Digital word work mat for spelling practice with built-in Elkonin box support.

**UI Layout:**
- **Top area:** Word building workspace with empty Elkonin boxes
- **Mode tabs:** syllables, sounds, graphemes — three different views
- **Bottom area:** Keyboard of letter/sound tiles for students to use
- **Controls:** Back, Reset buttons
- **Heart tiles** — special tiles for irregular/tricky parts of words

**How It Works:**
1. Teacher selects a Word Mat preset (A-Z Tiles, Advanced Sounds, Phonemes Only, or The Not So Lazy Schwa)
2. Students tap on the workspace to create Elkonin boxes (sound boxes)
3. Students drag letter/sound tiles from the keyboard into the boxes
4. Three modes allow different levels of granularity:
   - **Syllables mode** — boxes represent syllable divisions
   - **Sounds mode** — boxes represent individual phonemes
   - **Graphemes mode** — boxes represent individual letter groups
5. Heart tiles mark irregular parts of words (sounds that don't follow typical patterns)

**Pre-loaded Word Mat Options:**
1. **A-Z Tiles** — Basic alphabet letter tiles
2. **Advanced Sounds** — Includes digraphs, vowel teams, r-controlled vowels
3. **Phonemes Only** — Sound-based tiles
4. **The Not So Lazy Schwa** — Focus on schwa sound patterns

**Key Features:**
- **Tap-to-create Elkonin boxes** — intuitive gesture-based box creation
- **Built-in syllable division** — separate syllable boxes for multisyllabic words
- **Multiple keyboard layouts** — consonants, vowels, digraphs, vowel teams, r-controlled vowels, suffixes
- **Heart tile** — marks irregular/tricky word parts (e.g., the "tion" in "nation")
- **Platform-flexible** — works on desktops, iPads, and smart boards

### 3.3 Pricing & Plans

| Feature | Basic (Free) | Pro ($10/mo or $8/mo yearly) | Organization (Custom) |
|---------|-------------|------------------------------|----------------------|
| Virtual Blending Board | Yes | Yes | Yes |
| Preloaded Decks | 2 decks | Unlimited | Unlimited |
| Custom Decks | 1 | Unlimited | Unlimited |
| Preloaded Playlists | 3 | Unlimited | Unlimited |
| Custom Playlists | 1 | Unlimited | Unlimited |
| Word Mats | No | Yes | Yes |
| Themes | No | Yes | Yes |
| Blend Library Access | No | Yes | Yes |
| Resource Sharing (QR) | No | Yes | Yes |
| Shared Resource Library | No | No | Yes |
| Admin Dashboard | No | No | Yes |
| Dedicated Support | No | No | Yes |
| No Login Required | Yes | — | — |
| Cross-Device Sync | Yes (with account) | Yes | Yes |

**Free trial:** 7 days of Pro when signing up.
**Yearly discount:** 20% off ($96/year vs $120/year).

### 3.4 Navigation & UX Patterns

**Home Screen:**
- Three tabs at top center: Playlists (purple), Decks (blue), Word Mats (teal)
- Filter/search bar
- "+ New" button for creating custom content
- "Log In" button top-right
- Bottom banner for first-time users: "First time using Blend? Check out our resources! Get Started"
- Help button (?) bottom-right

**Visual Design:**
- Gradient blue background (sky blue to lighter blue)
- White card elements with subtle shadows
- Soft, rounded UI elements
- Color-coded tiles match phonics categories
- Clean, teacher-friendly interface (minimal distractions)
- Font: Mix of italic serif headers and sans-serif body text

**Interactions:**
- Single-click to place tiles on the board
- Click arrows to navigate playlists
- Tap to create Elkonin boxes on Word Mats
- Drag-and-drop for tile placement on Word Mats

### 3.5 Technical Implementation Notes

- Built with **Flutter** (Dart), rendering to HTML canvas on web
- Canvas-based rendering means standard DOM queries don't work on interactive elements
- Tutorial system uses modal dialogs with Yes/No/Maybe Later buttons
- No audio/text-to-speech — this is a teacher-led tool, not self-guided
- No gamification elements (points, badges, leaderboards) — it's an instructional tool
- No student accounts or progress tracking — teacher controls everything
- Session history is ephemeral (per-session, not saved long-term on free plan)

---

## 4. THE SCIENCE OF READING — PEDAGOGICAL FOUNDATION

### 4.1 Five Pillars of Reading Instruction

The National Reading Panel identified five essential components:

1. **Phonemic Awareness** — Understanding that words are made of individual sounds
2. **Phonics** — Teaching the relationship between letters and sounds
3. **Fluency** — Reading quickly, accurately, and with expression
4. **Vocabulary** — Understanding word meanings
5. **Comprehension** — Understanding the text being read

Blend Reading primarily addresses **Phonemic Awareness** and **Phonics** (pillars 1 and 2).

### 4.2 Structured Literacy & Orton-Gillingham

Structured literacy is an umbrella term for approaches that teach reading through:
- **Explicit instruction** — Skills are taught directly, not discovered
- **Systematic progression** — Simple to complex, following a scope and sequence
- **Multisensory techniques** — Visual, auditory, and kinesthetic learning
- **Cumulative practice** — New skills build on previously taught ones

The **Orton-Gillingham approach** (1930s) is the foundational methodology. Blending boards are a core tool in this tradition.

### 4.3 Key Phonics Concepts

| Term | Definition | Relevance to Blend |
|------|-----------|-------------------|
| **Phoneme** | The smallest unit of sound in spoken language | Each tile on the board represents a phoneme |
| **Grapheme** | The letter(s) that represent a phoneme | Tiles show graphemes (e.g., "sh", "ai", "igh") |
| **Blending** | Combining individual sounds to form a word | Core mechanic of the Decks module |
| **Segmenting** | Breaking a word into individual sounds | Core mechanic of the Word Mats module |
| **CVC Words** | Consonant-Vowel-Consonant (e.g., "cat", "dog") | Simplest words on the blending board |
| **Vowel Teams** | Two vowels making one sound (e.g., "ai", "ea") | Represented as single tiles on the board |
| **Digraph** | Two letters making one sound (e.g., "sh", "ch") | Represented as single tiles |
| **R-Controlled Vowels** | Vowels modified by "r" (e.g., "ar", "er", "ir") | Included in Advanced Sounds word mat |
| **Schwa** | Unstressed vowel sound (the "uh" in "about") | Has its own dedicated playlist and word mat |
| **Elkonin Boxes** | Sound boxes for segmenting words | Built into Word Mats module |
| **Word Chain** | Sequence of words each differing by one sound | Core mechanic of the Playlists module |
| **Scope and Sequence** | Planned order of skill introduction | How playlists and library content is organized |
| **Decodable Text** | Text using only taught phonics patterns | What students can read after blending practice |

### 4.4 Current Policy Landscape (2025-2026)

Many U.S. states are mandating Science of Reading-aligned instruction:
- **Oklahoma's Strong Readers Act** (effective 2025-26) mandates phonics-based literacy instruction
- **Stanford research (Feb 2026)** shows Science of Reading legislation reshaping education
- Multiple states developing educator frameworks integrating structured literacy
- Growing adoption of tools like blending boards in mainstream classrooms

---

## 5. COMPETITIVE LANDSCAPE

### 5.1 Direct Competitors (Virtual Blending Boards)

| App | Platform | Price | Key Differentiator |
|-----|----------|-------|-------------------|
| **Blend Reading** | Web, iOS, Android | Free / $10 mo | Most feature-rich, word mats, playlists |
| **Blending Board (Chain Reaction Games)** | iOS, Android | Free | Created by Google Certified Innovator, no data collection, dyslexia-focused |
| **UFLI Virtual Blending Board** | Web | Free | From University of Florida Literacy Institute, academic backing |

### 5.2 Broader Reading App Market

| App | Age Range | Price | Approach |
|-----|-----------|-------|----------|
| **Reading Eggs** | 2-13 | $9.99/mo | Comprehensive gamified curriculum, all 5 pillars |
| **HOMER** | 2-8 | $12.99/mo | Personalized adaptive learning, 1000+ lessons |
| **Teach Your Monster to Read** | 3-6 | Free/Paid | Monster character customization, 3-stage progression |
| **Khan Academy Kids** | 2-8 | Free | 300+ books, no ads, completely free |
| **Starfall** | PreK-5th | Free/Paid | Multisensory, decades of classroom use |
| **Lexia Core5** | PreK-5th | School license | Data-driven, performance-based assessment |
| **Bob Books Reading Magic** | 2-5 | Paid | Phonics-focused, based on Bob Books methodology |

### 5.3 Key Differences: Blend vs. Consumer Reading Apps

Blend Reading occupies a **very different niche** from consumer reading apps:

| Dimension | Blend Reading | Consumer Reading Apps (e.g., HOMER, Reading Eggs) |
|-----------|--------------|--------------------------------------------------|
| **Primary user** | Teacher/instructor | Child (student) |
| **Usage context** | Classroom instruction, tutoring | Home, independent practice |
| **Gamification** | None | Heavy (points, badges, characters, rewards) |
| **Student accounts** | None | Yes, with progress tracking |
| **Audio/TTS** | None (teacher provides) | Yes, narration and sound effects |
| **Progress tracking** | None | Detailed analytics and reports |
| **Content type** | Tools (blending board, word mat) | Lessons, games, stories, activities |
| **Curriculum** | Supports any scope & sequence | Follows built-in curriculum |
| **Revenue model** | SaaS subscription for teachers | Consumer subscription for families |

---

## 6. COMMON GAME MECHANICS IN READING APPS

While Blend itself is NOT gamified, understanding these mechanics is crucial for building a similar-but-different app that could include game elements:

### 6.1 Core Activity Types

1. **Phoneme Blending Games** — Combine sounds to form words (Blend's core mechanic)
2. **Phoneme Segmenting Games** — Break words into sounds (Blend's Word Mats)
3. **Word Building** — Drag-and-drop letters to spell words
4. **Word Chains** — Navigate sequences where one sound changes (Blend's Playlists)
5. **Sight Word Recognition** — Flash cards for high-frequency irregular words
6. **Rhyming Games** — Match or generate rhyming word pairs
7. **Phoneme Manipulation** — Add, delete, or substitute sounds in words
8. **Decodable Reading** — Read passages using only taught phonics patterns
9. **Spelling Practice** — Type or arrange letters to spell dictated words

### 6.2 Progression Structures

- **Scope and Sequence** — Linear progression from CVC → blends → digraphs → vowel teams → multisyllabic
- **Adaptive Difficulty** — Automatic adjustment based on performance
- **Mastery Gates** — Must demonstrate competency before advancing
- **Three-Stage Models** (e.g., Teach Your Monster): Letter-sounds → Blending → Independent reading

### 6.3 Reward/Gamification Systems

- **Visual Progress Maps** — Islands/levels showing advancement
- **Star Systems** — Earn stars for completed activities
- **Achievement Badges** — Milestones and skill mastery recognition
- **Streaks** — Consecutive days of practice bonuses
- **Character Customization** — Earn cosmetics for avatars
- **Unlockable Content** — New games/stories as rewards
- **Leaderboards** — Class-based or friend comparisons (careful with competition)

### 6.4 Features Parents/Teachers Value

- **Progress Tracking** — Dashboards showing skills mastered, accuracy, fluency metrics
- **Multi-Child Support** — Separate profiles for siblings or students
- **Curriculum Alignment** — Common Core, Science of Reading, state standards
- **Diagnostic Assessment** — Initial placement testing
- **Offline Access** — Downloaded content for travel/limited connectivity
- **Parental Controls** — Screen time limits, content filtering
- **Ad-Free Experience** — No advertisements or in-app purchases
- **Accessibility** — Dyslexia-friendly fonts, screen reader support

---

## 7. SCREENSHOTS & UI REFERENCE

The following screenshots were captured during this research session from the live app at app.blendreading.com and the marketing site at blendreading.com. Refer to these for visual design reference.

### Screenshot Inventory

1. **Marketing Homepage** — Hero section with "Meet your new favorite phonics tool" tagline, three feature cards (Decks, Playlists, Word Mats) with preview images
2. **Marketing — Decks Feature** — "Building fluency has never been easier" section showing 6-column deck with "napkin" displayed, key features listed
3. **Marketing — Playlists Feature** — "Revolutionize your lesson planning" section showing playlist with "dis-tract" and word chain at bottom
4. **Marketing — Word Mats Feature** — "Boost confidence and engage your students" section showing word mat with "a-g-ai-n" and full keyboard layout
5. **Marketing — Partners** — Sage Literacy, Slant System, REED Charitable Foundation, Forest City Elementary
6. **Pricing Page — Basic Tier** — Free plan features (no login required, preloaded resources, 1 custom deck/playlist, cross-device sync)
7. **App — Home Screen (Decks tab)** — Two deck cards: "Separated Blends" and "Combined Blends", filter bar, "+ New" button
8. **App — Deck Play Screen (empty)** — 6 card slots at top, 6 color-coded grapheme tile columns below, tutorial dialog overlay
9. **App — Deck Play Screen (active)** — Word "b-m-e-n-d" displayed with "e" on yellow background, full tile columns visible
10. **App — Playlists Library** — List view showing CVC Mix, Vowel Teams Mix, Morphology Mix, s/a/t/m/p, The Not So Lazy Schwa, Letter f — with play and copy buttons
11. **App — Playlist Playing (CVC Mix, "cup")** — Three cards showing "c-u-p" with yellow "u", word chain at bottom (cup, cut, rut, rat, hat, sat, mat, met, meg, beg, bed, bell, well...)
12. **App — Playlist Playing (CVC Mix, "cut")** — Advanced to "c-u-t" from "c-u-p", showing single-sound change mechanic
13. **App — Word Mats Home** — Four presets: A-Z Tiles, Advanced Sounds, Phonemes Only, The Not So Lazy Schwa
14. **App — Word Mats Pro Gate** — "This feature is only available to Blend Pro users" dialog with preview of word mat interface showing syllables/sounds/graphemes tabs

---

## 8. PRO FEATURES — DETAILED FINDINGS (Live App Exploration)

The following details were captured through hands-on exploration of the Pro tier (7-day free trial) on March 19, 2026.

### 8.1 Word Mats — All Four Presets (Pro Only)

#### A-Z Tiles
The simplest Word Mat keyboard with basic alphabet tiles:
- **Top row (Green/Teal):** Vowels — a, e, i, o, u, y
- **Rows 2-4 (Light Blue):** Consonants — b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z
- **Right side:** 6 colored blank tiles (yellow, teal, red, purple, pink, orange) for abstract sound representation
- **Heart tile (❤️):** Special tile for marking irregular/tricky sounds
- **Three mode tabs:** syllables, sounds, graphemes

**Interaction mechanic (confirmed through testing):**
1. In "sounds" mode: Tap workspace to create Elkonin boxes (each tap = 1 box, auto-arranged in a row)
2. In "graphemes" mode: Tap a letter tile to select it → Tap an Elkonin box to place it
3. Consonant tiles appear **light blue** in the boxes, vowel tiles appear **green/teal**
4. Example tested: Spelled "c-a-t" — c (blue), a (green), t (blue) in 3 boxes

#### Advanced Sounds
A comprehensive phonics keyboard covering all major sound patterns:
- **Light Blue tiles:** Single consonants (b, c, d, f, g, h, j, k, l, m, n, p, r, s, t, v, w, x, y, z)
- **Peach/Orange tiles — Consonant digraphs:** ch, ph, qu, sh, th, wh
- **Orange tiles — Special endings:** ck, dge, ng, nk, tch
- **Green tiles — Short vowels:** a, e, i, o, u, y
- **Teal tiles — R-controlled vowels:** ar, er, ir, or, ur
- **Teal tiles — Long vowel teams:** ai, ay, ea, ee, oa, ow, igh
- **Teal tiles — Diphthongs & other:** au, aw, oi, oo, oy, ou, ow (note: "ow" appears twice — once as long vowel, once as diphthong)
- **Purple tiles — Suffixes:** es, ing, ed
- **Schwa symbol (ə):** Dedicated schwa tile
- **Heart tile (❤️)**

#### Phonemes Only
The most minimal mat — designed for pure phonemic awareness without any letters:
- **Graphemes mode:** Only 6 colored blank tiles (yellow, teal, red, purple, pink, orange) — NO letter tiles at all
- **Sounds mode:** Completely empty workspace — tap to create boxes only
- **Purpose:** Students use colored tiles to represent sounds abstractly, before associating letters

#### The Not So Lazy Schwa (Partner Theme — Phonics Read-Alouds)
A **fully themed** Word Mat with a unique visual design:
- **Custom background:** Illustrated hill scene with clouds, sky, and a cute character peeking from below (vs. standard teal gradient)
- **"PHONICS READ-ALOUDS" branding** in top-right corner — this is a partner-created theme
- **Different color scheme:**
  - Vowels are **pink/salmon** (instead of green)
  - R-controlled vowels (ar, er, ir, or, ur) are **purple/lavender** (instead of teal)
  - Consonants remain light blue
  - Digraphs and special endings remain teal/orange
- **Same tile content as Advanced Sounds** but without the suffix tiles (es, ing, ed) — focuses on the schwa sound
- **Schwa character icon** next to the heart tile
- **Key takeaway:** Pro themes can completely transform the visual identity while maintaining the same gameplay mechanics

### 8.2 Deck Deep-Dive — Combined Blends

The "Combined Blends" deck has a different structure from "Separated Blends":
- **5 columns** (vs 6 in Separated Blends)
- **Column 1 (Light Blue — Initial sounds):** All single consonants PLUS consonant blends in same column: b, bl, br, c, cl, cr, d, dr, f, fl, fr, g, gl, gr, h, j, k, l, m, n, p, pl, pr, r, s, sc, scr, sk, sl, sm, sn, sp...
- **Column 2 (Peach/Orange — Vowels):** Short vowels (a, e, i, o, u, y) + ALL vowel teams: ai, ay, ea, ee, ei, eigh, ie, igh, oa, oe, ow, au, augh, aw, ew, oi, oo, ou, ough
- **Column 3 (Teal — Final sounds):** Single final consonants PLUS ending blends: b, c, ct, d, f, ff, ft, g, k, l, ll, lb, ld, lf, lk, lp, lt, m, mp, n, nd, nt, p, pt, r, s, ss, sk, sp, st, t, y
- **Column 4:** Just **"e"** — the silent e! (standalone column for magic-e words)
- **Column 5 (White/Light Purple — Suffixes):** es, s

### 8.3 Deck Creation/Editing Flow (Pro)

**Step 1 — New Deck Dialog:**
- Options: "Create blank deck" or copy from existing deck
- Lists decks under "My Decks" tab
- Cancel / Continue buttons

**Step 2 — Deck Editor:**
- **"Deck Name"** editable text field (top center)
- **Save ✅ / Cancel ❌** buttons (top right)
- **"Multi-Edit Mode"** toggle (top right) — when ON, shows checkboxes for batch selecting and deleting tiles
- **Color palette** (left sidebar) — 7 color options: white, pink, teal, peach/orange, red, green, purple, yellow — used to assign tile colors
- **Column view:** Each column shows as a vertical list of rows
  - Each row contains one or more tiles
  - Tiles are **directly editable text fields** — click to type the grapheme
  - **"+" button** next to each tile — add another tile to that row
  - **"+" button** at bottom of column — add new row
- **Column controls:**
  - **Left/Right arrows** — reorder columns
  - **Checkbox** — select entire column
  - **Trash icon** — delete column
- **"+" column** (far right) — add new column
- **Tile text is freely editable** — type any grapheme (1-5 characters)

### 8.4 Playlist Creation Flow (Pro)

**Step 1 — Link to Deck:**
- Dialog: "Each playlist must be linked to an existing deck. Select a deck to continue."
- Shows "My Decks" tab with available decks
- **KEY ARCHITECTURAL INSIGHT:** Playlists are DEPENDENT on decks — a playlist is essentially a pre-planned sequence of words that can be built from a specific deck's available graphemes

**Step 2 — Playlist Editor:**
- **"Playlist Name"** editable field (top center)
- **"🔗 [Deck Name]"** link to parent deck (top left)
- **Save ✅ / Cancel ❌** buttons (top right)
- **Word rows** (top area):
  - Each row has N empty card slots matching the deck's column count (e.g., 6 slots for Separated Blends)
  - **Up/Down arrows** on left — reorder words in the chain
  - **X button** on right — delete word from chain
  - **"+" button** below — add another word row
- **Full deck displayed below** — all columns from the linked deck shown at bottom
  - Tiles are clickable — click a tile to place it into the current word row's corresponding slot
  - Each column has an X to hide/show
  - Same color coding as the deck's play mode

### 8.5 Blend Library (Pro Content)

**Playlists available in Blend Library:**
1. CVC Mix
2. Vowel Teams Mix
3. Morphology Mix
4. S, a, t, m, p
5. The Not So Lazy Schwa
6. Letter f
(List may continue below scroll — Flutter canvas prevented full scrolling)

**Each library playlist has:**
- **Play button (▶)** — launch directly
- **Copy button (📋)** — duplicate to "My Playlists" for customization

**Playlists tab structure:**
- **"Blend Library"** sub-tab — curated content from Blend
- **"My Playlists"** sub-tab — user-created and copied playlists, with "+ New" button
- **"Type to filter"** search bar
- **"Sort By"** dropdown (Default option visible)

### 8.6 UI Elements Only Visible in Pro

- **"BLEND PRO"** badge in top-left corner (pink circle badge)
- **"My Account"** button in top-right
- **"Blend Library" / "My Playlists"** sub-tabs within Playlists
- **Copy (📋) icons** on each deck card in Decks list
- **All 4 Word Mat presets** visible (vs. paywall on free)
- **Partner themes** (e.g., Phonics Read-Alouds) with custom backgrounds
- **"+ New" button** on Playlists My Playlists tab
- **History button** on deck play screen

---

## 9. OPPORTUNITIES FOR A DIFFERENTIATED PRODUCT

Based on this research, here are areas where a new app could differentiate from Blend Reading while serving the same educational need:

### 9.1 What Blend Does NOT Do (Gaps)

- **No student-facing mode** — Blend is teacher-controlled only; no way for students to practice independently
- **No audio/text-to-speech** — Teacher must provide all pronunciation; no built-in sound modeling
- **No progress tracking** — No data on which words/sounds students struggle with
- **No gamification** — No rewards, points, or motivational elements for students
- **No assessment** — No diagnostic or formative assessment tools
- **No decodable readers** — Phonics practice only, no connected text reading
- **No parent/home mode** — Designed exclusively for classroom/tutoring settings
- **No offline support** — Web app requires internet
- **No AI/adaptive features** — No personalization based on student performance
- **No collaborative features** — No multi-student simultaneous use

### 9.2 Potential Differentiation Strategies

1. **Student Self-Practice Mode** — Allow students to use the blending board independently with audio support
2. **Audio Integration** — Built-in phoneme pronunciation, text-to-speech for word modeling
3. **Gamified Blending Drills** — Same educational mechanics but with points, streaks, character customization
4. **Progress Dashboard** — Track which phonics patterns each student has mastered
5. **Adaptive Word Chains** — AI-generated word chains targeting individual student weaknesses
6. **Decodable Reader Integration** — After blending practice, students read passages using those same patterns
7. **Parent Mode** — Home practice that syncs with classroom instruction
8. **Multi-Student Mode** — Multiple students can participate simultaneously (e.g., on individual tablets)
9. **Assessment Tools** — Built-in phonics screeners and progress monitoring
10. **AI Tutor** — Conversational phonics tutor that listens to student pronunciation

### 9.3 IP Considerations

**What is likely protectable (avoid copying directly):**
- Specific visual design/theme (blue gradients, card shadows, color palette)
- Brand elements (BLEND logo, "Blend Library", character designs in Pro themes)
- Specific curated playlist content and word chain sequences
- Exact UI layout and interaction patterns
- Marketing copy and educational content

**What is NOT protectable (free to use concepts):**
- The concept of a virtual blending board (decades-old educational tool)
- Color-coding vowels vs. consonants (common educational practice)
- Word chains as a teaching method (fundamental literacy technique)
- Elkonin boxes (standard phonemic awareness tool)
- Phonics scope and sequence patterns (educational standard)
- The general idea of decks, playlists, and word mats as features

---

## 10. TECHNICAL REFERENCE FOR DEVELOPMENT

### 10.1 Core Data Structures to Plan For

```
Deck:
  - name: string
  - columns: Column[]
  - Column:
    - position: number (0-5)
    - graphemes: Grapheme[]
    - Grapheme:
      - text: string (1-5 characters)
      - type: enum (consonant, vowel, blend, digraph, vowel_team, r_controlled, suffix)
      - isActive: boolean

Playlist:
  - name: string
  - linkedDeck: Deck reference
  - words: Word[]
  - Word:
    - graphemes: string[] (ordered)
    - position: number (index in chain)

WordMat:
  - name: string
  - mode: enum (syllables, sounds, graphemes)
  - keyboard: TileGroup[]
  - workspace: ElkoninBox[]
  - TileGroup:
    - tiles: Tile[]
    - Tile:
      - text: string
      - type: enum (same as Grapheme type + "heart" for irregular)
  - ElkoninBox:
    - content: Tile | null
    - syllableGroup: number
```

### 10.2 Key Interactions to Implement

1. **Tile → Card placement** — Click/tap tile, it appears in corresponding card slot above
2. **Card slot replacement** — Clicking a different tile in same column replaces current card
3. **Playlist navigation** — Left/right arrows advance through word chain
4. **Word chain highlighting** — Current word bolded in bottom word list
5. **Elkonin box creation** — Tap workspace to create boxes
6. **Tile → Box placement** — Drag or tap to place tiles into boxes
7. **Shuffle** — Randomize tile order within columns
8. **Reset** — Clear all card slots
9. **Focus mode** — Hide word list for clean presentation
10. **History** — Track words displayed during session

### 10.3 Recommended Tech Stack Considerations

- **Framework:** React/Next.js or Flutter (Blend uses Flutter)
- **Rendering:** Canvas-based for smooth tile interactions, or DOM with CSS transitions
- **State Management:** Local state for board + persistent storage for saved decks/playlists
- **Audio:** Web Audio API for phoneme pronunciation (if adding audio)
- **Data:** JSON-based deck/playlist definitions
- **Responsive:** Must work on tablets (primary classroom device) and desktops/smartboards

---

## 11. SOURCES

- blendreading.com — Marketing site, features, pricing
- app.blendreading.com — Live web application (hands-on exploration)
- blendreading.com/blog/what-is-a-blending-board — History and mechanics
- blendreading.com/blog/getting-started-with-blend — Tutorial reference
- blendreading.com/help — FAQ and support resources
- blendreading.com/pricing — Plan comparison
- Apple App Store listing for "Blending Board" (ID: 1521114657)
- Google Play Store listing (com.flutter_android.blendingboardapp)
- National Reading Panel — Five Pillars of Reading
- NWEA — Science of Reading and Phonics (2025)
- Stanford News — How the Science of Reading is Reshaping Literacy Education (2026)
- University of Florida Literacy Institute (UFLI) — Blending board resources
- Reading Rockets — Role of Decodable Readers in Phonics Instruction
- Iowa Reading Research Center — Role of Decodable Readers
- Oklahoma Education Journal — The Science of Reading
- Orton-Gillingham approach — Wikipedia and academic sources
- Multiple app store listings and review sites for competing products

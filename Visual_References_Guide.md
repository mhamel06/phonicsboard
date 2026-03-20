# Blend Reading — Visual References Guide

**Purpose:** Screenshot catalog for creating visual mockups of a similar phonics app.
**Capture Date:** March 19, 2026
**Source:** app.blendreading.com (Pro account)

All screenshots were captured from the live Flutter web app and downloaded to your browser's Downloads folder as PNGs.

---

## Screenshot Inventory

### Navigation & Home Screens

| # | Filename | What It Shows |
|---|----------|--------------|
| 01 | `01-decks-home-screen.png` | Main Decks tab — two deck cards (Separated Blends, Combined Blends), top nav bar (Playlists / Decks / Word Mats), BLEND PRO logo, "+ New" button, "Type to filter" search, "My Account" button |

### Decks (Blending Boards)

| # | Filename | What It Shows |
|---|----------|--------------|
| 02 | `02-separated-blends-deck-full.png` | Separated Blends deck — 6 columns of tiles with empty display slots at top. Color coding: pink=initial consonants, green=blends/clusters, orange=vowels+vowel teams, teal=medial consonants, pink=final consonants, lavender=endings. Back/Shuffle/Reset/History buttons. |
| 03 | `03-separated-blends-active-tiles.png` | Active play state — "c", "a", "f" placed in display slots. Vowel "a" has yellow/cream background distinguishing it from white consonant cards. Shows how tiles look when placed. |
| 04 | `04-combined-blends-deck-full.png` | Combined Blends deck — 5 columns (vs 6 in Separated). Column 1 has consonants AND blends combined (b, bl, br, c, cl, cr...). More tiles per column. 4-wide tile grid. |

### Word Mats (Elkonin Boxes / Spelling)

| # | Filename | What It Shows |
|---|----------|--------------|
| 05 | `05-word-mats-selection-screen.png` | Word Mats preset chooser — 4 cards: A-Z Tiles, Advanced Sounds, Phonemes Only, The Not So Lazy Schwa. Teal-themed background. |
| 06 | `06-word-mat-az-tiles-graphemes.png` | A-Z Tiles in graphemes mode — keyboard layout with green vowels (a,e,i,o,u,y), blue consonants (b-z), 6 colored blank tiles (yellow, teal, red, purple, pink, orange), heart tile. Three mode tabs at top: syllables / sounds / graphemes. |
| 07 | `07-word-mat-elkonin-boxes-empty.png` | 3 empty Elkonin boxes in sounds mode — white boxes with thick black border, ready for tile placement. Shows how tapping creates boxes. |
| 08 | `08-word-mat-cat-spelled-elkonin.png` | **KEY REFERENCE** — "c-a-t" spelled in Elkonin boxes with graphemes keyboard below. Blue "c" and "t" (consonants), green "a" (vowel). Shows the core tap-to-select → tap-to-place interaction result. |
| 09 | `09-word-mat-advanced-sounds.png` | Advanced Sounds keyboard — full phonics tile set: blue consonants, orange digraphs (ch, ph, sh, th, wh, ck, dge, ng, nk, tch), green short vowels, teal vowel teams & r-controlled (ar, er, ir, or, ur, ai, ay, ea, ee, oa, ow, igh, au, aw, oi, oo, oy, ou, ow), purple suffixes (es, ing, ed), schwa symbol (ə). |
| 10 | `10-word-mat-phonemes-only.png` | Phonemes Only — NO letter tiles, just 6 colored blocks (yellow, teal, red, purple, pink, orange). Pure phonemic awareness mode for sound manipulation without letters. |
| 11 | `11-word-mat-not-so-lazy-schwa-partner-theme.png` | **Partner Theme** — "The Not So Lazy Schwa" by Phonics Read-Alouds. Custom illustrated background (sky, clouds, hill), branding logo, schwa mascot character, pink vowels instead of green. Shows how themes completely transform the visual identity. |

### Playlists (Word Chains)

| # | Filename | What It Shows |
|---|----------|--------------|
| 12 | `12-playlists-blend-library.png` | Blend Library tab — curated playlists list (CVC Mix, Vowel Teams Mix, Morphology Mix, s/a/t/m/p, The Not So Lazy Schwa, Letter f). Each with play ▶ and copy 📋 buttons. Sub-tabs: Blend Library / My Playlists. Sort by dropdown. |
| 13 | `13-playlist-play-mode-cvc-mix.png` | **KEY REFERENCE** — Playlist play mode showing "cup" (c-u-p). Vowel "u" highlighted yellow. Word chain bar at bottom: cup, cut, rut, rat, hat, sat, mat, met, meg, beg, bed, bell, well. Back/Shuffle/Focus buttons. Linked deck "Separated Blends" shown above title. |
| 14 | `14-playlist-word-chain-transition.png` | Word chain transition — "cut" after advancing from "cup". Only the last letter changed (p→t). Demonstrates the one-phoneme-change mechanic. Current word "cut" bold in bottom bar. |
| 15 | `15-playlist-focus-mode.png` | Focus mode — distraction-free view. Title and bottom word chain bar hidden. Just the word cards, navigation arrows, and clean blue background. Cards slightly larger. |
| 16 | `16-my-playlists-empty-state.png` | My Playlists empty state — "You currently have no custom playlists. Create a new one to add to your library!" message with "+ New" button. |

### Creation & Editing Flows

| # | Filename | What It Shows |
|---|----------|--------------|
| 17 | `17-deck-creation-dialog.png` | Deck creation modal — "Create a blank deck or copy from an existing deck." Lists existing decks to copy. "My Decks" tab. Cancel/Continue buttons. |
| 18 | `18-deck-editor-blank.png` | Blank deck editor — "Deck Name" editable field, color palette on left (white, pink, teal, peach, red, green, purple, yellow), one empty column with "+", Save/Cancel buttons, Multi-Edit Mode toggle (off). |
| 19 | `19-deck-editor-with-column.png` | Deck editor with column structure — shows tile rows with "+", checkboxes for multi-select, trash icon for deletion, arrow buttons for column reordering, "+" to add new column on right side. |

---

## Color System Reference

Use these colors as reference for your mockup (note: do NOT copy exact hex values — create your own palette):

| Element | Blend's Color | Purpose |
|---------|--------------|---------|
| Initial consonants | Pink/magenta | Column 1 tiles |
| Consonant blends | Green/teal | Column 2 tiles (cr, pl, tr, etc.) |
| Short vowels | Orange/peach | Column 3 tiles (a, e, i, o, u) |
| Medial consonants | Teal/mint | Column 4 tiles |
| Final consonants | Pink (same as initial) | Column 5 tiles |
| Endings/suffixes | Lavender/light purple | Column 6 tiles (e, es, s) |
| Vowel on display card | Yellow/cream background | When placed in display slot |
| Consonant on display card | White background | When placed in display slot |
| App background | Blue gradient | Light blue to purple gradient |
| Word Mats (A-Z) vowels | Green | Tile keyboard vowel row |
| Word Mats (A-Z) consonants | Light blue | Tile keyboard consonant rows |
| Advanced digraphs | Orange | ch, ph, sh, th, wh tiles |
| Advanced vowel teams | Teal | ai, ay, ea, ee, oa, etc. |
| R-controlled vowels | Lavender | ar, er, ir, or, ur |
| Suffixes | Purple | es, ing, ed |

---

## Key UI Patterns to Replicate (Differently)

1. **Card-based navigation** — Decks and Word Mats use card tiles for selection
2. **List-based navigation** — Playlists use a scrollable list with action buttons
3. **Sub-tabs** — Blend Library / My Playlists pattern for content vs. user items
4. **Modal creation dialogs** — Blank or copy options before entering editor
5. **Inline editing** — Tile text is editable directly in the deck editor
6. **Color palette sidebar** — Vertical strip of color circles for tile coloring
7. **Focus mode toggle** — Strips UI chrome for student-facing display
8. **Word chain progress bar** — Bottom scrollable bar showing all words in sequence
9. **Vowel highlighting** — Yellow/cream background distinguishes vowels from consonants
10. **Tap-to-create boxes** — Workspace area creates Elkonin boxes on tap
11. **Tap-to-select → tap-to-place** — Two-step interaction for placing tiles in boxes

---

## Notes for Pencil.dev Implementation

- The app uses a **blue gradient background** throughout — your version should use a distinct color scheme
- **Card shadows and rounded corners** are used extensively — consider flat or differently-shaped tiles
- The **font is italic/script** for titles — choose a different but similarly playful font
- **Tile sizes are large and touch-friendly** — maintain this for tablet/touchscreen use
- The **empty states have helpful text** — good UX pattern to keep
- **Partner themes show that backgrounds, colors, and branding can be fully customized** — consider this as a pro feature in your version too

# Combined Blends Deck -- Tile Sub-Group Specification

Documented from Blend Reading screenshots and research (March 2026).
The Combined Blends deck uses 5 columns. Unlike the Separated Blends deck (6 columns), blends are merged into the same column as their single-consonant counterparts. Each column contains visually distinct sub-groups differentiated by color.

---

## Column 1 -- Initial Sounds

Three sub-groups sharing one scrollable column.

### Sub-group 1A: Single Consonants
- **Color:** Green / Teal
- **Tiles:** b, c, d, f, g, h, j, k, l, m, n, p, r, s, t, v, w, y, z

### Sub-group 1B: Consonant Blends
- **Color:** Green / Teal (same as 1A)
- **Tiles:** bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, sc, scr, sk, sl, sm, sn, sp, st, str, sw, tr, tw

### Sub-group 1C: Digraphs
- **Color:** Pink / Salmon
- **Tiles:** ch, gn, kn, ph, qu, sh, shr, th, thr, wh, wr

**Current code gap:** Sub-group 1C (digraphs) is entirely missing from `combined-blends.ts`. The code currently assigns all multi-character tiles to `green` as blends. Digraphs need their own sub-group with `pink` color and `digraph` type.

---

## Column 2 -- Vowels

Three sub-groups sharing one scrollable column.

### Sub-group 2A: Short Vowels
- **Color:** Orange / Peach
- **Tiles:** a, e, i, o, u, y

### Sub-group 2B: Vowel Teams
- **Color:** Orange (same shade as 2A)
- **Tiles:** ai, ay, ea, ee, ei, eigh, ie, igh, oa, oe, ow, au, augh, aw, ew, oi, oo, ou, ough

### Sub-group 2C: R-Controlled Vowels
- **Color:** Orange / Peach (same family as 2A/2B)
- **Tiles:** ar, er, ir, or, ore, ur

**Current code gap:** Sub-group 2C (r-controlled vowels) is entirely missing from `combined-blends.ts`. These need to be added with `r_controlled` type and `orange` color.

---

## Column 3 -- Final Sounds

Two sub-groups sharing one scrollable column.

### Sub-group 3A: Single Final Consonants and Consonant Blends
- **Color:** Teal
- **Tiles:** b, c, ct, d, f, ff, ft, g, k, l, ll, lb, ld, lf, lk, lp, lt, m, mp, n, nd, nt, p, pt, r, s, ss, sk, sp, st, t, y

### Sub-group 3B: Final Digraphs
- **Color:** Pink / Salmon
- **Tiles:** ch, ck, dge, mb, nch, ng, tch, th

**Current code gap:** Sub-group 3B (final digraphs) is entirely missing from `combined-blends.ts`. Additionally, sub-group 3A is currently all `pink` in the code -- it should be `teal` for single consonants/blends, while only the digraphs in 3B should be `pink`.

---

## Column 4 -- Silent E

Single tile, no sub-groups.

- **Color:** Orange / Peach
- **Tiles:** e

**Current code status:** Correct. No changes needed.

---

## Column 5 -- Suffixes

Single sub-group.

- **Color:** Lavender / Light Purple
- **Tiles:** es, s

**Current code status:** Correct. No changes needed.

---

## Summary of Gaps in `src/data/presets/combined-blends.ts`

| Gap | Column | What is missing | Tiles to add |
|-----|--------|----------------|-------------|
| 1 | Col 1 | Digraph sub-group (pink) | ch, gn, kn, ph, qu, sh, shr, th, thr, wh, wr |
| 2 | Col 2 | R-controlled vowel sub-group (orange) | ar, er, ir, or, ore, ur |
| 3 | Col 3 | Final digraph sub-group (pink) | ch, ck, dge, mb, nch, ng, tch, th |
| 4 | Col 3 | Wrong color on 3A tiles | Change from `pink` to `teal` for single consonants/blends |
| 5 | Col 1 | Wrong color on single consonants | Change from `pink` to `green`/`teal` to match screenshots |

---

## Color Coding Reference (from screenshots)

| Color | Hex family | Used for |
|-------|-----------|----------|
| Green / Teal | Teal-green | Initial single consonants, initial consonant blends, final single consonants and blends |
| Pink / Salmon | Warm pink | Digraphs (initial and final) |
| Orange / Peach | Warm orange | Short vowels, vowel teams, r-controlled vowels, silent e |
| Lavender / Light Purple | Cool purple | Suffixes |

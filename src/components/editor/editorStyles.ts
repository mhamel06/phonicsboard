/**
 * Styles for the PlaylistEditorView component.
 * Extracted to keep the main component under 500 lines.
 */

import { StyleSheet } from 'react-native';
import { APP_COLORS } from '@/utils/colors';
import type { GraphemeType } from '@/engine/types';

// ---------------------------------------------------------------------------
// Sub-group helpers
// ---------------------------------------------------------------------------

/** Human-readable labels for grapheme type groups */
export const TYPE_LABELS: Record<GraphemeType, string> = {
  consonant: 'consonants',
  vowel: 'vowels',
  blend: 'blends',
  digraph: 'digraphs',
  vowel_team: 'vowel teams',
  r_controlled: 'r-controlled',
  suffix: 'suffixes',
  schwa: 'schwa',
  heart: 'heart words',
  blank: 'blank',
};

/** Canonical ordering for sub-groups within a column */
const TYPE_ORDER: GraphemeType[] = [
  'consonant', 'blend', 'digraph', 'vowel', 'vowel_team',
  'r_controlled', 'suffix', 'schwa', 'heart', 'blank',
];

export interface TileGroup {
  type: GraphemeType;
  label: string;
  graphemes: import('@/engine/types').Grapheme[];
}

/**
 * Groups graphemes by type in canonical order, skipping empty groups.
 * If all graphemes share the same type (common with custom decks),
 * returns a single group with no label to avoid a misleading heading.
 */
export function groupByType(graphemes: import('@/engine/types').Grapheme[]): TileGroup[] {
  const map = new Map<GraphemeType, import('@/engine/types').Grapheme[]>();
  for (const g of graphemes) {
    const existing = map.get(g.type);
    if (existing) existing.push(g);
    else map.set(g.type, [g]);
  }

  // If every grapheme has the same type, skip the sub-group label
  if (map.size === 1) {
    const [type, items] = [...map.entries()][0];
    return [{ type, label: '', graphemes: items }];
  }

  const groups: TileGroup[] = [];
  for (const type of TYPE_ORDER) {
    const items = map.get(type);
    if (items && items.length > 0) {
      groups.push({ type, label: TYPE_LABELS[type], graphemes: items });
    }
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: APP_COLORS.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: APP_COLORS.primary,
    paddingBottom: 4,
  },
  deckLink: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    marginTop: 6,
  },
  headerActions: { flexDirection: 'row', gap: 8, paddingTop: 4 },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelText: {
    fontSize: 14, fontWeight: '500',
    color: APP_COLORS.textSecondary, fontFamily: 'Inter',
  },
  saveButton: { backgroundColor: APP_COLORS.primary },
  saveIcon: { marginRight: 4 },
  saveText: {
    fontSize: 14, fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter',
  },
  buttonPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },

  // Word chain (top 40%)
  wordSection: { flex: 4, minHeight: 140 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700',
    color: APP_COLORS.textSecondary, fontFamily: 'Inter',
    letterSpacing: 0.5,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  listContent: { paddingTop: 4, paddingBottom: 8 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16, marginTop: 8, marginBottom: 16,
    paddingVertical: 12,
    borderWidth: 2, borderColor: APP_COLORS.primary,
    borderStyle: 'dashed', borderRadius: 12, gap: 6,
  },
  addButtonPressed: { backgroundColor: '#F0FDF4' },
  addButtonText: {
    fontSize: 15, fontWeight: '600',
    color: APP_COLORS.primary, fontFamily: 'Inter',
  },

  // Deck reference (bottom 60%)
  deckReference: {
    flex: 6,
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
    paddingTop: 8,
  },
  deckRefTitle: {
    fontSize: 13, fontWeight: '600',
    color: APP_COLORS.textSecondary, fontFamily: 'Inter',
    marginBottom: 6, textTransform: 'uppercase',
    letterSpacing: 0.5, paddingHorizontal: 16,
  },

  // Column layout
  columnsRow: {
    flex: 1, flexDirection: 'row',
    paddingHorizontal: 16, gap: 8,
  },
  deckColumn: { flex: 1 },
  columnHeader: {
    paddingVertical: 6, alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 8, borderTopRightRadius: 8,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  columnHeaderText: {
    fontSize: 11, fontWeight: '700',
    color: APP_COLORS.textSecondary, fontFamily: 'Inter',
    textTransform: 'uppercase', letterSpacing: 0.3,
  },
  columnScroll: {
    flex: 1, backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
  },
  columnScrollContent: {
    paddingVertical: 4, paddingHorizontal: 4,
  },
  tileGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4,
  },

  // Sub-group separators
  groupSeparator: {
    height: 1, backgroundColor: '#D1D5DB',
    marginVertical: 6, marginHorizontal: 4,
  },
  groupLabel: {
    fontSize: 9, fontWeight: '600', color: '#9CA3AF',
    fontFamily: 'Inter', textTransform: 'uppercase',
    letterSpacing: 0.4, marginBottom: 3, marginLeft: 2,
  },

  // Tiles
  refTile: {
    width: 48, height: 44, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  refTilePlaced: {
    opacity: 0.6, borderWidth: 2, borderColor: '#FFFFFF',
  },
  refTilePressed: {
    opacity: 0.7, transform: [{ scale: 0.95 }],
  },
  refTileCheck: { position: 'absolute', top: 2, right: 2 },
  refTileText: {
    fontSize: 14, fontWeight: '700', color: '#FFFFFF',
    fontFamily: 'Nunito', textAlign: 'center',
  },
  refTileTextPlaced: { opacity: 0.8 },
});

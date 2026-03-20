/**
 * Elkonin box workspace — horizontal row of sound boxes.
 *
 * Displays existing boxes and a "+" button to add new ones.
 * Shows a hint message when no boxes are present.
 */

import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { ElkoninBox as ElkoninBoxType } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import ElkoninBox from './ElkoninBox';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ElkoninWorkspaceProps {
  /** Current array of Elkonin boxes */
  boxes: ElkoninBoxType[];
  /** Called when a box is tapped (place tile or clear) */
  onBoxPress: (boxId: string) => void;
  /** Called to add a new empty box */
  onAddBox: () => void;
  /** Whether a tile is currently selected (enables target highlighting) */
  hasSelectedTile?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ElkoninWorkspace({
  boxes,
  onBoxPress,
  onAddBox,
  hasSelectedTile = false,
}: ElkoninWorkspaceProps) {
  if (boxes.length === 0) {
    return (
      <Pressable style={styles.emptyContainer} onPress={onAddBox}>
        <View style={styles.emptyHintBox}>
          <Text style={styles.emptyIcon}>+</Text>
          <Text style={styles.emptyHint}>Tap to add boxes</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {boxes.map((box) => (
          <View key={box.id} style={styles.boxWrapper}>
            <ElkoninBox
              box={box}
              onPress={() => onBoxPress(box.id)}
              isTarget={hasSelectedTile && box.content === null}
            />
          </View>
        ))}

        {/* Add box button */}
        <Pressable
          onPress={onAddBox}
          style={({ pressed }) => [
            styles.addButton,
            pressed ? styles.addButtonPressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Add a new sound box"
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  boxWrapper: {
    marginRight: 0,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${APP_COLORS.primary}08`,
  },
  addButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.96 }],
  },
  addButtonText: {
    fontSize: 36,
    color: APP_COLORS.primary,
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyHintBox: {
    width: 160,
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyIcon: {
    fontSize: 40,
    color: '#9CA3AF',
    fontWeight: '300',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
});

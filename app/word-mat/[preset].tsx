/**
 * Word Mat play screen.
 *
 * Route: /word-mat/[preset]
 *
 * Layout:
 * - Top bar: Back button, Reset button, ModeSelector, preset name
 * - Center: ElkoninWorkspace (Elkonin boxes)
 * - Bottom: TileKeyboard (tile selection)
 *
 * Interaction: two-step — tap a tile to select, then tap a box to place.
 */

import React, { useEffect } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { Grapheme } from '@/engine/types';
import { APP_COLORS } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setActiveWordMat,
  addBoxAction,
  selectTileAction,
  placeTileInBoxAction,
  clearBoxAction,
  clearAllBoxesAction,
  switchModeAction,
} from '@/store/wordMatsSlice';

import ElkoninWorkspace from '@/components/word-mat/ElkoninWorkspace';
import TileKeyboard from '@/components/word-mat/TileKeyboard';
import ModeSelector from '@/components/word-mat/ModeSelector';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WordMatPlayScreen() {
  const { preset: presetId } = useLocalSearchParams<{ preset: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const presets = useAppSelector((state) => state.wordMats.presets);
  const activeState = useAppSelector(
    (state) => state.wordMats.activeWordMatState,
  );

  const preset = presets.find((p) => p.id === presetId);

  // Initialize word mat state when the screen mounts
  useEffect(() => {
    if (preset) {
      dispatch(setActiveWordMat(preset));
    }

    return () => {
      dispatch(setActiveWordMat(null));
    };
  }, [preset, dispatch]);

  // --- Guard: preset not found ---
  if (!preset) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Preset not found</Text>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButtonFallback}
          >
            <Text style={styles.backButtonFallbackText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // --- Guard: state not yet initialized ---
  if (!activeState) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Handlers ---

  function handleTileSelect(grapheme: Grapheme) {
    dispatch(selectTileAction(grapheme));
  }

  function handleBoxPress(boxId: string) {
    if (!activeState) return;

    const box = activeState.boxes.find((b) => b.id === boxId);
    if (!box) return;

    if (box.content !== null) {
      // Box is filled — clear it
      dispatch(clearBoxAction(boxId));
    } else if (activeState.selectedTile) {
      // Box is empty and tile is selected — place tile
      dispatch(placeTileInBoxAction(boxId));
    }
  }

  function handleAddBox() {
    dispatch(addBoxAction());
  }

  function handleReset() {
    dispatch(clearAllBoxesAction());
  }

  // --- Render ---

  return (
    <SafeAreaView style={styles.screen}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Pressable
            onPress={() => router.back()}
            style={styles.topBarButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.topBarButtonText}>Back</Text>
          </Pressable>

          <Pressable
            onPress={handleReset}
            style={styles.topBarButton}
            accessibilityRole="button"
            accessibilityLabel="Reset all boxes"
          >
            <Text style={styles.topBarButtonText}>Reset</Text>
          </Pressable>
        </View>

        <ModeSelector
          mode={activeState.mode}
          onModeChange={(mode) => dispatch(switchModeAction(mode))}
        />

        <Text style={styles.presetName} numberOfLines={1}>
          {preset.name}
        </Text>
      </View>

      {/* Center: Elkonin workspace */}
      <View style={styles.workspaceContainer}>
        <ElkoninWorkspace
          boxes={activeState.boxes}
          onBoxPress={handleBoxPress}
          onAddBox={handleAddBox}
          hasSelectedTile={activeState.selectedTile !== null}
        />
      </View>

      {/* Bottom: Tile keyboard */}
      <View style={styles.keyboardContainer}>
        <TileKeyboard
          preset={preset}
          selectedTile={activeState.selectedTile}
          onTileSelect={handleTileSelect}
        />
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
  },
  topBarLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  topBarButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  topBarButtonText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: APP_COLORS.textPrimary,
  },
  presetName: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    maxWidth: 120,
  },
  workspaceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: APP_COLORS.surface,
    paddingBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: APP_COLORS.textSecondary,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: APP_COLORS.textSecondary,
  },
  backButtonFallback: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: APP_COLORS.primary,
  },
  backButtonFallbackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

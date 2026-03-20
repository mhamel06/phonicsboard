/**
 * Individual Elkonin sound box.
 *
 * Renders a 100x100 rounded square that can be:
 * - Empty: white background with dashed border
 * - Filled: shows grapheme text, border colored by grapheme type
 * - Target (tile selected & ready to place): subtle highlight animation
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';

import type { ElkoninBox as ElkoninBoxType } from '@/engine/types';
import { getTileColor } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ElkoninBoxProps {
  /** The Elkonin box data (content + id) */
  box: ElkoninBoxType;
  /** Tap handler — used to place a tile or clear a box */
  onPress: () => void;
  /** Whether a tile is selected and this box is a valid drop target */
  isTarget?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BOX_SIZE = 100;
const BORDER_RADIUS = 12;
const EMPTY_BORDER_COLOR = '#D1D5DB';
const TARGET_HIGHLIGHT_COLOR = '#F2CC8F';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ElkoninBox({
  box,
  onPress,
  isTarget = false,
}: ElkoninBoxProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Subtle pulse animation when this box is a drop target
  useEffect(() => {
    if (isTarget) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }

    // Reset scale when no longer a target
    pulseAnim.setValue(1);
  }, [isTarget, pulseAnim]);

  const isFilled = box.content !== null;

  const borderColor = isFilled
    ? getTileColor(box.content!.type)
    : isTarget
      ? TARGET_HIGHLIGHT_COLOR
      : EMPTY_BORDER_COLOR;

  const containerStyle: ViewStyle = {
    borderColor,
    borderWidth: isFilled ? 3 : 2,
    borderStyle: isFilled ? 'solid' : 'dashed',
    backgroundColor: isFilled ? `${getTileColor(box.content!.type)}18` : '#FFFFFF',
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.box,
          containerStyle,
          isTarget && styles.targetHighlight,
          pressed ? styles.pressed : undefined,
        ]}
        accessibilityRole="button"
        accessibilityLabel={
          isFilled
            ? `Sound box with ${box.content!.text}`
            : 'Empty sound box'
        }
        accessibilityHint={
          isFilled
            ? 'Tap to clear this box'
            : 'Tap to place selected tile'
        }
      >
        {isFilled && (
          <Text style={styles.graphemeText}>{box.content!.text}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetHighlight: {
    backgroundColor: `${TARGET_HIGHLIGHT_COLOR}20`,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  graphemeText: {
    fontSize: 32,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: '#264653',
    textAlign: 'center',
  },
});

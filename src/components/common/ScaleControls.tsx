/**
 * Compact floating control bar for adjusting display scale.
 *
 * Designed for projector/classroom use — lets teachers quickly
 * increase or decrease tile, card, and text sizes. Semi-transparent
 * so it does not distract from the learning content.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScaleControlsProps {
  /** Current scale factor (0.5 – 2.0) */
  scale: number;
  /** Increase scale one step */
  onScaleUp: () => void;
  /** Decrease scale one step */
  onScaleDown: () => void;
  /** Reset to 100% */
  onReset: () => void;
  /** Whether further scale-up is possible */
  canScaleUp?: boolean;
  /** Whether further scale-down is possible */
  canScaleDown?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScaleControls({
  scale,
  onScaleUp,
  onScaleDown,
  onReset,
  canScaleUp = true,
  canScaleDown = true,
}: ScaleControlsProps) {
  const percentage = Math.round(scale * 100);
  const isDefault = percentage === 100;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.bar}>
        {/* Minus button */}
        <Pressable
          onPress={onScaleDown}
          disabled={!canScaleDown}
          style={({ pressed }) => [
            styles.button,
            !canScaleDown && styles.buttonDisabled,
            pressed && canScaleDown ? styles.buttonPressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Decrease display size"
        >
          <Text
            style={[
              styles.buttonText,
              !canScaleDown && styles.buttonTextDisabled,
            ]}
          >
            -
          </Text>
        </Pressable>

        {/* Scale percentage label */}
        <Pressable
          onPress={isDefault ? undefined : onReset}
          disabled={isDefault}
          style={styles.labelContainer}
          accessibilityRole="button"
          accessibilityLabel={`Display size ${percentage}%. ${isDefault ? '' : 'Tap to reset.'}`}
        >
          <Text style={[styles.label, !isDefault && styles.labelActive]}>
            {percentage}%
          </Text>
        </Pressable>

        {/* Plus button */}
        <Pressable
          onPress={onScaleUp}
          disabled={!canScaleUp}
          style={({ pressed }) => [
            styles.button,
            !canScaleUp && styles.buttonDisabled,
            pressed && canScaleUp ? styles.buttonPressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Increase display size"
        >
          <Text
            style={[
              styles.buttonText,
              !canScaleUp && styles.buttonTextDisabled,
            ]}
          >
            +
          </Text>
        </Pressable>

        {/* Reset button — only visible when not at default */}
        {!isDefault && (
          <Pressable
            onPress={onReset}
            style={({ pressed }) => [
              styles.resetButton,
              pressed ? styles.buttonPressed : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Reset display size to 100%"
          >
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 70, 83, 0.75)',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  labelContainer: {
    paddingHorizontal: 8,
    minWidth: 48,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  resetButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 2,
  },
  resetText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});

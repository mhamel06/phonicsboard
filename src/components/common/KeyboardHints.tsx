/**
 * KeyboardHints — Small overlay showing available keyboard shortcuts.
 *
 * Renders a semi-transparent panel in the bottom-right corner of the screen.
 * Web-only: hidden on native platforms.
 *
 * Toggle visibility with the "?" key (handled by the parent screen via useKeyboardNav).
 */

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export interface KeyboardHint {
  key: string;
  action: string;
}

interface KeyboardHintsProps {
  hints: KeyboardHint[];
  visible: boolean;
}

export default function KeyboardHints({ hints, visible }: KeyboardHintsProps) {
  // Only render on web
  if (Platform.OS !== 'web' || !visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.panel}>
        <Text style={styles.title}>Keyboard Shortcuts</Text>
        {hints.map((hint, index) => (
          <View key={`hint-${index}`} style={styles.row}>
            <View style={styles.keyBadge}>
              <Text style={styles.keyText}>{hint.key}</Text>
            </View>
            <Text style={styles.actionText}>{hint.action}</Text>
          </View>
        ))}
        <Text style={styles.dismissText}>Press ? to hide</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 999,
  },
  panel: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 200,
    maxWidth: 280,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  keyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
    minWidth: 28,
    alignItems: 'center',
  },
  keyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  actionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'Inter',
  },
  dismissText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 6,
    fontFamily: 'Inter',
  },
});

/**
 * useKeyboardNav — Custom hook for keyboard shortcut handling.
 *
 * Web-only: attaches a keydown listener via document.addEventListener.
 * No-ops on native platforms (iOS/Android).
 *
 * Accepts a config map of key combos to handler functions.
 * Key format: lowercase key name, optionally prefixed with modifiers
 * separated by "+", e.g. "shift+arrowright", "escape", "f".
 *
 * Modifier support: Shift, Ctrl, Alt, Meta.
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';

export interface KeyboardNavConfig {
  [key: string]: () => void;
}

/**
 * Normalize a key combo string into a canonical form for comparison.
 * E.g. "Shift+ArrowRight" -> "shift+arrowright"
 */
function normalizeCombo(combo: string): string {
  return combo.toLowerCase().trim();
}

/**
 * Build a canonical combo string from a KeyboardEvent.
 */
function comboFromEvent(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('ctrl');
  if (e.altKey) parts.push('alt');
  if (e.metaKey) parts.push('meta');
  if (e.shiftKey) parts.push('shift');
  parts.push(e.key.toLowerCase());
  return parts.join('+');
}

/**
 * Hook that registers keyboard shortcuts on the web platform only.
 *
 * @param config - Map of key combo strings to handler functions.
 *                 Keys should be lowercase, e.g. "escape", "arrowleft",
 *                 "shift+arrowright", "f", "?".
 * @param enabled - Optional flag to disable all shortcuts (default: true).
 */
export function useKeyboardNav(
  config: KeyboardNavConfig,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) return;

    // Pre-normalize all config keys for fast lookup
    const normalizedConfig = new Map<string, () => void>();
    for (const [combo, handler] of Object.entries(config)) {
      normalizedConfig.set(normalizeCombo(combo), handler);
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if user is typing in an input/textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const combo = comboFromEvent(e);
      const handler = normalizedConfig.get(combo);
      if (handler) {
        e.preventDefault();
        handler();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [config, enabled]);
}

export default useKeyboardNav;

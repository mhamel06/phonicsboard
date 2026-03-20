/**
 * Shared button component with primary, secondary, and ghost variants.
 *
 * Supports an optional leading icon via Expo vector icons (Feather set).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ButtonProps {
  /** Button label */
  title: string;
  /** Tap handler */
  onPress: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Optional Feather icon name rendered before the label */
  icon?: React.ComponentProps<typeof Feather>['name'];
  /** Size preset */
  size?: 'small' | 'medium';
  /** Disable the button */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Variant styles
// ---------------------------------------------------------------------------

interface VariantStyle {
  bg: string;
  textColor: string;
  borderColor?: string;
}

const VARIANTS: Record<'primary' | 'secondary' | 'ghost', VariantStyle> = {
  primary: {
    bg: APP_COLORS.primary,
    textColor: '#FFFFFF',
  },
  secondary: {
    bg: '#F3F4F6',
    textColor: APP_COLORS.textPrimary,
  },
  ghost: {
    bg: 'transparent',
    textColor: APP_COLORS.textSecondary,
  },
};

const SIZES: Record<'small' | 'medium', { height: number; fontSize: number; paddingH: number; iconSize: number }> = {
  small: { height: 36, fontSize: 13, paddingH: 12, iconSize: 14 },
  medium: { height: 44, fontSize: 15, paddingH: 20, iconSize: 18 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  size = 'medium',
  disabled = false,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    minHeight: s.height,
    paddingHorizontal: s.paddingH,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && !disabled ? styles.pressed : undefined,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      {icon && (
        <Feather
          name={icon}
          size={s.iconSize}
          color={v.textColor}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, { color: v.textColor, fontSize: s.fontSize }]}>
        {title}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '500',
  },
});

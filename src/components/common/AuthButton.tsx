/**
 * Compact sign-in / user-info button for the top navigation bar.
 *
 * - Signed out: shows "Sign in with Google" button
 * - Signed in: shows user avatar, name, and a sign-out action
 * - Loading: shows a subtle loading indicator
 */

import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';
import { useAuth } from '@/hooks/useAuth';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuthButton() {
  const { user, isAuthenticated, isLoading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Feather name="loader" size={18} color={APP_COLORS.textSecondary} />
      </View>
    );
  }

  // Signed out — show sign-in button
  if (!isAuthenticated || !user) {
    return (
      <Pressable
        onPress={signInWithGoogle}
        style={({ pressed }) => [
          styles.signInButton,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Sign in with Google"
      >
        <Feather name="log-in" size={16} color={APP_COLORS.primary} style={styles.icon} />
        <Text style={styles.signInText}>Sign in</Text>
      </Pressable>
    );
  }

  // Signed in — show avatar + name with sign-out menu
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setMenuOpen((prev) => !prev)}
        style={({ pressed }) => [
          styles.userButton,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Signed in as ${user.displayName}. Tap for options.`}
      >
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>
              {user.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.userName} numberOfLines={1}>
          {user.displayName}
        </Text>
        <Feather
          name={menuOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={APP_COLORS.textSecondary}
        />
      </Pressable>

      {menuOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownEmail} numberOfLines={1}>
            {user.email}
          </Text>
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              signOut();
            }}
            style={({ pressed }) => [
              styles.dropdownItem,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Feather name="log-out" size={14} color={APP_COLORS.secondary} style={styles.icon} />
            <Text style={styles.dropdownItemText}>Sign out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
    backgroundColor: APP_COLORS.surface,
  },
  signInText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: APP_COLORS.primary,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  userName: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: APP_COLORS.textPrimary,
    maxWidth: 120,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    minWidth: 180,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  dropdownEmail: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: APP_COLORS.secondary,
  },
});

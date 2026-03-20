/**
 * Optional authentication wrapper.
 *
 * When requireAuth is false (the default), children render regardless of
 * auth state — the app works fully in guest mode with local storage.
 *
 * When requireAuth is true, unauthenticated users see a sign-in prompt
 * instead of the children. This is useful for cloud-only features like
 * cross-device sync or sharing.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthGateProps {
  children: React.ReactNode;
  /** When true, show sign-in prompt for unauthenticated users. Default: false */
  requireAuth?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuthGate({ children, requireAuth = false }: AuthGateProps) {
  const { isAuthenticated, isLoading, signInWithGoogle } = useAuth();

  // Guest mode — always show children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Auth required but still loading — show nothing (or a spinner)
  if (isLoading) {
    return (
      <View style={styles.center}>
        <Feather name="loader" size={24} color={APP_COLORS.textSecondary} />
      </View>
    );
  }

  // Auth required and user is signed in
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Auth required but not signed in — show prompt
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Feather name="cloud" size={40} color={APP_COLORS.primary} />
        <Text style={styles.title}>Sign in required</Text>
        <Text style={styles.description}>
          Sign in with your Google account to access cloud features like
          cross-device sync and sharing.
        </Text>
        <Button
          title="Sign in with Google"
          icon="log-in"
          onPress={signInWithGoogle}
        />
        <Text style={styles.note}>
          You can still use PhonicsBoard without signing in.{'\n'}
          Your data is saved locally on this device.
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: APP_COLORS.background,
  },
  card: {
    alignItems: 'center',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  note: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});

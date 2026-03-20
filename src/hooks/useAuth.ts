/**
 * Authentication hook for PhonicsBoard.
 *
 * Provides Google OAuth sign-in/out via Supabase and syncs auth state
 * with Redux. The app works without authentication — signing in is
 * optional and enables cloud save and sharing features.
 */

import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

import { supabase } from '@/utils/supabase';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setUser, clearUser, setLoading, type AuthUser } from '@/store/authSlice';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Maps a Supabase user to our AuthUser shape. */
function toAuthUser(user: SupabaseUser): AuthUser {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: meta.full_name ?? meta.name ?? user.email ?? 'User',
    avatarUrl: meta.avatar_url ?? meta.picture ?? null,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((s) => s.auth);

  // -----------------------------------------------------------------------
  // Listen to Supabase auth state changes
  // -----------------------------------------------------------------------

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setUser(toAuthUser(session.user)));
      } else {
        dispatch(clearUser());
      }
    });

    // Subscribe to future auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session?.user) {
        dispatch(setUser(toAuthUser(session.user)));
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // -----------------------------------------------------------------------
  // Sign in with Google
  // -----------------------------------------------------------------------

  const signInWithGoogle = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      if (Platform.OS === 'web') {
        // On web, Supabase handles the full OAuth redirect flow
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) {
          console.error('Google sign-in error:', error.message);
          dispatch(setLoading(false));
        }
        // On success the page redirects — onAuthStateChange picks up the session
      } else {
        // On native, use Supabase OAuth with PKCE flow
        // Requires expo-auth-session and expo-web-browser to be configured
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        });

        if (error) {
          console.error('Google sign-in error:', error.message);
          dispatch(setLoading(false));
        }
      }
    } catch (err) {
      console.error('Google sign-in failed:', err);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // -----------------------------------------------------------------------
  // Sign out
  // -----------------------------------------------------------------------

  const signOut = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign-out error:', error.message);
      }
      // onAuthStateChange will fire clearUser
    } catch (err) {
      console.error('Sign-out failed:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    signInWithGoogle,
    signOut,
  };
}

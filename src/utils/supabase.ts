/**
 * Supabase client initialization for PhonicsBoard.
 *
 * Uses AsyncStorage for session persistence so auth state survives app restarts.
 * Replace placeholder values with your own Supabase project credentials.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// TODO: Replace with your Supabase project URL and anon key.
// You can also load these from environment variables via expo-constants:
//
//   import Constants from 'expo-constants';
//   const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
//   const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

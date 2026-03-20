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

const SUPABASE_URL = 'https://hqmrctsuokautqbxdzkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxbXJjdHN1b2thdXRxYnhkemtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Njc0NzMsImV4cCI6MjA4OTU0MzQ3M30._DrGXJBxnXamI2j5GzYFVIG1pFZ91rt_t27ArOjeFWI';

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

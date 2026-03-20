import { supabase } from '@/utils/supabase';
import type { Deck, Playlist, StudentProgress } from '@/engine/types';

// --- Deck Sync ---

/**
 * Upserts the user's decks to the Supabase 'user_decks' table.
 * Each deck row is keyed by (user_id, deck_id) for idempotent writes.
 */
export async function syncDecks(
  userId: string,
  decks: Deck[],
): Promise<void> {
  try {
    const rows = decks
      .filter((d) => !d.isPreset)
      .map((deck) => ({
        user_id: userId,
        deck_id: deck.id,
        data: deck,
        updated_at: deck.updatedAt,
      }));

    if (rows.length === 0) return;

    const { error } = await supabase
      .from('user_decks')
      .upsert(rows, { onConflict: 'user_id,deck_id' });

    if (error) {
      console.warn('[cloudSync] syncDecks failed:', error.message);
    }
  } catch (err) {
    console.warn('[cloudSync] syncDecks error:', err);
  }
}

/**
 * Fetches the user's custom decks from Supabase.
 * Returns an empty array on failure so the app can continue offline.
 */
export async function fetchDecks(userId: string): Promise<Deck[]> {
  try {
    const { data, error } = await supabase
      .from('user_decks')
      .select('data')
      .eq('user_id', userId);

    if (error) {
      console.warn('[cloudSync] fetchDecks failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => row.data as Deck);
  } catch (err) {
    console.warn('[cloudSync] fetchDecks error:', err);
    return [];
  }
}

// --- Playlist Sync ---

/**
 * Upserts the user's playlists to the Supabase 'user_playlists' table.
 */
export async function syncPlaylists(
  userId: string,
  playlists: Playlist[],
): Promise<void> {
  try {
    const rows = playlists
      .filter((p) => !p.isPreset)
      .map((playlist) => ({
        user_id: userId,
        playlist_id: playlist.id,
        data: playlist,
        updated_at: playlist.createdAt,
      }));

    if (rows.length === 0) return;

    const { error } = await supabase
      .from('user_playlists')
      .upsert(rows, { onConflict: 'user_id,playlist_id' });

    if (error) {
      console.warn('[cloudSync] syncPlaylists failed:', error.message);
    }
  } catch (err) {
    console.warn('[cloudSync] syncPlaylists error:', err);
  }
}

/**
 * Fetches the user's custom playlists from Supabase.
 */
export async function fetchPlaylists(userId: string): Promise<Playlist[]> {
  try {
    const { data, error } = await supabase
      .from('user_playlists')
      .select('data')
      .eq('user_id', userId);

    if (error) {
      console.warn('[cloudSync] fetchPlaylists failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => row.data as Playlist);
  } catch (err) {
    console.warn('[cloudSync] fetchPlaylists error:', err);
    return [];
  }
}

// --- Progress Sync ---

/**
 * Upserts student progress records to the Supabase 'user_progress' table.
 */
export async function syncProgress(
  userId: string,
  progress: StudentProgress[],
): Promise<void> {
  try {
    const rows = progress.map((p) => ({
      user_id: userId,
      progress_id: p.id,
      data: p,
      updated_at: p.lastActive,
    }));

    if (rows.length === 0) return;

    const { error } = await supabase
      .from('user_progress')
      .upsert(rows, { onConflict: 'user_id,progress_id' });

    if (error) {
      console.warn('[cloudSync] syncProgress failed:', error.message);
    }
  } catch (err) {
    console.warn('[cloudSync] syncProgress error:', err);
  }
}

/**
 * Fetches student progress records from Supabase.
 */
export async function fetchProgress(
  userId: string,
): Promise<StudentProgress[]> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('data')
      .eq('user_id', userId);

    if (error) {
      console.warn('[cloudSync] fetchProgress failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => row.data as StudentProgress);
  } catch (err) {
    console.warn('[cloudSync] fetchProgress error:', err);
    return [];
  }
}

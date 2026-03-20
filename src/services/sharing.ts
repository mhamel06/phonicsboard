import { supabase } from '@/utils/supabase';
import type { Deck, Playlist } from '@/engine/types';

const SHARE_BASE_URL = 'https://phonics.staylo.io/share';
const CODE_LENGTH = 6;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 for clarity

// --- Code Generation ---

/**
 * Generates a random 6-character alphanumeric share code.
 * Excludes ambiguous characters (I, O, 0, 1) for readability.
 */
export function generateShareCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/**
 * Returns the full share URL for a given code.
 */
export function getShareUrl(shareCode: string): string {
  return `${SHARE_BASE_URL}/${shareCode}`;
}

// --- Share Operations ---

/**
 * Shares a deck by creating a record in the 'shared_resources' table.
 * Returns the share code and full URL.
 */
export async function shareDeck(
  userId: string,
  deckId: string,
): Promise<{ shareCode: string; shareUrl: string }> {
  const shareCode = generateShareCode();

  try {
    // Fetch the deck data to embed in the share record
    const { data: deckRow, error: fetchError } = await supabase
      .from('user_decks')
      .select('data')
      .eq('user_id', userId)
      .eq('deck_id', deckId)
      .single();

    if (fetchError || !deckRow) {
      console.warn('[sharing] Could not fetch deck for sharing:', fetchError?.message);
      throw new Error('Deck not found');
    }

    const { error } = await supabase.from('shared_resources').insert({
      share_code: shareCode,
      resource_type: 'deck',
      resource_id: deckId,
      resource_data: deckRow.data,
      shared_by: userId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[sharing] shareDeck insert failed:', error.message);
      throw new Error('Failed to create share link');
    }

    return { shareCode, shareUrl: getShareUrl(shareCode) };
  } catch (err) {
    console.warn('[sharing] shareDeck error:', err);
    throw err;
  }
}

/**
 * Shares a playlist by creating a record in the 'shared_resources' table.
 * Returns the share code and full URL.
 */
export async function sharePlaylist(
  userId: string,
  playlistId: string,
): Promise<{ shareCode: string; shareUrl: string }> {
  const shareCode = generateShareCode();

  try {
    const { data: playlistRow, error: fetchError } = await supabase
      .from('user_playlists')
      .select('data')
      .eq('user_id', userId)
      .eq('playlist_id', playlistId)
      .single();

    if (fetchError || !playlistRow) {
      console.warn('[sharing] Could not fetch playlist for sharing:', fetchError?.message);
      throw new Error('Playlist not found');
    }

    const { error } = await supabase.from('shared_resources').insert({
      share_code: shareCode,
      resource_type: 'playlist',
      resource_id: playlistId,
      resource_data: playlistRow.data,
      shared_by: userId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[sharing] sharePlaylist insert failed:', error.message);
      throw new Error('Failed to create share link');
    }

    return { shareCode, shareUrl: getShareUrl(shareCode) };
  } catch (err) {
    console.warn('[sharing] sharePlaylist error:', err);
    throw err;
  }
}

// --- Import Operations ---

/**
 * Looks up a shared resource by its share code and returns the embedded data.
 * Returns null if the code is invalid or the lookup fails.
 */
export async function importSharedResource(
  shareCode: string,
): Promise<Deck | Playlist | null> {
  try {
    const { data, error } = await supabase
      .from('shared_resources')
      .select('resource_type, resource_data')
      .eq('share_code', shareCode.toUpperCase())
      .single();

    if (error || !data) {
      console.warn('[sharing] importSharedResource lookup failed:', error?.message);
      return null;
    }

    return data.resource_data as Deck | Playlist;
  } catch (err) {
    console.warn('[sharing] importSharedResource error:', err);
    return null;
  }
}

/**
 * Fetches share metadata for the share preview screen.
 * Returns resource type and data, or null if not found.
 */
export async function getSharedResourcePreview(
  shareCode: string,
): Promise<{
  resourceType: 'deck' | 'playlist';
  data: Deck | Playlist;
} | null> {
  try {
    const { data, error } = await supabase
      .from('shared_resources')
      .select('resource_type, resource_data')
      .eq('share_code', shareCode.toUpperCase())
      .single();

    if (error || !data) {
      return null;
    }

    return {
      resourceType: data.resource_type as 'deck' | 'playlist',
      data: data.resource_data as Deck | Playlist,
    };
  } catch {
    return null;
  }
}

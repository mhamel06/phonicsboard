import { supabase } from '@/utils/supabase';
import type { Deck, Playlist } from '@/engine/types';

const SHARE_BASE_URL = 'https://phonics.staylo.io/share';
const CODE_LENGTH = 6;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 for clarity

// --- Types ---

export interface SharedResource {
  resourceType: 'deck' | 'playlist';
  data: Deck | Playlist;
}

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
 * Accepts the full deck data directly so it works for both preset and custom decks.
 * Returns the share code and full URL.
 */
export async function shareDeck(
  userId: string,
  deck: Deck,
): Promise<{ shareCode: string; shareUrl: string }> {
  const shareCode = generateShareCode();

  try {
    const { error } = await supabase.from('shared_resources').insert({
      share_code: shareCode,
      resource_type: 'deck',
      resource_id: deck.id,
      resource_data: deck,
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
 * Accepts the full playlist data directly so it works for both preset and custom playlists.
 * Returns the share code and full URL.
 */
export async function sharePlaylist(
  userId: string,
  playlist: Playlist,
): Promise<{ shareCode: string; shareUrl: string }> {
  const shareCode = generateShareCode();

  try {
    const { error } = await supabase.from('shared_resources').insert({
      share_code: shareCode,
      resource_type: 'playlist',
      resource_id: playlist.id,
      resource_data: playlist,
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
 * Looks up a shared resource by its share code and returns the embedded data
 * along with the resource type. Returns null if the code is invalid or the
 * lookup fails.
 */
export async function importSharedResource(
  shareCode: string,
): Promise<SharedResource | null> {
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

    return {
      resourceType: data.resource_type as 'deck' | 'playlist',
      data: data.resource_data as Deck | Playlist,
    };
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

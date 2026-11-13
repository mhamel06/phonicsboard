import { getRandomBytes } from 'expo-crypto';

import { supabase } from '@/utils/supabase';
import type { Deck, Playlist } from '@/engine/types';

const SHARE_BASE_URL = 'https://phonics.staylo.io/share';
const CODE_LENGTH = 6;
/** 32 symbols (no I/O/0/1). 256 % 32 === 0, so byte % 32 is unbiased. */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_CODE_ATTEMPTS = 3;
/** Postgres unique_violation: the generated code is already taken. */
const UNIQUE_VIOLATION = '23505';

// --- Types ---

export type ShareResourceType = 'deck' | 'playlist';

export interface SharedResource {
  resourceType: ShareResourceType;
  data: Deck | Playlist;
}

// --- Code Generation ---

/**
 * Generates a cryptographically random 6-character share code.
 * Excludes ambiguous characters (I, O, 0, 1) for readability.
 */
export function generateShareCode(): string {
  const bytes = getRandomBytes(CODE_LENGTH);
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  }
  return code;
}

/** Uppercases and strips whitespace; returns null if it can't be a valid code. */
export function normalizeShareCode(input: string): string | null {
  const code = input.trim().toUpperCase();
  return /^[A-Z0-9]{6,12}$/.test(code) ? code : null;
}

/** Returns the full share URL for a given code. */
export function getShareUrl(shareCode: string): string {
  return `${SHARE_BASE_URL}/${shareCode}`;
}

// --- Share Operations ---

async function shareResource(
  userId: string,
  resourceType: ShareResourceType,
  resource: Deck | Playlist,
): Promise<{ shareCode: string; shareUrl: string }> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const shareCode = generateShareCode();
    const { error } = await supabase.from('shared_resources').insert({
      share_code: shareCode,
      resource_type: resourceType,
      resource_id: resource.id,
      resource_data: resource,
      shared_by: userId,
    });

    if (!error) return { shareCode, shareUrl: getShareUrl(shareCode) };
    if (error.code !== UNIQUE_VIOLATION) {
      console.warn(`[sharing] share ${resourceType} failed:`, error.message);
      throw new Error('Failed to create share link');
    }
  }
  throw new Error('Failed to create share link');
}

/** Shares a deck (preset or custom). Returns the share code and URL. */
export function shareDeck(
  userId: string,
  deck: Deck,
): Promise<{ shareCode: string; shareUrl: string }> {
  return shareResource(userId, 'deck', deck);
}

/** Shares a playlist (preset or custom). Returns the share code and URL. */
export function sharePlaylist(
  userId: string,
  playlist: Playlist,
): Promise<{ shareCode: string; shareUrl: string }> {
  return shareResource(userId, 'playlist', playlist);
}

// --- Import ---

/**
 * Turns a shared resource into a user-owned copy with a fresh id, so importing
 * never collides with presets, the sharer's ids, or an earlier import.
 */
export function toImportedResource(
  shared: SharedResource,
  now: Date = new Date(),
): { resourceType: 'deck'; data: Deck } | { resourceType: 'playlist'; data: Playlist } {
  const stamp = now.toISOString();
  const suffix = Array.from(getRandomBytes(4), (b) => b.toString(16).padStart(2, '0')).join('');
  const id = `${shared.resourceType}-${now.getTime()}-${suffix}`;

  if (shared.resourceType === 'deck') {
    const deck = shared.data as Deck;
    return {
      resourceType: 'deck',
      data: { ...deck, id, isPreset: false, createdAt: stamp, updatedAt: stamp },
    };
  }
  const playlist = shared.data as Playlist;
  return {
    resourceType: 'playlist',
    data: { ...playlist, id, isPreset: false, createdAt: stamp, updatedAt: stamp },
  };
}

// --- Lookup ---

/**
 * Looks up a shared resource by its exact code via the get_shared_resource
 * database function (the table itself is not publicly readable).
 * Returns null if the code is invalid, unknown, expired, or the lookup fails.
 */
export async function importSharedResource(
  shareCode: string,
): Promise<SharedResource | null> {
  const code = normalizeShareCode(shareCode);
  if (!code) return null;

  try {
    const { data, error } = await supabase.rpc('get_shared_resource', { code });
    if (error) {
      console.warn('[sharing] lookup failed:', error.message);
      return null;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || (row.resource_type !== 'deck' && row.resource_type !== 'playlist')) {
      return null;
    }
    if (!row.resource_data || typeof row.resource_data !== 'object') return null;

    return {
      resourceType: row.resource_type,
      data: row.resource_data as Deck | Playlist,
    };
  } catch (err) {
    console.warn('[sharing] lookup error:', err);
    return null;
  }
}

/** Fetches share data for the share preview screen. */
export const getSharedResourcePreview = importSharedResource;

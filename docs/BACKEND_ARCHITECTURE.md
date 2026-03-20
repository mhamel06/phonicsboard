# PhonicsBoard -- Backend Architecture

## ADR-006: Supabase as Backend Platform

**Status:** Accepted
**Date:** 2026-03-19
**Context:** PhonicsBoard needs Google authentication, cloud persistence for user data (decks, playlists, progress), and a sharing system for resources between users. The app currently uses AsyncStorage for all local persistence with Redux Toolkit managing state.

### Options Evaluated

| Criteria | Supabase | Firebase | Custom (Express + PostgreSQL) |
|----------|----------|----------|-------------------------------|
| **Google OAuth** | Built-in, one toggle | Built-in, native SDK | Manual OAuth2 implementation |
| **Data model fit** | PostgreSQL -- relational, JSONB | Firestore -- document-based | PostgreSQL -- full control |
| **Row Level Security** | Native RLS policies | Firestore security rules | Manual middleware |
| **Free tier** | 500MB DB, 1GB storage, 50K MAU | Spark: 1GB Firestore, unlimited auth | Self-hosted cost |
| **Expo compatibility** | `@supabase/supabase-js` works everywhere | `@react-native-firebase` requires native modules | Standard HTTP client |
| **Realtime** | Built-in Postgres Changes | Built-in Firestore listeners | Socket.io or SSE -- manual |
| **Offline support** | Client-side caching + sync | Built-in offline persistence | Manual implementation |
| **Vendor lock-in** | Low -- standard PostgreSQL, self-hostable | High -- proprietary APIs | None |
| **Cost at scale** | Predictable, $25/mo Pro | Pay-per-read/write, unpredictable | Server hosting costs |

### Decision

**Use Supabase.** Rationale:

1. **PostgreSQL is the right data model.** Decks have columns (JSONB), playlists link to decks (foreign key), progress references users. These are relational concerns. Firestore would force denormalization and make share-code lookups awkward.

2. **Google OAuth is a single toggle.** Supabase Auth supports Google OAuth out of the box. No native module complications with Expo -- `@supabase/supabase-js` uses standard fetch APIs that work on web and React Native.

3. **Row Level Security eliminates a custom API layer.** RLS policies enforce that users can only read/write their own data at the database level. No Express middleware needed. Shared resources use explicit RLS policies for public/shared access.

4. **Free tier is generous enough for launch.** 500MB database, 1GB file storage, 50K monthly active users. PhonicsBoard targets individual educators -- this covers the launch phase comfortably.

5. **Low vendor lock-in.** Supabase is open source and uses standard PostgreSQL. If needed, the database can be migrated to any PostgreSQL host. Firebase's proprietary query language and document model would be harder to leave.

6. **No native module issues.** Firebase's React Native SDK (`@react-native-firebase`) requires native module linking and custom dev clients in Expo. Supabase's JS client is pure JavaScript -- works with Expo Go and EAS builds without ejecting.

### Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Supabase outage blocks app | Local-first architecture -- app works offline, syncs when available |
| Free tier limits exceeded | Monitor usage; Pro tier ($25/mo) covers growth |
| RLS misconfiguration exposes data | Automated RLS policy tests in CI; security audit before launch |
| Expo SDK compatibility changes | `@supabase/supabase-js` has no native dependencies; minimal breakage surface |

---

## 1. Authentication Flow

### 1.1 Google OAuth via Supabase Auth

```
User taps "Sign in with Google"
        |
        v
supabase.auth.signInWithOAuth({ provider: 'google' })
        |
        v
Supabase redirects to Google consent screen
        |
        v
Google returns auth code to Supabase callback URL
        |
        v
Supabase exchanges code for tokens, creates/updates user in auth.users
        |
        v
Supabase returns JWT + refresh token to client
        |
        v
Client stores session via supabase.auth.onAuthStateChange()
        |
        v
All subsequent Supabase queries include JWT automatically
        |
        v
RLS policies use auth.uid() to scope data access
```

### 1.2 Platform-Specific OAuth Handling

- **Web:** Standard OAuth redirect flow. Supabase handles the callback URL.
- **Expo (mobile):** Use `expo-auth-session` + `expo-web-browser` for the OAuth redirect. Supabase supports deep link callbacks for mobile apps. Configure redirect URL as `your-app-scheme://auth/callback` in Supabase dashboard.

### 1.3 Anonymous/Guest Usage

The app must remain fully functional without sign-in. Authentication is optional and additive:

- **No account:** Everything works locally via AsyncStorage (current behavior).
- **With account:** Local data syncs to Supabase. Sharing and cross-device access become available.
- **Sign-out:** App reverts to local-only mode. Cloud data remains on server for next sign-in.

### 1.4 Auth State in Redux

Add an `authSlice` to the Redux store:

```
authSlice state:
  user: { id, email, displayName, avatarUrl } | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
```

The `supabase.auth.onAuthStateChange()` listener dispatches actions to keep Redux in sync with the Supabase auth session.

---

## 2. Database Schema

### 2.1 Entity Relationship Diagram

```
auth.users (Supabase managed)
    |
    | 1:many
    v
+------------------+     +---------------------+     +-------------------+
|     decks        |     |    playlists         |     | word_mat_presets  |
|------------------|     |---------------------|     |-------------------|
| id (uuid, PK)   |<----|linked_deck_id (FK)  |     | id (uuid, PK)    |
| user_id (FK)     |     | id (uuid, PK)       |     | user_id (FK)     |
| name             |     | user_id (FK)         |     | name             |
| columns (jsonb)  |     | name                 |     | keyboard (jsonb) |
| is_preset        |     | words (jsonb)        |     | theme (jsonb)    |
| is_public        |     | linked_deck_id (FK)  |     | is_preset        |
| share_code       |     | is_preset            |     | created_at       |
| created_at       |     | is_public            |     +-------------------+
| updated_at       |     | share_code           |
+------------------+     | created_at           |
                          | updated_at           |
                          +---------------------+

+-------------------------+     +-------------------------+
|   student_progress      |     |   shared_resources      |
|-------------------------|     |-------------------------|
| id (uuid, PK)          |     | id (uuid, PK)          |
| user_id (FK)            |     | resource_type (text)   |
| student_name            |     | resource_id (uuid)     |
| words_blended (int)     |     | share_code (text, UQ)  |
| words_spelled (int)     |     | shared_by (FK)         |
| accuracy (jsonb)        |     | created_at             |
| streak (int)            |     | expires_at             |
| total_sessions (int)    |     +-------------------------+
| last_active (timestamptz)|
+-------------------------+
```

### 2.2 Table Definitions

**decks**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK -> auth.users(id), NOT NULL | Owner |
| name | text | NOT NULL | |
| columns | jsonb | NOT NULL, default '[]' | Array of DeckColumn objects |
| is_preset | boolean | default false | System-provided decks |
| is_public | boolean | default false | Discoverable by all users |
| share_code | text | UNIQUE, nullable | 8-char alphanumeric code |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**playlists**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK -> auth.users(id), NOT NULL | Owner |
| linked_deck_id | uuid | FK -> decks(id), nullable | Associated deck |
| name | text | NOT NULL | |
| words | jsonb | NOT NULL, default '[]' | Array of PlaylistWord objects |
| is_preset | boolean | default false | |
| is_public | boolean | default false | |
| share_code | text | UNIQUE, nullable | |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**word_mat_presets**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK -> auth.users(id), NOT NULL | Owner |
| name | text | NOT NULL | |
| keyboard | jsonb | NOT NULL | Array of TileGroup objects |
| theme | jsonb | nullable | WordMatTheme object |
| is_preset | boolean | default false | |
| created_at | timestamptz | default now() | |

**student_progress**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK -> auth.users(id), NOT NULL | Teacher/parent who owns this record |
| student_name | text | NOT NULL | |
| words_blended | integer | default 0 | |
| words_spelled | integer | default 0 | |
| accuracy | jsonb | default '{}' | Record<GraphemeType, number> |
| streak | integer | default 0 | |
| total_sessions | integer | default 0 | |
| last_active | timestamptz | nullable | |

**shared_resources**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| resource_type | text | NOT NULL, CHECK IN ('deck', 'playlist') | |
| resource_id | uuid | NOT NULL | FK to decks.id or playlists.id |
| share_code | text | UNIQUE, NOT NULL | 8-char alphanumeric, e.g. "AB12CD34" |
| shared_by | uuid | FK -> auth.users(id), NOT NULL | |
| created_at | timestamptz | default now() | |
| expires_at | timestamptz | nullable | Null = never expires |

### 2.3 JSONB Column Design Rationale

Columns like `decks.columns`, `playlists.words`, and `word_mat_presets.keyboard` use JSONB rather than normalized tables. This is intentional:

- These structures are always read and written as a unit (never queried individually).
- The app already manages them as in-memory arrays in Redux.
- JSONB avoids N+1 query problems and complex JOINs for nested tile data.
- PostgreSQL JSONB supports indexing if we ever need to query into these structures.

### 2.4 Indexes

```sql
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_share_code ON decks(share_code) WHERE share_code IS NOT NULL;
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlists_share_code ON playlists(share_code) WHERE share_code IS NOT NULL;
CREATE INDEX idx_playlists_linked_deck ON playlists(linked_deck_id);
CREATE INDEX idx_student_progress_user_id ON student_progress(user_id);
CREATE INDEX idx_shared_resources_code ON shared_resources(share_code);
CREATE INDEX idx_shared_resources_resource ON shared_resources(resource_type, resource_id);
```

---

## 3. Row Level Security Policies

All tables have RLS enabled. Policies use `auth.uid()` to scope access.

### 3.1 Own Data (decks, playlists, word_mat_presets, student_progress)

```
SELECT:  auth.uid() = user_id
INSERT:  auth.uid() = user_id
UPDATE:  auth.uid() = user_id
DELETE:  auth.uid() = user_id
```

Users can only CRUD their own data. No exceptions.

### 3.2 Preset Data

```
SELECT on decks/playlists WHERE is_preset = true:  allow all authenticated users
INSERT/UPDATE/DELETE on preset rows:                service_role only (admin)
```

Preset decks and playlists are read-only for all users, writable only by admin.

### 3.3 Shared Resources

```
SELECT on decks/playlists WHERE is_public = true:  allow all authenticated users
SELECT on shared_resources:                         allow all authenticated users (lookup by code)
SELECT on decks/playlists via share_code:           allow if share_code matches
```

When a user looks up a share code, they can read the associated resource regardless of ownership. They receive a copy (INSERT into their own user_id), not a reference.

---

## 4. Sharing Flow

### 4.1 Share Code Generation

```
Teacher creates deck "CVC Blends"
        |
        v
Teacher taps "Share" button
        |
        v
Client generates 8-char alphanumeric code (e.g., "KP42MX7N")
        |
        v
Client calls supabase.from('shared_resources').insert({
    resource_type: 'deck',
    resource_id: deck.id,
    share_code: 'KP42MX7N',
    shared_by: auth.uid()
})
        |
        v
Also updates deck row: share_code = 'KP42MX7N'
        |
        v
UI shows share code + shareable link:
    phonicsboard.app/share/KP42MX7N
```

### 4.2 Import via Share Code

```
Recipient enters code "KP42MX7N" or opens link
        |
        v
Client queries: supabase.from('shared_resources')
    .select('resource_type, resource_id')
    .eq('share_code', 'KP42MX7N')
    .single()
        |
        v
Client fetches the full resource (deck or playlist) by resource_id
        |
        v
Client creates a COPY under the recipient's user_id:
    - New UUID
    - user_id = recipient's auth.uid()
    - is_preset = false
    - share_code = null (recipient's copy is not shared)
    - Same columns/words data
        |
        v
Recipient now owns an independent copy they can edit freely
```

### 4.3 Share Code Format

- 8 characters, uppercase alphanumeric, excluding ambiguous characters (0/O, 1/I/L).
- Character set: `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (30 chars).
- Collision space: 30^8 = ~656 billion combinations. No collision concern at our scale.
- Codes are case-insensitive on input (normalize to uppercase).

### 4.4 Link Sharing

Shareable links follow the format: `https://phonicsboard.app/share/{code}`

The `/share/[code]` route in Expo Router handles:
1. If user is authenticated: look up and import the resource.
2. If user is not authenticated: prompt sign-in, then import.
3. If code is invalid/expired: show error message.

---

## 5. Data Sync Strategy

### 5.1 Local-First Architecture

The app must work fully offline. Supabase is an enhancement layer, not a dependency.

```
+------------------+          +------------------+
|   Redux Store    |  <---->  |   AsyncStorage   |   (always available)
|   (runtime)      |          |   (local cache)  |
+------------------+          +------------------+
        |
        |  (when authenticated + online)
        v
+------------------+
|    Supabase      |   (cloud persistence)
|   PostgreSQL     |
+------------------+
```

### 5.2 Sync Rules

| Scenario | Behavior |
|----------|----------|
| **Not signed in** | AsyncStorage only. Current behavior. No changes. |
| **Signed in, online** | Read from Supabase on app launch. Write to both AsyncStorage and Supabase on every save. |
| **Signed in, offline** | Write to AsyncStorage. Queue mutations. Sync when back online. |
| **First sign-in (has local data)** | Merge prompt: "You have local decks. Upload to your account?" |
| **Sign out** | Keep local cache. Clear auth state. App continues in local-only mode. |
| **Sign in on new device** | Pull all user data from Supabase. Populate AsyncStorage as local cache. |

### 5.3 Conflict Resolution

Strategy: **Last-write-wins with timestamps.**

Each record has an `updated_at` field. When syncing:
1. Compare local `updated_at` with remote `updated_at`.
2. The more recent version wins.
3. If timestamps are identical (extremely rare), the server version wins.

This is acceptable because:
- PhonicsBoard is single-user per account (a teacher managing their own decks).
- There is no collaborative editing of a single resource.
- Conflicts only arise from the same user editing on two devices while offline -- an edge case.

### 5.4 Sync Implementation Approach

Introduce a `SyncService` class that manages the sync lifecycle:

```
SyncService responsibilities:
  - Listen to supabase.auth.onAuthStateChange()
  - On sign-in: pull remote data, merge with local, update Redux + AsyncStorage
  - On mutation: write to AsyncStorage immediately, queue Supabase write
  - On connectivity restored: flush queued writes to Supabase
  - On sign-out: clear sync queue, keep local cache
```

The SyncService sits between Redux middleware and the storage/Supabase layers. Redux actions trigger saves; the SyncService decides where to persist.

### 5.5 Offline Queue

Pending mutations are stored in AsyncStorage under `@phonicsboard/sync_queue`:

```
Queue entry format:
{
  id: string          // unique mutation ID
  table: string       // 'decks' | 'playlists' | etc.
  operation: string   // 'upsert' | 'delete'
  payload: object     // the row data
  timestamp: string   // ISO 8601
}
```

On connectivity restoration, the queue is flushed in order. Failed writes are retried with exponential backoff (max 3 retries).

---

## 6. Migration Plan

### 6.1 Phases

**Phase A: Add Supabase client (no user-facing changes)**
- Install `@supabase/supabase-js`.
- Configure Supabase client with project URL and anon key (stored in environment config, not hardcoded).
- Add `authSlice` to Redux store.
- No user-facing auth UI yet.

**Phase B: Add Google sign-in UI**
- Add "Sign in with Google" button to settings/profile screen.
- Implement OAuth flow with `expo-auth-session` for mobile, standard redirect for web.
- Show user avatar/name when signed in.
- App behavior is identical whether signed in or not (no sync yet).

**Phase C: Cloud persistence**
- Create Supabase database tables with migrations.
- Apply RLS policies.
- Build `SyncService` class.
- Add Redux middleware that routes saves through SyncService.
- On first sign-in, prompt user to upload existing local data.
- Modify `storage.ts` to write through SyncService when authenticated.

**Phase D: Sharing**
- Add share code generation UI (share button on deck/playlist cards).
- Build `/share/[code]` route for importing shared resources.
- Add `shared_resources` table and RLS policies.
- Add "Import from code" input in deck/playlist list screens.

### 6.2 Storage Layer Refactoring

Current storage.ts has direct AsyncStorage calls. Refactor to a `StorageAdapter` interface:

```
StorageAdapter interface:
  saveDecks(decks: Deck[]): Promise<void>
  loadDecks(): Promise<Deck[] | null>
  savePlaylists(playlists: Playlist[]): Promise<void>
  loadPlaylists(): Promise<Playlist[] | null>
  saveSettings(settings: SettingsState): Promise<void>
  loadSettings(): Promise<SettingsState | null>

Implementations:
  LocalStorageAdapter     -- current AsyncStorage logic (extracted)
  SupabaseStorageAdapter  -- Supabase client calls
  HybridStorageAdapter    -- writes to both, reads from Supabase with local fallback
```

The `HybridStorageAdapter` is the default when authenticated. It wraps both adapters and handles the sync logic described in Section 5.

### 6.3 Backward Compatibility

- Users who never sign in experience zero changes. AsyncStorage continues to work exactly as today.
- No data is deleted from AsyncStorage when Supabase is introduced.
- The `@phonicsboard/decks` and `@phonicsboard/playlists` AsyncStorage keys remain the local cache even for authenticated users.

---

## 7. New File Structure

The following new directories and files will be needed:

```
/src
  /services
    supabase.ts              # Supabase client initialization
    syncService.ts           # SyncService class
    shareService.ts          # Share code generation and import
  /store
    authSlice.ts             # Auth state management

/app
  /share
    [code].tsx               # Share code import route

/config
  supabase.config.ts         # Supabase URL + anon key (from env vars)
```

---

## 8. Security Considerations

### 8.1 API Key Handling

- The Supabase anon key is safe to include in client bundles -- it is a public key that only works with RLS policies enforced.
- The service_role key is NEVER included in client code. It is only used in server-side scripts (e.g., seeding preset data).
- Environment variables are loaded via Expo's `app.config.ts` using `process.env.EXPO_PUBLIC_SUPABASE_URL` and `process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### 8.2 RLS as Primary Defense

- Every table has RLS enabled with no default access.
- Policies are explicit: own data, preset reads, shared resource reads.
- RLS policies are version-controlled as SQL migration files in `/supabase/migrations/`.
- CI runs automated tests that verify RLS blocks unauthorized access.

### 8.3 Share Code Security

- Share codes are not secret -- they grant read-only access to a copy of the resource.
- No sensitive data is in decks/playlists (phonics tiles and word lists only).
- Optional expiration via `expires_at` field for time-limited sharing.
- Resource owners can revoke sharing by deleting the `shared_resources` row.

### 8.4 Input Validation

- Share codes are validated against the character set before querying.
- JSONB payloads (columns, words, keyboard) are validated against TypeScript types before upsert.
- User-provided names are sanitized (max length, no HTML/script injection).

---

## 9. Supabase Project Configuration Checklist

1. Enable Google OAuth provider in Supabase Auth settings.
2. Configure Google Cloud Console OAuth consent screen and credentials.
3. Set authorized redirect URIs: web callback + Expo deep link scheme.
4. Run database migrations to create tables, indexes, and RLS policies.
5. Seed preset decks and playlists via service_role key.
6. Configure Supabase environment variables in Expo app config.
7. Enable Realtime on `shared_resources` table (for future live collaboration features).
8. Set up Supabase database backups (enabled by default on paid tiers).

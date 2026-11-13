-- PhonicsBoard Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
--
-- Safe to re-run: every statement is idempotent.
--
-- Contract: table and column names here must match src/services/cloudSync.ts
-- and src/services/sharing.ts. __tests__/services/schema-contract.test.ts
-- fails if they drift apart.
--
-- Sync model: each user-owned record is stored whole in a JSONB `data` column,
-- keyed by (user_id, <record>_id). `updated_at` is the client's edit time and
-- `deleted_at` is a tombstone so deletions propagate between devices.

-- =========================================================================
-- 1. USER-OWNED SYNC TABLES
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.user_decks (
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id    TEXT        NOT NULL,
  data       JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, deck_id)
);

CREATE TABLE IF NOT EXISTS public.user_playlists (
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id TEXT        NOT NULL,
  data        JSONB       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  PRIMARY KEY (user_id, playlist_id)
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_id TEXT        NOT NULL,
  data        JSONB       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  PRIMARY KEY (user_id, progress_id)
);

ALTER TABLE public.user_decks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;

-- Owners have full access to their own rows; nobody else sees anything.
DROP POLICY IF EXISTS "own rows" ON public.user_decks;
CREATE POLICY "own rows" ON public.user_decks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own rows" ON public.user_playlists;
CREATE POLICY "own rows" ON public.user_playlists
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own rows" ON public.user_progress;
CREATE POLICY "own rows" ON public.user_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 2. SHARED RESOURCES
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.shared_resources (
  share_code    TEXT        PRIMARY KEY CHECK (share_code ~ '^[A-Z0-9]{6,12}$'),
  resource_type TEXT        NOT NULL CHECK (resource_type IN ('deck', 'playlist')),
  resource_id   TEXT        NOT NULL,
  resource_data JSONB       NOT NULL CHECK (pg_column_size(resource_data) < 512000),
  shared_by     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS shared_resources_shared_by_idx
  ON public.shared_resources (shared_by);

ALTER TABLE public.shared_resources ENABLE ROW LEVEL SECURITY;

-- Sharers manage their own shares. There is deliberately NO public SELECT
-- policy: listing all shares is impossible. Lookups go through the
-- get_shared_resource() function below, which requires the exact code.
DROP POLICY IF EXISTS "owner select" ON public.shared_resources;
CREATE POLICY "owner select" ON public.shared_resources
  FOR SELECT TO authenticated USING (auth.uid() = shared_by);

DROP POLICY IF EXISTS "owner insert" ON public.shared_resources;
CREATE POLICY "owner insert" ON public.shared_resources
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = shared_by);

DROP POLICY IF EXISTS "owner delete" ON public.shared_resources;
CREATE POLICY "owner delete" ON public.shared_resources
  FOR DELETE TO authenticated USING (auth.uid() = shared_by);

-- Look up one share by its exact code (case-insensitive). Callable by
-- signed-out visitors so share links work for everyone.
CREATE OR REPLACE FUNCTION public.get_shared_resource(code TEXT)
RETURNS TABLE (resource_type TEXT, resource_data JSONB)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.resource_type, s.resource_data
  FROM public.shared_resources s
  WHERE s.share_code = upper(trim(code))
    AND (s.expires_at IS NULL OR s.expires_at > now())
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_shared_resource(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_resource(TEXT) TO anon, authenticated;

-- Make the new tables visible to the REST API immediately.
NOTIFY pgrst, 'reload schema';

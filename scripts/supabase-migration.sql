-- PhonicsBoard Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- =========================================================================
-- 1. TABLES
-- =========================================================================

-- User decks (custom decks created by users)
CREATE TABLE IF NOT EXISTS decks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  columns JSONB NOT NULL DEFAULT '[]',
  is_preset BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User playlists (custom word chains)
CREATE TABLE IF NOT EXISTS playlists (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  linked_deck_id TEXT NOT NULL,
  words JSONB NOT NULL DEFAULT '[]',
  is_preset BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student progress tracking
CREATE TABLE IF NOT EXISTS student_progress (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  words_blended INTEGER NOT NULL DEFAULT 0,
  words_spelled INTEGER NOT NULL DEFAULT 0,
  accuracy JSONB NOT NULL DEFAULT '{}',
  streak INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shared resources (decks or playlists shared via codes)
CREATE TABLE IF NOT EXISTS shared_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('deck', 'playlist')),
  resource_id TEXT NOT NULL,
  resource_data JSONB NOT NULL,
  share_code TEXT NOT NULL UNIQUE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- =========================================================================
-- 2. INDEXES
-- =========================================================================

CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_user_id ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_resources_code ON shared_resources(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_resources_shared_by ON shared_resources(shared_by);

-- =========================================================================
-- 3. ROW LEVEL SECURITY
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_resources ENABLE ROW LEVEL SECURITY;

-- Decks: users can only access their own
CREATE POLICY "Users can view own decks"
  ON decks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own decks"
  ON decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decks"
  ON decks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own decks"
  ON decks FOR DELETE
  USING (auth.uid() = user_id);

-- Playlists: users can only access their own
CREATE POLICY "Users can view own playlists"
  ON playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playlists"
  ON playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists"
  ON playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists"
  ON playlists FOR DELETE
  USING (auth.uid() = user_id);

-- Student progress: users can only access their own
CREATE POLICY "Users can view own progress"
  ON student_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON student_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON student_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON student_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Shared resources: anyone can read by share code, only owner can write
CREATE POLICY "Anyone can view shared resources"
  ON shared_resources FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own shares"
  ON shared_resources FOR INSERT
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can delete own shares"
  ON shared_resources FOR DELETE
  USING (auth.uid() = shared_by);

-- =========================================================================
-- 4. UPDATED_AT TRIGGER
-- =========================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decks_updated_at
  BEFORE UPDATE ON decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

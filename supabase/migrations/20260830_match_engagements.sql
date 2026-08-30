-- Migration: match_engagements
-- Tracks user engagement events per match (commentary opens, H2H opens, stadium mic toggles)
-- Created: 2026-08-30

CREATE TABLE IF NOT EXISTS public.match_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  session_id TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_engagements_match
  ON public.match_engagements (match_id, event_type, occurred_at DESC);

-- ==============================================================================
-- AuraScore (Mivaj) - Polymorphic Multi-Sport Relational Schema
-- Decouples soccer-only assumptions into generalized sport taxonomies,
-- periods, scoring matrices, and clock telemetry.
-- ==============================================================================

-- 1. Sports Taxonomy
CREATE TABLE IF NOT EXISTS sports (
  id VARCHAR(50) PRIMARY KEY, -- 'football', 'basketball', 'combat', 'tennis', 'american-football'
  display_name VARCHAR(100) NOT NULL,
  icon_key VARCHAR(50) NOT NULL,
  timing_type VARCHAR(50) NOT NULL CHECK (timing_type IN ('COUNT_UP', 'COUNT_DOWN', 'ROUND_BASED', 'SET_BASED')),
  period_count INT NOT NULL DEFAULT 2,
  period_duration_minutes INT DEFAULT 45,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial sports
INSERT INTO sports (id, display_name, icon_key, timing_type, period_count, period_duration_minutes)
VALUES 
  ('football', 'Football (Soccer)', '⚽', 'COUNT_UP', 2, 45),
  ('basketball', 'Basketball', '🏀', 'COUNT_DOWN', 4, 12),
  ('combat', 'UFC / Combat Sports', '🥊', 'ROUND_BASED', 5, 5),
  ('tennis', 'Tennis', '🎾', 'SET_BASED', 3, 0),
  ('american-football', 'American Football', '🏈', 'COUNT_DOWN', 4, 15)
ON CONFLICT (id) DO NOTHING;

-- 2. Generalized Multi-Sport Matches
CREATE TABLE IF NOT EXISTS multi_sport_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
  league_code VARCHAR(50) NOT NULL,
  league_name VARCHAR(100) NOT NULL,
  home_entity_id VARCHAR(100) NOT NULL,
  home_entity_name VARCHAR(255) NOT NULL,
  home_entity_logo TEXT,
  away_entity_id VARCHAR(100) NOT NULL,
  away_entity_name VARCHAR(255) NOT NULL,
  away_entity_logo TEXT,
  match_status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  period_label VARCHAR(50) DEFAULT 'Q1',
  clock_display VARCHAR(50) DEFAULT '00:00',
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  score_summary JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_multi_sport ON multi_sport_matches(sport_id);
CREATE INDEX IF NOT EXISTS idx_multi_status ON multi_sport_matches(match_status);

-- RLS
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_sport_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sports" ON sports FOR SELECT USING (true);
CREATE POLICY "Public read multi_sport_matches" ON multi_sport_matches FOR SELECT USING (true);

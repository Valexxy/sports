-- ==============================================================================
-- AuraScore (Mivaj) - Deep Football Entity Relational Schema
-- Supports granular stadium telemetry, roster tracking, player match logs, and injuries.
-- ==============================================================================

-- 1. Stadiums Table
CREATE TABLE IF NOT EXISTS stadiums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  capacity INT NOT NULL DEFAULT 45000,
  pitch_dimensions VARCHAR(50) DEFAULT '105m x 68m',
  surface_type VARCHAR(50) DEFAULT 'Natural Grass',
  altitude_meters INT DEFAULT 50,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stadium_club ON stadiums(club_id);

-- 2. Players Table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_player_id VARCHAR(100) UNIQUE,
  club_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  position VARCHAR(20) NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
  jersey_number INT,
  nationality VARCHAR(100),
  photo_url TEXT,
  height_cm INT,
  weight_kg INT,
  season_goals INT DEFAULT 0,
  season_assists INT DEFAULT 0,
  season_appearances INT DEFAULT 0,
  market_value_eur BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_players_club ON players(club_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);

-- 3. Player Match Logs (Granular per-match telemetry)
CREATE TABLE IF NOT EXISTS player_match_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  match_id VARCHAR(100) NOT NULL,
  minutes_played INT NOT NULL DEFAULT 0,
  goals INT NOT NULL DEFAULT 0,
  assists INT NOT NULL DEFAULT 0,
  expected_goals NUMERIC(5,2) DEFAULT 0.00,
  expected_assists NUMERIC(5,2) DEFAULT 0.00,
  passes_completed INT DEFAULT 0,
  passes_total INT DEFAULT 0,
  tackles_won INT DEFAULT 0,
  interceptions INT DEFAULT 0,
  yellow_cards INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  rating NUMERIC(4,2) DEFAULT 6.50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_logs_player ON player_match_logs(player_id);
CREATE INDEX IF NOT EXISTS idx_logs_match ON player_match_logs(match_id);

-- 4. Injuries & Squad Health Table
CREATE TABLE IF NOT EXISTS injuries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id VARCHAR(100) NOT NULL,
  injury_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OUT' CHECK (status IN ('OUT', 'DOUBTFUL', 'SUSPENDED', 'RETURNING')),
  expected_return DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_injuries_club ON injuries(club_id);
CREATE INDEX IF NOT EXISTS idx_injuries_player ON injuries(player_id);

-- Row Level Security
ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view stadiums" ON stadiums FOR SELECT USING (true);
CREATE POLICY "Public view players" ON players FOR SELECT USING (true);
CREATE POLICY "Public view player logs" ON player_match_logs FOR SELECT USING (true);
CREATE POLICY "Public view injuries" ON injuries FOR SELECT USING (true);

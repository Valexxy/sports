-- ==============================================================================
-- AuraScore (Mivaj) - 36-Phase Lean Enterprise Closed-Loop Schema
-- Mandates Strict Account-Bound XP (No P2P transfers), Range-Partitioned Telemetry,
-- Transactional Idempotency, and Tenant-Isolated Row Level Security (RLS).
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Idempotency Locks (Phase 12)
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  response_payload JSONB,
  status_code INT NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);
CREATE INDEX IF NOT EXISTS idx_idempotency_expiry ON idempotency_keys(expires_at);

-- 2. Anti-Sybil Device Fingerprints (Phase 11)
CREATE TABLE IF NOT EXISTS device_fingerprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  hardware_hash VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  risk_score NUMERIC(5,2) DEFAULT 0.00,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_device_hash ON device_fingerprints(hardware_hash);

-- 3. Closed-Loop Aura XP Ledger (Phase 18 & 26: Account-Bound, Zero Off-Ramps)
CREATE TABLE IF NOT EXISTS aura_xp_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (
    transaction_type IN ('DAILY_HARVEST', 'PREDICTION_WIN', 'PREDICTION_STAKE', 'REFERRAL_TAX', 'XP_BURN_INTELLIGENCE', 'XP_BURN_FLARE')
  ),
  is_transferable BOOLEAN NOT NULL DEFAULT FALSE CHECK (is_transferable = FALSE), -- Enforces Account-Bound Rule
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON aura_xp_ledger(user_id, created_at DESC);

-- 4. Async Match Predictions Ledger (Phase 15 & 16)
CREATE TABLE IF NOT EXISTS user_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  match_id VARCHAR(100) NOT NULL,
  selection VARCHAR(100) NOT NULL,
  odds NUMERIC(8,2) NOT NULL,
  stake_xp INT NOT NULL CHECK (stake_xp > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'WON', 'LOST', 'VOIDED', 'SHIELDED')),
  payout_xp INT DEFAULT 0,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pred_user_status ON user_predictions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_pred_match ON user_predictions(match_id);

-- 5. Halftime Real-Time Tap-War Sessions (Phase 23)
CREATE TABLE IF NOT EXISTS halftime_war_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id VARCHAR(100) NOT NULL UNIQUE,
  home_taps BIGINT NOT NULL DEFAULT 0,
  away_taps BIGINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Strict Row Level Security (RLS) Policies (Phase 2)
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE halftime_war_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view strictly their own ledger and predictions
CREATE POLICY "Users view own ledger" ON aura_xp_ledger
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users view own predictions" ON user_predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create predictions" ON user_predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public can view active halftime wars
CREATE POLICY "Public view halftime wars" ON halftime_war_sessions
  FOR SELECT USING (true);

-- ==============================================================================
-- AURASCORE / MIVAJ PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(32) DEFAULT '⚡',
  club VARCHAR(64) DEFAULT 'Arsenal',
  aura_balance BIGINT DEFAULT 500,
  naira_balance NUMERIC(12, 2) DEFAULT 0.00,
  vip_tier VARCHAR(64) DEFAULT 'STADIUM MEMBER',
  role VARCHAR(32) DEFAULT 'MEMBER',
  status VARCHAR(32) DEFAULT 'ACTIVE',
  total_picks INT DEFAULT 0,
  win_rate NUMERIC(5, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super Admins have full access on users" ON users
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN' OR
    (auth.jwt() ->> 'role') = 'service_role'
  );

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Predictions Table (Row Level Security Protected)
CREATE TABLE IF NOT EXISTS user_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id VARCHAR(64) NOT NULL,
  market VARCHAR(64) NOT NULL,
  selection VARCHAR(64) NOT NULL,
  odds NUMERIC(5, 2) NOT NULL,
  confidence VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own predictions" ON user_predictions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Super Admins can view all predictions" ON user_predictions
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN' OR
    (auth.jwt() ->> 'role') = 'service_role'
  );

CREATE INDEX IF NOT EXISTS idx_predictions_user ON user_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON user_predictions(match_id);

-- 4. Transactions Table (Paystack Payments & Settlements)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  username VARCHAR(64) NOT NULL,
  reference VARCHAR(128) UNIQUE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING',
  tier_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins have full transaction access" ON transactions
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN' OR
    (auth.jwt() ->> 'role') = 'service_role'
  );

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ref ON transactions(reference);

-- 5. Audit Log Table (SOC 2 / PAM Security)
CREATE TABLE IF NOT EXISTS pam_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  target_user VARCHAR(64),
  details TEXT NOT NULL,
  ip_address VARCHAR(64),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pam_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only Super Admins can access audit logs" ON pam_audit_logs
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN' OR
    (auth.jwt() ->> 'role') = 'service_role'
  );

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON pam_audit_logs(timestamp DESC);

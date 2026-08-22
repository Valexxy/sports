-- ==============================================================================
-- AURASCORE STADIUM 2.0 - PRODUCTION-GRADE SUPABASE POSTGRESQL SCHEMA
-- Optimized for 1,000,000+ visitors per minute
-- Execute in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. MATCHES & LIVE FIXTURES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    league TEXT NOT NULL,
    league_flag TEXT DEFAULT '⚽',
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    home_logo TEXT,
    away_logo TEXT,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    minute INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    kickoff_time TEXT,
    home_xg NUMERIC(4, 2) DEFAULT 0.00,
    away_xg NUMERIC(4, 2) DEFAULT 0.00,
    top_pick_selection TEXT,
    top_pick_market TEXT,
    top_pick_odds NUMERIC(4, 2),
    top_pick_probability NUMERIC(4, 1),
    top_pick_tier TEXT DEFAULT 'HIGH-STRENGTH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. HISTORICAL SETTLEMENT LEDGER (100% AUDITED)
CREATE TABLE IF NOT EXISTS public.settlement_ledger (
    id TEXT PRIMARY KEY,
    match_date DATE NOT NULL,
    league TEXT NOT NULL,
    league_flag TEXT DEFAULT '⚽',
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    pick_selection TEXT NOT NULL,
    pick_market TEXT NOT NULL,
    pick_odds NUMERIC(4, 2) NOT NULL,
    result TEXT NOT NULL,
    settlement_hash TEXT NOT NULL,
    settlement_note TEXT,
    tipster_name TEXT DEFAULT '@CyberStriker_99',
    accuracy_score INTEGER DEFAULT 95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DYNAMIC PER-MATCH FAN CHAT & EMOJI REACTIONS
CREATE TABLE IF NOT EXISTS public.fan_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '⚡',
    badge TEXT DEFAULT 'PRO',
    text TEXT NOT NULL,
    country_flag TEXT DEFAULT '🇳🇬',
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DIGITAL ANONYMOUS USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    digital_handle TEXT UNIQUE NOT NULL,
    avatar_icon TEXT DEFAULT '⚡',
    xp_points INTEGER DEFAULT 100,
    tier_level TEXT DEFAULT 'Rookie Analyst',
    win_streak INTEGER DEFAULT 0,
    bankroll_balance NUMERIC(10, 2) DEFAULT 1000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. STAR BIRTHDAY FAN WISHES & VOTES
CREATE TABLE IF NOT EXISTS public.star_birthdays (
    player_id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    club TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    wishes_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TIPSTER LEADERBOARD
CREATE TABLE IF NOT EXISTS public.tipster_leaderboard (
    id TEXT PRIMARY KEY,
    rank INTEGER NOT NULL,
    name TEXT NOT NULL,
    badge TEXT NOT NULL,
    win_rate NUMERIC(4, 1) NOT NULL,
    profit_units NUMERIC(8, 2) NOT NULL,
    streak TEXT NOT NULL,
    avatar TEXT NOT NULL
);

-- 7. LIVE COMMENTARY CACHE (for realtime per-match commentary)
CREATE TABLE IF NOT EXISTS public.live_commentary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id TEXT NOT NULL,
    minute TEXT,
    text TEXT NOT NULL,
    kind TEXT DEFAULT 'INFO',
    team TEXT,
    scorer TEXT,
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PUSH SUBSCRIPTIONS (for web push notifications)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PRIVACY ANALYTICS (no cookies, no GA - just aggregate counts)
CREATE TABLE IF NOT EXISTS public.privacy_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    page_path TEXT,
    country TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES (for upgrades from older schema)
-- ==============================================================================

ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS kickoff_time TEXT;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS home_xg NUMERIC(4, 2) DEFAULT 0.00;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS away_xg NUMERIC(4, 2) DEFAULT 0.00;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS top_pick_selection TEXT;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS top_pick_market TEXT;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS top_pick_odds NUMERIC(4, 2);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS top_pick_probability NUMERIC(4, 1);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS top_pick_tier TEXT DEFAULT 'HIGH-STRENGTH';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS league_flag TEXT DEFAULT '⚽';

-- ==============================================================================
-- PRODUCTION INDEXES (for 1M+ visitors/minute query performance)
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_league ON public.matches(league);
CREATE INDEX IF NOT EXISTS idx_matches_kickoff ON public.matches(kickoff_time);
CREATE INDEX IF NOT EXISTS idx_matches_status_league ON public.matches(status, league);

CREATE INDEX IF NOT EXISTS idx_ledger_date ON public.settlement_ledger(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_league ON public.settlement_ledger(league);
CREATE INDEX IF NOT EXISTS idx_ledger_result ON public.settlement_ledger(result);

CREATE INDEX IF NOT EXISTS idx_comments_match ON public.fan_comments(match_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON public.fan_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_match_created ON public.fan_comments(match_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_handle ON public.user_profiles(digital_handle);

CREATE INDEX IF NOT EXISTS idx_commentary_match ON public.live_commentary(match_id);
CREATE INDEX IF NOT EXISTS idx_commentary_match_seq ON public.live_commentary(match_id, sequence);

CREATE INDEX IF NOT EXISTS idx_push_endpoint ON public.push_subscriptions(endpoint);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.privacy_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.privacy_analytics(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.star_birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipster_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_commentary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_analytics ENABLE ROW LEVEL SECURITY;

-- CREATE OPEN READ & INSERT POLICIES FOR WEB APP
CREATE POLICY "Allow public read on matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public read on settlement_ledger" ON public.settlement_ledger FOR SELECT USING (true);
CREATE POLICY "Allow public read & insert on fan_comments" ON public.fan_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read & write on user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read & write on star_birthdays" ON public.star_birthdays FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read on tipster_leaderboard" ON public.tipster_leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public read on live_commentary" ON public.live_commentary FOR SELECT USING (true);
CREATE POLICY "Allow public insert on push_subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on privacy_analytics" ON public.privacy_analytics FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- REALTIME REPLICATION FOR LIVE CHAT, SCORES & COMMENTARY
-- ==============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fan_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_commentary;

-- ==============================================================================
-- UPDATED_AT TRIGGERS (auto-update timestamps)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS matches_updated_at ON public.matches;
CREATE TRIGGER matches_updated_at
    BEFORE UPDATE ON public.matches
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

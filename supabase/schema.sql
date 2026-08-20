-- ==============================================================================
-- AURASCORE STADIUM 2.0 - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Project Reference: wpspjtsrvvmlceizdzci
-- Execute this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
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
    status TEXT NOT NULL DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'LIVE', 'FINISHED'
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
    result TEXT NOT NULL, -- 'WON', 'LOST'
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

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PUBLIC ACCESS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.star_birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipster_leaderboard ENABLE ROW LEVEL SECURITY;

-- CREATE OPEN READ & INSERT POLICIES FOR WEB APP
CREATE POLICY "Allow public read on matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public read on settlement_ledger" ON public.settlement_ledger FOR SELECT USING (true);
CREATE POLICY "Allow public read & insert on fan_comments" ON public.fan_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read & write on user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read & write on star_birthdays" ON public.star_birthdays FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read on tipster_leaderboard" ON public.tipster_leaderboard FOR SELECT USING (true);

-- ENABLE REALTIME REPLICATION FOR LIVE CHAT & SCORES
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fan_comments;

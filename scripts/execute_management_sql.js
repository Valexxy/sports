const https = require('https');

const PROJECT_REF = 'wpspjtsrvvmlceizdzci';
const ACCESS_TOKEN = process.argv[2] || process.env.SUPABASE_ACCESS_TOKEN || '';

const sqlScript = `
-- 1. DROP ALL UNRELATED OLD TABLES
DROP TABLE IF EXISTS public.todos CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;

-- 2. CREATE THE 6 CORE AURASCORE PRODUCTION TABLES
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    league TEXT NOT NULL,
    league_flag TEXT DEFAULT '⚽',
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    minute INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    home_xg NUMERIC(4, 2) DEFAULT 0.00,
    away_xg NUMERIC(4, 2) DEFAULT 0.00,
    top_pick_selection TEXT,
    top_pick_market TEXT,
    top_pick_odds NUMERIC(4, 2),
    top_pick_probability NUMERIC(4, 1),
    top_pick_tier TEXT DEFAULT 'HIGH-STRENGTH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    digital_handle TEXT UNIQUE NOT NULL,
    avatar_icon TEXT DEFAULT '⚡',
    xp_points INTEGER DEFAULT 100,
    tier_level TEXT DEFAULT 'Rookie Analyst',
    win_streak INTEGER DEFAULT 0,
    bankroll_balance NUMERIC(10, 2) DEFAULT 1000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.star_birthdays (
    player_id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    club TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    wishes_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- 3. ENABLE RLS POLICIES & REALTIME
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.star_birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipster_leaderboard ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Matches') THEN
    CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Settlement') THEN
    CREATE POLICY "Public Read Settlement" ON public.settlement_ledger FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public All Comments') THEN
    CREATE POLICY "Public All Comments" ON public.fan_comments FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public All Profiles') THEN
    CREATE POLICY "Public All Profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public All Birthdays') THEN
    CREATE POLICY "Public All Birthdays" ON public.star_birthdays FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Leaderboard') THEN
    CREATE POLICY "Public Read Leaderboard" ON public.tipster_leaderboard FOR SELECT USING (true);
  END IF;
END $$;
`;

async function runManagementQuery() {
  console.log(`Connecting to Supabase Management API for project: ${PROJECT_REF}...`);

  const payload = JSON.stringify({ query: sqlScript });

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ All SQL executed successfully! Database cleaned and 6 tables created in Supabase.');
      } else {
        console.log('Response body:', body);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
  });

  req.write(payload);
  req.end();
}

runManagementQuery();

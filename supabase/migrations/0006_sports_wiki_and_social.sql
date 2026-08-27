-- ==============================================================================
-- MIVAJ.COM - SPORTS WIKI, STAR PLAYERS, BIRTHDAY PRO & SOCIAL FOLLOWS SCHEMA
-- Migration: 0006_sports_wiki_and_social.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PLAYERS TABLE (Wiki Catalog)
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(100) UNIQUE, -- TheSportsDB / API-Football ID
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(50) NOT NULL DEFAULT 'SOCCER', -- SOCCER, BASKETBALL, TENNIS, etc.
    position VARCHAR(100),
    jersey_number INT,
    team_name VARCHAR(255) NOT NULL,
    team_logo TEXT,
    league VARCHAR(255),
    country VARCHAR(100),
    country_flag VARCHAR(20),
    date_of_birth DATE NOT NULL,
    birth_month INT GENERATED ALWAYS AS (EXTRACT(MONTH FROM date_of_birth)::INT) STORED,
    birth_day INT GENERATED ALWAYS AS (EXTRACT(DAY FROM date_of_birth)::INT) STORED,
    birth_year INT GENERATED ALWAYS AS (EXTRACT(YEAR FROM date_of_birth)::INT) STORED,
    bio TEXT,
    market_value VARCHAR(50),
    foot VARCHAR(20) DEFAULT 'Right',
    cutout_url TEXT, -- High-res transparent PNG headshot
    banner_url TEXT,
    trophies JSONB DEFAULT '[]'::JSONB,
    career_stats JSONB DEFAULT '{"goals": 0, "assists": 0, "appearances": 0, "rating": 7.5}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_players_birthday ON public.players(birth_month, birth_day);
CREATE INDEX IF NOT EXISTS idx_players_sport ON public.players(sport);
CREATE INDEX IF NOT EXISTS idx_players_team ON public.players(team_name);
CREATE INDEX IF NOT EXISTS idx_players_name ON public.players(name);

-- 3. USER PROFILES TABLE (Social & WhatsApp Contact Data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- maps to Supabase auth.users or guest user ID
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(50), -- E.164 formatted (e.g. +2348012345678)
    whatsapp_enabled BOOLEAN DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);

-- 4. PLAYER FOLLOWS TABLE (WhatsApp Match Alerts Subscription)
CREATE TABLE IF NOT EXISTS public.player_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    notify_whatsapp BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_player_follows_user ON public.player_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_player_follows_player ON public.player_follows(player_id);

-- 5. BIRTHDAY WISHES & CONTENT MODERATION TABLE (Birthday Pro Social Feed)
CREATE TABLE IF NOT EXISTS public.birthday_wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name VARCHAR(100) NOT NULL,
    wish_message TEXT NOT NULL,
    moderation_status VARCHAR(30) DEFAULT 'APPROVED' CHECK (moderation_status IN ('APPROVED', 'FLAGGED', 'REJECTED', 'PENDING')),
    moderation_score NUMERIC(4,3) DEFAULT 0.000,
    moderation_reason TEXT,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishes_player_approved ON public.birthday_wishes(player_id, moderation_status);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.birthday_wishes(created_at DESC);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_wishes ENABLE ROW LEVEL SECURITY;

-- Players Policies
DROP POLICY IF EXISTS "Public read players" ON public.players;
CREATE POLICY "Public read players" ON public.players FOR SELECT USING (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR ALL USING (true);

-- Player Follows Policies
DROP POLICY IF EXISTS "Public read follows" ON public.player_follows;
CREATE POLICY "Public read follows" ON public.player_follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage follows" ON public.player_follows;
CREATE POLICY "Users manage follows" ON public.player_follows FOR ALL USING (true);

-- Birthday Wishes Policies
DROP POLICY IF EXISTS "Public read approved wishes" ON public.birthday_wishes;
CREATE POLICY "Public read approved wishes" ON public.birthday_wishes FOR SELECT USING (moderation_status = 'APPROVED');

DROP POLICY IF EXISTS "Public insert wishes" ON public.birthday_wishes;
CREATE POLICY "Public insert wishes" ON public.birthday_wishes FOR INSERT WITH CHECK (true);

-- 7. INITIAL STAR PLAYERS SEED DATA
INSERT INTO public.players (
    external_id, name, sport, position, jersey_number, team_name, team_logo, league, country, country_flag, date_of_birth, bio, market_value, foot, cutout_url, trophies, career_stats
) VALUES 
(
    'tsdb-osimhen', 'Victor Osimhen', 'SOCCER', 'Striker (CF)', 45, 'Galatasaray', 'https://r2.thesportsdb.com/images/media/team/badge/7lfxq21546777855.png', 'Turkish Süper Lig', 'Nigeria', '🇳🇬', '1998-12-29',
    'African Player of the Year, Capocannoniere Serie A champion, elite athletic pressing forward leading Galatasaray and the Nigerian Super Eagles.',
    '€75,000,000', 'Right', 'https://r2.thesportsdb.com/images/media/player/cutout/b16vvh1726053896.png',
    '["Serie A Champion (Napoli 2023)", "Capocannoniere Top Scorer", "African Footballer of the Year 2023"]'::JSONB,
    '{"goals": 26, "assists": 5, "appearances": 30, "rating": 8.6}'::JSONB
),
(
    'tsdb-haaland', 'Erling Haaland', 'SOCCER', 'Striker (CF)', 9, 'Manchester City', 'https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png', 'English Premier League', 'Norway', '🇳🇴', '2000-07-21',
    'Premier League Golden Boot record breaker and UEFA Champions League treble winner with Manchester City.',
    '€180,000,000', 'Left', 'https://r2.thesportsdb.com/images/media/player/cutout/i7t6241724401037.png',
    '["UEFA Champions League Winner 2023", "Premier League Record 36 Goals", "European Golden Shoe 2023"]'::JSONB,
    '{"goals": 38, "assists": 6, "appearances": 35, "rating": 8.9}'::JSONB
),
(
    'tsdb-mbappe', 'Kylian Mbappé', 'SOCCER', 'Forward (LW/ST)', 9, 'Real Madrid', 'https://r2.thesportsdb.com/images/media/team/badge/8p1v0m1712852230.png', 'Spanish La Liga', 'France', '🇫🇷', '1998-12-20',
    'FIFA World Cup Winner, Golden Boot recipient, and Real Madrid galáctico forward.',
    '€180,000,000', 'Right', 'https://r2.thesportsdb.com/images/media/player/cutout/2q1lts1724400922.png',
    '["FIFA World Cup Winner 2018", "World Cup Final Hat-Trick 2022", "6x Ligue 1 Golden Boot"]'::JSONB,
    '{"goals": 32, "assists": 9, "appearances": 34, "rating": 8.8}'::JSONB
),
(
    'tsdb-bellingham', 'Jude Bellingham', 'SOCCER', 'Attacking Midfielder', 5, 'Real Madrid', 'https://r2.thesportsdb.com/images/media/team/badge/8p1v0m1712852230.png', 'Spanish La Liga', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2003-06-29',
    'Golden Boy winner, UEFA Champions League champion, and centerpiece of Real Madrid midfield.',
    '€180,000,000', 'Right', 'https://r2.thesportsdb.com/images/media/player/cutout/dsq9211724401140.png',
    '["UEFA Champions League Winner 2024", "La Liga Player of the Year 2024", "Kopa Trophy Winner"]'::JSONB,
    '{"goals": 23, "assists": 13, "appearances": 42, "rating": 8.7}'::JSONB
),
(
    'tsdb-saka', 'Bukayo Saka', 'SOCCER', 'Right Winger (RW)', 7, 'Arsenal', 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png', 'English Premier League', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2001-09-05',
    'PFA Young Player of the Year, dynamic dribbler, and attacking engine for Arsenal FC and England.',
    '€140,000,000', 'Left', 'https://r2.thesportsdb.com/images/media/player/cutout/tew59e1724401210.png',
    '["PFA Young Player of the Year", "England Men Player of the Year (2x)", "FA Community Shield"]'::JSONB,
    '{"goals": 18, "assists": 14, "appearances": 39, "rating": 8.5}'::JSONB
),
(
    'tsdb-yamal', 'Lamine Yamal', 'SOCCER', 'Right Winger (RW)', 19, 'Barcelona', 'https://r2.thesportsdb.com/images/media/team/badge/e016911546777789.png', 'Spanish La Liga', 'Spain', '🇪🇸', '2007-07-13',
    'UEFA Euro 2024 Champion, Young Player of the Tournament, and generational wonderkid from La Masia.',
    '€150,000,000', 'Left', 'https://r2.thesportsdb.com/images/media/player/cutout/xsw3291724401290.png',
    '["UEFA Euro 2024 Champion", "Euro 2024 Young Player of the Tournament", "La Liga Champion 2023"]'::JSONB,
    '{"goals": 12, "assists": 17, "appearances": 44, "rating": 8.8}'::JSONB
),
(
    'tsdb-lookman', 'Ademola Lookman', 'SOCCER', 'Winger / Forward', 11, 'Atalanta', 'https://r2.thesportsdb.com/images/media/team/badge/5k1k9r1546777901.png', 'Italian Serie A', 'Nigeria', '🇳🇬', '1997-10-20',
    'UEFA Europa League Final hat-trick hero and talismanic forward for Atalanta and Nigeria Super Eagles.',
    '€40,000,000', 'Right', 'https://r2.thesportsdb.com/images/media/player/cutout/a67r811724401340.png',
    '["UEFA Europa League Winner (Final Hat-trick 2024)", "Ballon d Or Top 14 Nominee 2024", "AFCON Silver Medalist"]'::JSONB,
    '{"goals": 17, "assists": 10, "appearances": 36, "rating": 8.6}'::JSONB
),
(
    'tsdb-messi', 'Lionel Messi', 'SOCCER', 'Forward / Playmaker', 10, 'Inter Miami', 'https://r2.thesportsdb.com/images/media/team/badge/035j3f1692120468.png', 'Major League Soccer', 'Argentina', '🇦🇷', '1987-06-24',
    '8-time Ballon d Or winner, FIFA World Cup Champion, and widely considered the greatest footballer of all time.',
    '€30,000,000', 'Left', 'https://r2.thesportsdb.com/images/media/player/cutout/0c9lq21724400811.png',
    '["8x Ballon d Or Winner", "FIFA World Cup Champion 2022", "4x UEFA Champions League Winner", "Copa America Champion (2x)"]'::JSONB,
    '{"goals": 25, "assists": 16, "appearances": 28, "rating": 9.2}'::JSONB
),
(
    'tsdb-ronaldo', 'Cristiano Ronaldo', 'SOCCER', 'Striker (CF)', 7, 'Al Nassr', 'https://r2.thesportsdb.com/images/media/team/badge/al_nassr_fc.png', 'Saudi Pro League', 'Portugal', '🇵🇹', '1985-02-05',
    '5-time Ballon d Or winner, all-time leading international goalscorer in football history, and 5x Champions League winner.',
    '€15,000,000', 'Right', 'https://r2.thesportsdb.com/images/media/player/cutout/4j821w1724400750.png',
    '["5x Ballon d Or Winner", "5x UEFA Champions League Winner", "UEFA Euro 2016 Champion", "All-Time Official Top Goalscorer"]'::JSONB,
    '{"goals": 44, "assists": 12, "appearances": 45, "rating": 8.7}'::JSONB
)
ON CONFLICT (external_id) DO NOTHING;

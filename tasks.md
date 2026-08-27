# MIVAJ.COM - SPORTS WIKI & SOCIAL ENGAGEMENT PLATFORM
## Master Tasks & Execution Source of Truth

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | **Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons** | Sports wiki UI, `/players/[id]` dynamic profiles, Birthday Pro feed, Canvas social sharing cards |
| **Backend API** | **Python (FastAPI), managed via `uv`** | High-performance async API for player queries, content moderation pipeline, WhatsApp hooks |
| **Task Queue** | **BullMQ + Redis (Upstash / Local)** | Data ingestion workers, WAHA 15-min pre-match alert scheduler, async moderation queue |
| **Database** | **Supabase (PostgreSQL + RLS)** | Relational player catalog, user profiles, follow relations, birthday wishes ledger |
| **Notifications** | **WAHA (WhatsApp HTTP API)** | Real-time 15-min pre-kickoff match alert dispatcher with team line-ups |
| **Deployment** | **Docker, Docker Compose, Render Blueprint (`render.yaml`)** | Containerized microservices optimized for Always Free / Render hosting |

---

## 📋 Database Schema & Relational Design (Supabase PostgreSQL)

```sql
-- 1. PLAYERS TABLE (Wiki Catalog)
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(100) UNIQUE, -- SportsDB/API-Football ID
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
    foot VARCHAR(20),
    cutout_url TEXT, -- Transparent PNG portrait
    banner_url TEXT,
    trophies JSONB DEFAULT '[]'::JSONB,
    career_stats JSONB DEFAULT '{}'::JSONB, -- { goals: 28, assists: 6, appearances: 32, rating: 8.4 }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(50), -- E.164 formatted (e.g. +2348012345678)
    whatsapp_enabled BOOLEAN DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLAYER FOLLOWS TABLE
CREATE TABLE public.player_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    notify_whatsapp BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, player_id)
);

-- 4. BIRTHDAY WISHES & CONTENT MODERATION TABLE
CREATE TABLE public.birthday_wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name VARCHAR(100) NOT NULL,
    wish_message TEXT NOT NULL,
    moderation_status VARCHAR(30) DEFAULT 'PENDING' CHECK (moderation_status IN ('APPROVED', 'FLAGGED', 'REJECTED', 'PENDING')),
    moderation_score NUMERIC(4,3) DEFAULT 0.000,
    moderation_reason TEXT,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Public read approved wishes" ON public.birthday_wishes FOR SELECT USING (moderation_status = 'APPROVED');
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage own follows" ON public.player_follows FOR ALL USING (auth.uid() = user_id);
```

---

## 🛣️ API Endpoints Roadmap (FastAPI Backend)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/players` | Paginated search & filter for sports stars (by sport, league, team, country) |
| `GET` | `/api/v1/players/{id}` | Deep player wiki profile (bio, trophies, stats, current team) |
| `GET` | `/api/v1/players/birthdays/today` | Today's celebrating sports stars with upcoming match footprint |
| `GET` | `/api/v1/players/{id}/wishes` | Fetch approved birthday wishes for a player |
| `POST` | `/api/v1/players/{id}/wishes` | Submit birthday wish with automated synchronous moderation pipeline |
| `POST` | `/api/v1/moderation/check` | Standalone moderation verification (OpenAI Moderation + Strict Blocklist) |
| `POST` | `/api/v1/follows/{player_id}` | Follow/unfollow player for WhatsApp kickoff alerts |
| `POST` | `/api/v1/webhooks/sports-sync` | Trigger manual sync from sports data APIs |
| `POST` | `/api/v1/notifications/test-waha` | Send test WhatsApp notification via WAHA |

---

## ⚙️ Background Queue & Worker Architecture (BullMQ + Redis)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DATA INGESTION QUEUE (daily-player-sync)                 │
│    • Frequency: Nightly at 02:00 UTC                        │
│    • Queries: TheSportsDB & API-Football                    │
│    • Logic: Upserts player bio, stats, cutouts into Supabase│
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│ 2. MATCH ALERT QUEUE (waha-match-alerts)                    │
│    • Frequency: Every 5 minutes                             │
│    • Logic: Finds fixtures kicking off in next 15-20 mins   │
│    • Matches followed players with active user phone numbers│
│    • Sends customized WhatsApp alert via WAHA HTTP API      │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│ 3. CONTENT MODERATION PIPELINE                              │
│    • Two-stage verification: Local strict blocklist + AI API │
│    • Toxicity, profanity, spam & abuse rejection            │
│    • Approved wishes instantly committed to database        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Next.js Frontend Modules

1. **Dynamic Wiki Route**: `/players/[id]`
   - Full player header with verified cutout headshot, country flag, club crest.
   - Deep biographical dossier, career trophies, and interactive performance radar.
   - One-tap WhatsApp Match Alert toggle.
2. **Birthday Pro Hub**: `/birthdays`
   - Real-time month/day filter, celebratory confetti, wish submission feed.
3. **9:16 & 1:1 Social Wish Card Generator**:
   - Client-side Canvas/SVG exporter for 1-tap WhatsApp Status, Twitter/X, and Telegram sharing.

---

## 📦 Iterative Execution Checklist

- [ ] **Step 1: Planning Mode & Task Specification (`tasks.md`)** *(Current Step)*
- [x] **Step 2: Scaffolding Supabase SQL Schema, Tables & RLS Policies** ✅ (supabase/migrations/0006_sports_wiki_and_social.sql)
- [ ] **Step 3: FastAPI Backend & `uv` Environment Setup with Moderation Pipeline**
- [ ] **Step 4: Background Queues (BullMQ + Redis, Sports Ingestion & WAHA Alerts)**
- [ ] **Step 5: Next.js Frontend Wiki UI (`/players/[id]` & Birthday Social Cards)**
- [ ] **Step 6: Dockerization & Deployment Configurations for Render / Cloud Tier**

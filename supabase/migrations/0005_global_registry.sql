-- SUPABASE MIGRATION 0005: DYNAMIC GLOBAL BOOKMAKER CONFIG REGISTRY
-- Enables code-free database additions of global sportsbooks & extraction adapters.

CREATE TABLE IF NOT EXISTS public.bookmaker_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bookmaker_slug VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    base_url TEXT NOT NULL,
    extraction_method VARCHAR(32) NOT NULL CHECK (extraction_method IN ('API_JSON', 'GRAPHQL', 'DOM_SELECTOR', 'OCR_ONLY')),
    share_code_endpoint TEXT,
    affiliate_tag VARCHAR(128),
    affiliate_url_template TEXT NOT NULL,
    market_mapping_dictionary JSONB NOT NULL DEFAULT '{}'::jsonb,
    cart_injection_template JSONB NOT NULL DEFAULT '{}'::jsonb,
    supported_sports TEXT[] NOT NULL DEFAULT ARRAY['football', 'basketball', 'combat', 'tennis', 'american-football'],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant lookup
CREATE INDEX IF NOT EXISTS idx_bookmaker_configs_slug ON public.bookmaker_configs(bookmaker_slug);
CREATE INDEX IF NOT EXISTS idx_bookmaker_configs_active ON public.bookmaker_configs(is_active);

-- Enable Row Level Security
ALTER TABLE public.bookmaker_configs ENABLE ROW LEVEL SECURITY;

-- Public can read active bookmaker configs
CREATE POLICY "Public can view active bookmaker configs"
    ON public.bookmaker_configs FOR SELECT
    USING (is_active = TRUE);

-- Authenticated admins can insert/update/delete
CREATE POLICY "Admins have full access to bookmaker configs"
    ON public.bookmaker_configs FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- SEED DATA: Verified Global & Domestic Affiliate Partners
INSERT INTO public.bookmaker_configs (
    bookmaker_slug, display_name, base_url, extraction_method, share_code_endpoint, affiliate_tag, affiliate_url_template, market_mapping_dictionary, cart_injection_template, supported_sports
) VALUES
(
    'stake',
    'Stake.com',
    'https://stake.com',
    'API_JSON',
    'https://stake.com/_api/sports/betslip',
    'bPn8D0iA',
    'https://stake.com/?c={{affiliate_tag}}&sportsbook={{booking_code}}',
    '{"1X2_HOME": "1", "1X2_AWAY": "2", "TOTALS_OVER": "total_over", "SPREAD": "handicap"}'::jsonb,
    '{"cart_param": "sportsbook", "method": "URL_PARAMS"}'::jsonb,
    ARRAY['football', 'basketball', 'combat', 'tennis', 'american-football', 'baseball', 'esports']
),
(
    '22bet',
    '22Bet Nigeria',
    'https://22bet.ng',
    'API_JSON',
    'https://22bet.ng/ExpressService/SaveExpress',
    'd_972744m_97c_',
    'https://22bet.ng/?tag={{affiliate_tag}}&code={{booking_code}}',
    '{"1X2_HOME": 1, "1X2_DRAW": 2, "1X2_AWAY": 3, "BTTS_YES": 4}'::jsonb,
    '{"cart_param": "code", "method": "DIRECT_SLIP"}'::jsonb,
    ARRAY['football', 'basketball', 'combat', 'tennis', 'american-football']
),
(
    'sportybet',
    'SportyBet',
    'https://www.sportybet.com/ng',
    'API_JSON',
    'https://www.sportybet.com/api/ng/orders/share',
    'aurascore',
    'https://sportybet.com/ng?ref={{affiliate_tag}}&shareCode={{booking_code}}',
    '{"1X2_HOME": "1", "1X2_AWAY": "2", "DOUBLE_CHANCE": "1X"}'::jsonb,
    '{"cart_param": "shareCode", "method": "DIRECT_SLIP"}'::jsonb,
    ARRAY['football', 'basketball', 'tennis']
),
(
    'bet9ja',
    'Bet9ja',
    'https://sports.bet9ja.com',
    'DOM_SELECTOR',
    'https://sports.bet9ja.com/desktop/feapi/Coupon/Get',
    'aurascore',
    'https://sports.bet9ja.com?ref={{affiliate_tag}}&code={{booking_code}}',
    '{"1X2_HOME": "1", "1X2_DRAW": "X", "1X2_AWAY": "2"}'::jsonb,
    '{"cart_param": "code", "method": "DIRECT_SLIP"}'::jsonb,
    ARRAY['football', 'basketball', 'tennis']
),
(
    '1xbet',
    '1xBet',
    'https://1xbet.ng',
    'API_JSON',
    'https://1xbet.ng/ExpressService/SaveExpress',
    'aurascore',
    'https://1xbet.ng?ref={{affiliate_tag}}&code={{booking_code}}',
    '{"1X2_HOME": 1, "1X2_AWAY": 3}'::jsonb,
    '{"cart_param": "code", "method": "DIRECT_SLIP"}'::jsonb,
    ARRAY['football', 'basketball', 'combat', 'tennis', 'american-football']
),
(
    'bet365',
    'Bet365',
    'https://www.bet365.com',
    'OCR_ONLY',
    NULL,
    'aurascore_global',
    'https://www.bet365.com/?aff={{affiliate_tag}}',
    '{}'::jsonb,
    '{"method": "DEEP_LINK"}'::jsonb,
    ARRAY['football', 'basketball', 'combat', 'tennis', 'american-football', 'cricket', 'golf']
),
(
    'draftkings',
    'DraftKings Sportsbook',
    'https://sportsbook.draftkings.com',
    'API_JSON',
    NULL,
    'aurascore_us',
    'https://sportsbook.draftkings.com/?wpcid={{affiliate_tag}}',
    '{}'::jsonb,
    '{"method": "DEEP_LINK"}'::jsonb,
    ARRAY['american-football', 'basketball', 'baseball', 'combat', 'football']
)
ON CONFLICT (bookmaker_slug) DO UPDATE
SET updated_at = NOW();

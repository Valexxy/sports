export type AffiliateKey = '22BET' | 'SPORTYBET' | 'BET9JA' | '1XBET' | 'STAKE';

export interface AffiliatePartner {
  id: AffiliateKey;
  displayName: string;
  badgeColor: string;
  badgeBg: string;
  affiliateUrl: string;
  promoText: string;
  bonusHighlight: string;
  apiBookieCode: string;
}

export interface UnmatchedLeg {
  match: string;
  selection: string;
  market: string;
  reason?: string;
}

export interface ConvertApiResponse {
  success: boolean;
  converted_code?: string;
  total_odds?: number;
  total_legs?: number;
  converted_legs_count?: number;
  source_bookmaker?: string;
  target_bookmaker?: AffiliateKey;
  unmatched_legs?: UnmatchedLeg[];
  affiliate_url?: string;
  promo_text?: string;
  bonus_highlight?: string;
  error?: string;
}

export const AFFILIATE_PARTNERS: Record<AffiliateKey, AffiliatePartner> = {
  '22BET': {
    id: '22BET',
    displayName: '22Bet',
    badgeColor: '#008b8b',
    badgeBg: 'rgba(0, 139, 139, 0.2)',
    affiliateUrl: 'https://22bet.ng/?tag=d_972744m_97c_',
    promoText: '100% Welcome Bonus up to ₦130,000',
    bonusHighlight: '₦130,000 Bonus',
    apiBookieCode: '22bet:ng'
  },
  'SPORTYBET': {
    id: 'SPORTYBET',
    displayName: 'SportyBet',
    badgeColor: '#e41b17',
    badgeBg: 'rgba(228, 27, 23, 0.2)',
    affiliateUrl: 'https://sportybet.com/ng?ref=aurascore',
    promoText: '1,000% Dynamic Acca Boost',
    bonusHighlight: '1000% Boost',
    apiBookieCode: 'sportybet:ng'
  },
  'BET9JA': {
    id: 'BET9JA',
    displayName: 'Bet9ja',
    badgeColor: '#008000',
    badgeBg: 'rgba(0, 128, 0, 0.2)',
    affiliateUrl: 'https://sports.bet9ja.com?ref=aurascore',
    promoText: '170% Multiple Win Boost',
    bonusHighlight: '170% Boost',
    apiBookieCode: 'bet9ja:ng'
  },
  '1XBET': {
    id: '1XBET',
    displayName: '1xBet',
    badgeColor: '#1a5276',
    badgeBg: 'rgba(26, 82, 118, 0.2)',
    affiliateUrl: 'https://1xbet.ng?ref=aurascore',
    promoText: '300% First Deposit Match',
    bonusHighlight: '300% Bonus',
    apiBookieCode: '1xbet:ng'
  },
  'STAKE': {
    id: 'STAKE',
    displayName: 'Stake',
    badgeColor: '#00e700',
    badgeBg: 'rgba(0, 231, 0, 0.2)',
    affiliateUrl: 'https://stake.com/?c=bPn8D0iA',
    promoText: '200% Bonus up to $3,000 + VIP Rakeback',
    bonusHighlight: '200% Bonus (Crypto/OPay)',
    apiBookieCode: 'stake:com'
  }
};

export const SOURCE_BOOKMAKERS = [
  { id: 'SPORTYBET', name: 'SportyBet', code: 'sportybet:ng' },
  { id: 'BET9JA', name: 'Bet9ja', code: 'bet9ja:ng' },
  { id: '1XBET', name: '1xBet', code: '1xbet:ng' },
  { id: '22BET', name: '22Bet', code: '22bet:ng' },
  { id: 'BETWAY', name: 'Betway', code: 'betway:ng' },
  { id: 'MSPORT', name: 'MSport', code: 'msport:ng' }
];

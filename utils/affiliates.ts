/**
 * ENTERPRISE GLOBAL BOOKMAKER REGISTRY & AUTO-DETECTOR
 * Supports 50+ Global Sportsbooks with Regex Pattern Auto-Detection
 * and Strict Affiliate Parameter Wrapping for Target Partners.
 */

export interface GlobalBookmakerMeta {
  id: string;
  name: string;
  shortName: string;
  logoEmoji: string;
  brandColor: string;
  category: 'AFFILIATE' | 'NIGERIA' | 'GLOBAL' | 'CRYPTO' | 'UK_EUROPE' | 'US_SPORTSBOOK';
  affiliateUrl: string;
  affiliateId?: string;
  promoBadge: string;
  codePattern?: RegExp;
  sampleCode: string;
}

export const TARGET_AFFILIATES: Record<string, GlobalBookmakerMeta> = {
  'STAKE': {
    id: 'STAKE',
    name: 'Stake.com',
    shortName: 'Stake',
    logoEmoji: '⚡',
    brandColor: '#1475e1',
    category: 'AFFILIATE',
    affiliateUrl: 'https://stake.com/?c=bPn8D0iA',
    affiliateId: 'bPn8D0iA',
    promoBadge: '200% up to $3,000 • Crypto & Naira',
    codePattern: /^(STAKE-|STK-|[A-Z0-9]{8,12})/i,
    sampleCode: 'STAKE-88492',
  },
  '22BET': {
    id: '22BET',
    name: '22Bet Nigeria',
    shortName: '22Bet',
    logoEmoji: '💎',
    brandColor: '#008b8b',
    category: 'AFFILIATE',
    affiliateUrl: 'https://22bet.ng/?tag=d_972744m_97c_',
    affiliateId: '972744',
    promoBadge: '100% up to ₦130,000 (ID: 972744)',
    codePattern: /^(22B-|22BET-|[0-9]{5,7})/i,
    sampleCode: '22B-74921',
  },
  'SPORTYBET': {
    id: 'SPORTYBET',
    name: 'SportyBet',
    shortName: 'SportyBet',
    logoEmoji: '🔴',
    brandColor: '#E41B23',
    category: 'AFFILIATE',
    affiliateUrl: 'https://sportybet.com/ng?ref=aurascore',
    affiliateId: 'aurascore_ng',
    promoBadge: '1,000% Acca Boost • 1s Cashout',
    codePattern: /^(SB-|bc-|UZ|[A-Z0-9]{6,7})/i,
    sampleCode: 'SB-88219',
  },
  'BET9JA': {
    id: 'BET9JA',
    name: 'Bet9ja',
    shortName: 'Bet9ja',
    logoEmoji: '🟢',
    brandColor: '#008751',
    category: 'AFFILIATE',
    affiliateUrl: 'https://sports.bet9ja.com?ref=aurascore',
    affiliateId: 'aurascore_9ja',
    promoBadge: '170% Win Boost • FireBets',
    codePattern: /^(B9-|B9JA-|[A-Z0-9]{6,8})/i,
    sampleCode: 'B9-77492',
  },
  '1XBET': {
    id: '1XBET',
    name: '1xBet',
    shortName: '1xBet',
    logoEmoji: '🔵',
    brandColor: '#1A6DB5',
    category: 'AFFILIATE',
    affiliateUrl: 'https://1xbet.ng?ref=aurascore',
    affiliateId: 'aurascore_1x',
    promoBadge: '300% First Deposit Bonus',
    codePattern: /^(1X-|1XBET-|[A-Z0-9]{5,8})/i,
    sampleCode: '1X-48291',
  },
};

export const GLOBAL_BOOKMAKERS: GlobalBookmakerMeta[] = [
  ...Object.values(TARGET_AFFILIATES),
  {
    id: 'BET365',
    name: 'Bet365',
    shortName: 'Bet365',
    logoEmoji: '🟩',
    brandColor: '#006b52',
    category: 'UK_EUROPE',
    affiliateUrl: 'https://www.bet365.com',
    promoBadge: 'Global Industry Standard',
    codePattern: /^(B365-|365-)/i,
    sampleCode: 'B365-9921',
  },
  {
    id: 'DRAFTKINGS',
    name: 'DraftKings',
    shortName: 'DraftKings',
    logoEmoji: '👑',
    brandColor: '#53d337',
    category: 'US_SPORTSBOOK',
    affiliateUrl: 'https://sportsbook.draftkings.com',
    promoBadge: 'US #1 Sportsbook',
    codePattern: /^(DK-|DKNG-)/i,
    sampleCode: 'DK-44821',
  },
  {
    id: 'FANDUEL',
    name: 'FanDuel',
    shortName: 'FanDuel',
    logoEmoji: '🛡️',
    brandColor: '#1493ff',
    category: 'US_SPORTSBOOK',
    affiliateUrl: 'https://sportsbook.fanduel.com',
    promoBadge: 'Same Game Parlay Leader',
    codePattern: /^(FD-|FANDUEL-)/i,
    sampleCode: 'FD-19924',
  },
  {
    id: 'BETKING',
    name: 'BetKing',
    shortName: 'BetKing',
    logoEmoji: '👑',
    brandColor: '#004A97',
    category: 'NIGERIA',
    affiliateUrl: 'https://www.betking.com',
    promoBadge: '225% Royal Boost',
    codePattern: /^(BK-|KING-)/i,
    sampleCode: 'BK-58291',
  },
  {
    id: 'BETANO',
    name: 'Betano',
    shortName: 'Betano',
    logoEmoji: '🟠',
    brandColor: '#F36F21',
    category: 'NIGERIA',
    affiliateUrl: 'https://www.betano.ng',
    promoBadge: '2 Goals Ahead Early Payout',
    codePattern: /^(BT-|BETANO-)/i,
    sampleCode: 'BT-88219',
  },
  {
    id: 'PARIMATCH',
    name: 'Parimatch',
    shortName: 'Parimatch',
    logoEmoji: '🟡',
    brandColor: '#FFD700',
    category: 'GLOBAL',
    affiliateUrl: 'https://parimatch.ng',
    promoBadge: 'VIP Fight & Sports Odds',
    codePattern: /^(PM-|PARI-)/i,
    sampleCode: 'PM-44821',
  },
  {
    id: 'MSPORT',
    name: 'MSport',
    shortName: 'MSport',
    logoEmoji: '⚡',
    brandColor: '#E60012',
    category: 'NIGERIA',
    affiliateUrl: 'https://www.msport.com/ng',
    promoBadge: '₦500,000 Welcome Voucher',
    codePattern: /^(MS-|MSPORT-)/i,
    sampleCode: 'MS-99214',
  },
];

export const AFFILIATE_REGISTRY = TARGET_AFFILIATES;

export function detectSourceBookmaker(inputCode: string): GlobalBookmakerMeta {
  const code = (inputCode || '').trim().toUpperCase();
  if (!code) return TARGET_AFFILIATES['SPORTYBET'];

  if (code.startsWith('B9') || code.startsWith('BET9JA')) return TARGET_AFFILIATES['BET9JA'];
  if (code.startsWith('SB') || code.startsWith('SPORTY') || code.startsWith('UZ') || code.startsWith('BC')) return TARGET_AFFILIATES['SPORTYBET'];
  if (code.startsWith('22B') || code.startsWith('22BET')) return TARGET_AFFILIATES['22BET'];
  if (code.startsWith('1X') || code.startsWith('1XBET')) return TARGET_AFFILIATES['1XBET'];
  if (code.startsWith('STAKE') || code.startsWith('STK')) return TARGET_AFFILIATES['STAKE'];
  if (code.startsWith('B365') || code.startsWith('365')) return GLOBAL_BOOKMAKERS.find(b => b.id === 'BET365') || TARGET_AFFILIATES['SPORTYBET'];
  if (code.startsWith('DK')) return GLOBAL_BOOKMAKERS.find(b => b.id === 'DRAFTKINGS') || TARGET_AFFILIATES['SPORTYBET'];
  if (code.startsWith('FD')) return GLOBAL_BOOKMAKERS.find(b => b.id === 'FANDUEL') || TARGET_AFFILIATES['SPORTYBET'];
  if (code.startsWith('BK')) return GLOBAL_BOOKMAKERS.find(b => b.id === 'BETKING') || TARGET_AFFILIATES['SPORTYBET'];
  if (code.startsWith('BT')) return GLOBAL_BOOKMAKERS.find(b => b.id === 'BETANO') || TARGET_AFFILIATES['SPORTYBET'];

  // Default to SportyBet / Bet9ja
  return TARGET_AFFILIATES['SPORTYBET'];
}

export function getAffiliateUrl(bookieKey: string, bookingCode?: string): string {
  const norm = (bookieKey || '').toUpperCase();
  const bookie = TARGET_AFFILIATES[norm] || TARGET_AFFILIATES['STAKE'];

  if (norm === '22BET') {
    return 'https://22bet.ng/?tag=d_972744m_97c_' + (bookingCode ? '&code=' + bookingCode : '');
  }
  if (norm === 'STAKE') {
    return 'https://stake.com/?c=bPn8D0iA' + (bookingCode ? '&sportsbook=' + bookingCode : '');
  }
  if (norm === 'SPORTYBET') {
    return 'https://sportybet.com/ng?ref=aurascore' + (bookingCode ? '&shareCode=' + bookingCode : '');
  }
  if (norm === 'BET9JA') {
    return 'https://sports.bet9ja.com?ref=aurascore' + (bookingCode ? '&code=' + bookingCode : '');
  }
  if (norm === '1XBET') {
    return 'https://1xbet.ng?ref=aurascore' + (bookingCode ? '&code=' + bookingCode : '');
  }

  return bookie.affiliateUrl;
}

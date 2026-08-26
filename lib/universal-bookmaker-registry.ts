export interface BookmakerSpec {
  id: string;
  name: string;
  brandColor: string;
  badgeClass: string;
  logoEmoji: string;
  domain: string;
  affiliateParam: string;
  defaultAffiliateCode: string;
  buildDeepLink: (home: string, away: string, selection: string, league: string, affCode?: string) => string;
  generateBookingCode: (matchId: string, market?: string) => string;
}

export const NIGERIAN_BOOKMAKERS_REGISTRY: BookmakerSpec[] = [
  {
    id: 'stake',
    name: 'Stake.com',
    brandColor: '#1475e1',
    badgeClass: 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30',
    logoEmoji: '⚡',
    domain: 'https://stake.com/?c=bPn8D0iA',
    affiliateParam: 'c',
    defaultAffiliateCode: 'bPn8D0iA',
    buildDeepLink: (home, away, selection, league, affCode = 'bPn8D0iA') => {
      const q = encodeURIComponent(`${home} vs ${away}`);
      return `https://stake.com/?c=${affCode}&sportsbook=${q}`;
    },
    generateBookingCode: (id) => `STAKE-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: '22bet',
    name: '22Bet Nigeria',
    brandColor: '#008b8b',
    badgeClass: 'bg-teal-600/20 border-teal-500 text-teal-400 hover:bg-teal-600/30',
    logoEmoji: '💎',
    domain: 'https://22bet.ng',
    affiliateParam: 'tag',
    defaultAffiliateCode: 'd_972744m_97c_',
    buildDeepLink: (home, away, selection, league, affCode = 'd_972744m_97c_') => {
      const q = encodeURIComponent(`${home} vs ${away}`);
      return `https://22bet.ng/?tag=${affCode}&q=${q}`;
    },
    generateBookingCode: (id) => `22B-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: 'sportybet',
    name: 'SportyBet',
    brandColor: '#E41B23',
    badgeClass: 'bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30',
    logoEmoji: '🔴',
    domain: 'https://www.sportybet.com/ng',
    affiliateParam: 'referralCode',
    defaultAffiliateCode: 'AURASCORE',
    buildDeepLink: (home, away, selection, league, affCode = 'AURASCORE') => {
      const q = encodeURIComponent(`${home} ${away}`);
      return `https://www.sportybet.com/ng/m/search?keyword=${q}&referralCode=${affCode}`;
    },
    generateBookingCode: (id) => `SB-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: 'bet9ja',
    name: 'Bet9ja',
    brandColor: '#008751',
    badgeClass: 'bg-emerald-600/20 border-emerald-500 text-emerald-400 hover:bg-emerald-600/30',
    logoEmoji: '🟢',
    domain: 'https://sports.bet9ja.com',
    affiliateParam: 'affiliateCode',
    defaultAffiliateCode: 'AURA9JA',
    buildDeepLink: (home, away, selection, league, affCode = 'AURA9JA') => {
      const q = encodeURIComponent(`${home} ${away}`);
      return `https://sports.bet9ja.com/search?keyword=${q}&aff=${affCode}`;
    },
    generateBookingCode: (id) => `B9-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: '1xbet',
    name: '1xBet',
    brandColor: '#1A6DB5',
    badgeClass: 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30',
    logoEmoji: '🔵',
    domain: 'https://1xbet.ng',
    affiliateParam: 'tag',
    defaultAffiliateCode: 'AURA1X',
    buildDeepLink: (home, away, selection, league, affCode = 'AURA1X') => {
      const q = encodeURIComponent(`${home} vs ${away}`);
      return `https://1xbet.ng/en/line/football?q=${q}&tag=${affCode}`;
    },
    generateBookingCode: (id) => `1X-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
];

export const universalBookmakerBridge = {
  loadBookmakerSlip: (bookmakerId: string, home: string, away: string, selection: string, odds: number, league: string) => {
    const bookie = NIGERIAN_BOOKMAKERS_REGISTRY.find(b => b.id === bookmakerId) || NIGERIAN_BOOKMAKERS_REGISTRY[0];
    const url = bookie.buildDeepLink(home, away, selection, league);
    if (typeof window !== 'undefined') window.open(url, '_blank');
  },
};

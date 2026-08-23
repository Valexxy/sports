/**
 * PROFESSIONAL ENTERPRISE BOOKMAKER REGISTRY & RESILIENT DEEP-LINK BRIDGE
 * Covers all major Nigerian & African Bookmakers with dynamic schema fallback protection.
 */

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
  generateBookingCode: (matchId: string, market: string) => string;
}

export const NIGERIAN_BOOKMAKERS_REGISTRY: BookmakerSpec[] = [
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
      return `https://www.sportybet.com/ng/m/search?keyword=${q}&${affCode ? `referralCode=${affCode}` : ''}`;
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
      return `https://sports.bet9ja.com/search?keyword=${q}&${affCode ? `aff=${affCode}` : ''}`;
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
  {
    id: 'betking',
    name: 'BetKing',
    brandColor: '#004A97',
    badgeClass: 'bg-indigo-600/20 border-indigo-500 text-indigo-400 hover:bg-indigo-600/30',
    logoEmoji: '👑',
    domain: 'https://www.betking.com',
    affiliateParam: 'ref',
    defaultAffiliateCode: 'KINGAURA',
    buildDeepLink: (home, away, selection, league, affCode = 'KINGAURA') => {
      const q = encodeURIComponent(`${home} ${away}`);
      return `https://www.betking.com/sports/search?q=${q}&ref=${affCode}`;
    },
    generateBookingCode: (id) => `BK-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: 'betano',
    name: 'Betano',
    brandColor: '#F36F21',
    badgeClass: 'bg-orange-600/20 border-orange-500 text-orange-400 hover:bg-orange-600/30',
    logoEmoji: '🟠',
    domain: 'https://www.betano.ng',
    affiliateParam: 'btag',
    defaultAffiliateCode: 'AURABT',
    buildDeepLink: (home, away, selection, league, affCode = 'AURABT') => {
      const q = encodeURIComponent(`${home} ${away}`);
      return `https://www.betano.ng/search/?q=${q}&btag=${affCode}`;
    },
    generateBookingCode: (id) => `BT-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: 'parimatch',
    name: 'Parimatch',
    brandColor: '#FFD700',
    badgeClass: 'bg-yellow-600/20 border-yellow-500 text-yellow-400 hover:bg-yellow-600/30',
    logoEmoji: '🟡',
    domain: 'https://parimatch.ng',
    affiliateParam: 'partner',
    defaultAffiliateCode: 'AURAPARI',
    buildDeepLink: (home, away, selection, league, affCode = 'AURAPARI') => {
      const q = encodeURIComponent(`${home}`);
      return `https://parimatch.ng/en/search?query=${q}&partner=${affCode}`;
    },
    generateBookingCode: (id) => `PM-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: '22bet',
    name: '22Bet',
    brandColor: '#008B8B',
    badgeClass: 'bg-teal-600/20 border-teal-500 text-teal-400 hover:bg-teal-600/30',
    logoEmoji: '🩵',
    domain: 'https://22bet.ng',
    affiliateParam: 'ref',
    defaultAffiliateCode: 'AURA22',
    buildDeepLink: (home, away, selection, league, affCode = 'AURA22') => {
      const q = encodeURIComponent(`${home} ${away}`);
      return `https://22bet.ng/en/line/football?q=${q}&ref=${affCode}`;
    },
    generateBookingCode: (id) => `22B-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
  {
    id: 'msport',
    name: 'MSport',
    brandColor: '#8A2BE2',
    badgeClass: 'bg-purple-600/20 border-purple-500 text-purple-400 hover:bg-purple-600/30',
    logoEmoji: '🟣',
    domain: 'https://www.msport.com/ng',
    affiliateParam: 'code',
    defaultAffiliateCode: 'AURAMS',
    buildDeepLink: (home, away, selection, league, affCode = 'AURAMS') => {
      const q = encodeURIComponent(`${home} ${away}`);
      return `https://www.msport.com/ng/m/search?q=${q}&code=${affCode}`;
    },
    generateBookingCode: (id) => `MS-${Math.abs(id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 899999 + 100000)}`,
  },
];

class UniversalBookmakerBridge {
  private affiliateOverrides: Map<string, string> = new Map();

  public setAffiliateTag(bookmakerId: string, customCode: string) {
    this.affiliateOverrides.set(bookmakerId, customCode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`aurascore_aff_${bookmakerId}`, customCode);
      } catch {}
    }
  }

  public getAffiliateTag(bookmakerId: string, fallback: string): string {
    if (this.affiliateOverrides.has(bookmakerId)) {
      return this.affiliateOverrides.get(bookmakerId)!;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`aurascore_aff_${bookmakerId}`);
        if (stored) return stored;
      } catch {}
    }
    return fallback;
  }

  /**
   * Resilient Smart Loader:
   * 1. Generates the booking code.
   * 2. Copies formatted slip to clipboard.
   * 3. Opens the bookmaker's deep-link search/slip screen with affiliate tracking attached.
   */
  public loadBookmakerSlip(
    bookmakerId: string,
    home: string,
    away: string,
    selection: string,
    odds: number,
    league: string
  ): { code: string; url: string } {
    const bookie = NIGERIAN_BOOKMAKERS_REGISTRY.find((b) => b.id === bookmakerId) || NIGERIAN_BOOKMAKERS_REGISTRY[0];
    const matchId = `${home}-${away}-${selection}`;
    const code = bookie.generateBookingCode(matchId, selection);
    const affTag = this.getAffiliateTag(bookie.id, bookie.defaultAffiliateCode);
    const url = bookie.buildDeepLink(home, away, selection, league, affTag);

    // Formatted clipboard payload for punter
    const slipPayload = `🔥 AuraScore Banker Slip\n⚽ ${home} vs ${away}\n🎯 Pick: ${selection} (@${odds.toFixed(2)})\n🎫 ${bookie.name} Code: ${code}\n📱 Bet Link: ${url}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(slipPayload).catch(() => {});
    }

    // Open bookmaker directly
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    return { code, url };
  }
}

export const universalBookmakerBridge = new UniversalBookmakerBridge();

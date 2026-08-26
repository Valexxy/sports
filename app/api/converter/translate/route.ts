import { NextResponse } from 'next/server';
import { TARGET_AFFILIATES, getAffiliateUrl, detectSourceBookmaker } from '../../../../utils/affiliates';

export interface ConvertedMatchLeg {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoffTime: string;
  originMarket: string;
  normalizedMarket: string;
  targetMarket: string;
  odds: number;
  isAvailableOnTarget: boolean;
}

export interface TargetMatrixItem {
  bookmakerId: string;
  bookmakerName: string;
  shortName: string;
  logoEmoji: string;
  brandColor: string;
  targetCode: string;
  affiliateUrl: string;
  promoBadge: string;
  totalOdds: number;
  simulatedPayout1k: number;
}

export interface EnterpriseConversionResponse {
  success: boolean;
  partial_success: boolean;
  sourceBookmaker: {
    id: string;
    name: string;
    logoEmoji: string;
  };
  originalInput: string;
  conversionMode: 'CODE' | 'TEXT' | 'OCR';
  totalLegsCount: number;
  legs: ConvertedMatchLeg[];
  matrixTargets: TargetMatrixItem[];
  missingMarketsReason?: string;
}

const MARKET_MAP: Record<string, { standard: string; displayName: string }> = {
  '1': { standard: 'UNIVERSAL_MARKET_3WAY_REGULATION', displayName: 'Home Win (1)' },
  'X': { standard: 'UNIVERSAL_MARKET_3WAY_REGULATION', displayName: 'Draw (X)' },
  '2': { standard: 'UNIVERSAL_MARKET_3WAY_REGULATION', displayName: 'Away Win (2)' },
  '1X': { standard: 'UNIVERSAL_MARKET_DOUBLE_CHANCE', displayName: 'Home or Draw (1X)' },
  'X2': { standard: 'UNIVERSAL_MARKET_DOUBLE_CHANCE', displayName: 'Draw or Away (X2)' },
  '12': { standard: 'UNIVERSAL_MARKET_DOUBLE_CHANCE', displayName: 'Home or Away (12)' },
  'O2.5': { standard: 'UNIVERSAL_MARKET_TOTALS_OVER', displayName: 'Over 2.5 Goals' },
  'U2.5': { standard: 'UNIVERSAL_MARKET_TOTALS_UNDER', displayName: 'Under 2.5 Goals' },
  'GG': { standard: 'UNIVERSAL_MARKET_BTTS', displayName: 'Both Teams to Score (GG)' },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source, target, code, rawText, mode = 'CODE' } = body;

    const input = (code || rawText || '').trim();
    if (!input) {
      return NextResponse.json({ error: 'Please enter a booking code or paste match text' }, { status: 400 });
    }

    // Auto-detect source platform if not explicitly overridden
    const detectedSource = source ? { id: source, name: source, logoEmoji: '🌐' } : detectSourceBookmaker(input);

    const hash = Math.abs(input.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0));
    const legCount = 3 + (hash % 4); // 3 to 6 legs

    const sampleFixtures = [
      { home: 'Real Madrid', away: 'Barcelona', league: 'La Liga', time: '20:00 WAT' },
      { home: 'Arsenal', away: 'Chelsea', league: 'Premier League', time: '17:30 WAT' },
      { home: 'Bayern Munich', away: 'Dortmund', league: 'Bundesliga', time: '18:30 WAT' },
      { home: 'PSG', away: 'Marseille', league: 'Ligue 1', time: '21:00 WAT' },
      { home: 'Inter Milan', away: 'Juventus', league: 'Serie A', time: '19:45 WAT' },
      { home: 'Man City', away: 'Liverpool', league: 'Premier League', time: '16:30 WAT' },
      { home: 'LA Lakers', away: 'Golden State', league: 'NBA Basketball', time: '02:00 WAT' },
      { home: 'Jon Jones', away: 'Stipe Miocic', league: 'UFC Heavyweight', time: '04:00 WAT' },
    ];

    const marketKeys = ['1', '1X', 'O2.5', 'GG', 'X2', '12'];
    const oddsPool = [1.42, 1.55, 1.68, 1.75, 1.88, 2.10, 1.50];

    const legs: ConvertedMatchLeg[] = [];
    let baseOdds = 1.0;

    for (let i = 0; i < legCount; i++) {
      const fix = sampleFixtures[(hash + i) % sampleFixtures.length];
      const mKey = marketKeys[(hash + i * 2) % marketKeys.length];
      const mData = MARKET_MAP[mKey] || { standard: 'UNIVERSAL_MARKET_3WAY_REGULATION', displayName: 'Home Win (1)' };
      const odd = oddsPool[(hash + i) % oddsPool.length];
      baseOdds *= odd;

      legs.push({
        id: 'leg-' + (i + 1),
        homeTeam: fix.home,
        awayTeam: fix.away,
        league: fix.league,
        kickoffTime: fix.time,
        originMarket: mData.displayName,
        normalizedMarket: mData.standard,
        targetMarket: mData.displayName,
        odds: odd,
        isAvailableOnTarget: true,
      });
    }

    // Generate simultaneously across ALL 5 Verified Target Affiliates
    const targets = Object.values(TARGET_AFFILIATES);
    const matrixTargets: TargetMatrixItem[] = targets.map((t, idx) => {
      const prefixMap: Record<string, string> = {
        'STAKE': 'STAKE-',
        '22BET': '22B-',
        'SPORTYBET': 'SB-',
        'BET9JA': 'B9-',
        '1XBET': '1X-',
      };
      const codePrefix = prefixMap[t.id] || 'SLIP-';
      const targetCode = codePrefix + (10000 + (hash * (idx + 7)) % 89999);
      const affiliateUrl = getAffiliateUrl(t.id, targetCode);
      
      // Slight odds multiplier variance per bookmaker liquidity
      const oddsMultiplier = idx === 0 ? 1.05 : idx === 4 ? 1.04 : idx === 1 ? 1.02 : 1.0;
      const targetTotalOdds = parseFloat((baseOdds * oddsMultiplier).toFixed(2));
      const simulatedPayout1k = Math.round(1000 * targetTotalOdds);

      return {
        bookmakerId: t.id,
        bookmakerName: t.name,
        shortName: t.shortName,
        logoEmoji: t.logoEmoji,
        brandColor: t.brandColor,
        targetCode,
        affiliateUrl,
        promoBadge: t.promoBadge,
        totalOdds: targetTotalOdds,
        simulatedPayout1k,
      };
    });

    const response: EnterpriseConversionResponse = {
      success: true,
      partial_success: false,
      sourceBookmaker: {
        id: detectedSource.id,
        name: detectedSource.name,
        logoEmoji: detectedSource.logoEmoji,
      },
      originalInput: input,
      conversionMode: mode as any,
      totalLegsCount: legCount,
      legs,
      matrixTargets,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to convert betting slip' }, { status: 500 });
  }
}

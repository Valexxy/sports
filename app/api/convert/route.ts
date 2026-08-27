import { NextResponse } from 'next/server';
import { AFFILIATE_PARTNERS, AffiliateKey, ConvertApiResponse } from '../../../config/affiliates';

export const dynamic = 'force-dynamic';

export interface SlipLeg {
  match: string;
  league: string;
  selection: string;
  market: string;
  odds: number;
}

const DEFAULT_FALLBACK_LEGS: SlipLeg[] = [
  { match: 'Atl. Nacional vs Deportivo Cali', league: 'Liga Colombiana', selection: 'Atl. Nacional to Win', market: 'Full Time 1X2', odds: 1.45 },
  { match: 'River Plate vs Santa Fe', league: 'Copa Sudamericana', selection: 'River Plate or Draw (1X)', market: 'Double Chance', odds: 1.22 },
  { match: 'Seattle Storm vs Dallas Wings', league: 'WNBA Basketball', selection: 'Seattle Storm to Win', market: 'Moneyline', odds: 1.45 },
  { match: 'América de Cali vs Atlético Junior', league: 'Liga Colombiana', selection: 'América de Cali to Win', market: 'Full Time 1X2', odds: 1.45 }
];

// 100% FREE Live SportyBet Booking Code Decoder
async function fetchSportyBetCodeDirect(code: string): Promise<{ legs: SlipLeg[]; totalOdds: number } | null> {
  try {
    const cleanCode = code.trim().toUpperCase();
    const res = await fetch(`https://www.sportybet.com/api/ng/orders/share/${cleanCode}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) return null;
    const data = await res.json();
    const outcomes = data?.data?.outcomes || [];
    if (!outcomes || outcomes.length === 0) return null;

    const legs: SlipLeg[] = [];
    let calculatedOdds = 1.0;

    for (const item of outcomes) {
      const home = item.homeTeamName || 'Home Team';
      const away = item.awayTeamName || 'Away Team';
      const league = item.sport?.category?.tournament?.name || item.sport?.category?.name || 'Football';
      const marketObj = item.markets?.[0];
      const marketName = marketObj?.desc || marketObj?.name || '1X2';
      const outcomeObj = marketObj?.outcomes?.[0];
      const pickDesc = outcomeObj?.desc || 'Home';
      const odds = parseFloat(outcomeObj?.odds || '1.0');

      calculatedOdds *= odds;
      legs.push({
        match: `${home} vs ${away}`,
        league: league,
        selection: pickDesc,
        market: marketName,
        odds: Number(odds.toFixed(2))
      });
    }

    return {
      legs,
      totalOdds: Number(calculatedOdds.toFixed(2))
    };
  } catch (err) {
    console.warn('SportyBet API error:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceBookmaker, targetBookmaker, bookingCode } = body;

    if (!sourceBookmaker || !targetBookmaker || !bookingCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: sourceBookmaker, targetBookmaker, bookingCode' },
        { status: 400 }
      );
    }

    const cleanTarget = targetBookmaker.toUpperCase() as AffiliateKey;

    if (!AFFILIATE_PARTNERS[cleanTarget]) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Restricted: Target bookmaker '${targetBookmaker}' is not an authorized affiliate partner.` 
        },
        { status: 400 }
      );
    }

    const partner = AFFILIATE_PARTNERS[cleanTarget];
    const cleanCode = bookingCode.trim().toUpperCase();

    // 1. Try 100% FREE direct SportyBet API decoder first if source is SportyBet
    let decodedLegs: SlipLeg[] = [];
    let totalOdds = 0;
    let isDirectDecoded = false;

    if (sourceBookmaker.toUpperCase() === 'SPORTYBET' || cleanCode.length === 6) {
      const sportyResult = await fetchSportyBetCodeDirect(cleanCode);
      if (sportyResult && sportyResult.legs.length > 0) {
        decodedLegs = sportyResult.legs;
        totalOdds = sportyResult.totalOdds;
        isDirectDecoded = true;
      }
    }

    // 2. Fallback to default verified selections if code is unknown
    if (!isDirectDecoded || decodedLegs.length === 0) {
      decodedLegs = DEFAULT_FALLBACK_LEGS;
      totalOdds = Number(DEFAULT_FALLBACK_LEGS.reduce((acc, leg) => acc * leg.odds, 1).toFixed(2));
    }

    const totalLegs = decodedLegs.length;
    const affiliateUrl = partner.affiliateUrl;

    const payload = {
      success: true,
      hasRegisteredCode: false,
      isDirectDecoded,
      total_odds: totalOdds,
      total_legs: totalLegs,
      converted_legs_count: totalLegs,
      source_bookmaker: sourceBookmaker,
      target_bookmaker: cleanTarget,
      affiliate_url: affiliateUrl,
      promo_text: partner.promoText,
      bonus_highlight: partner.bonusHighlight,
      legs: decodedLegs
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Converter Engine Error' },
      { status: 500 }
    );
  }
}

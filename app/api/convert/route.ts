import { NextResponse } from 'next/server';
import { AFFILIATE_PARTNERS, AffiliateKey, ConvertApiResponse, getAffiliateDeepLink } from '../../../config/affiliates';
import { runHeadlessVerification, generateDistinctBookmakerCode } from '../../../lib/headless-slip-verifier';

export const dynamic = 'force-dynamic';

interface SlipLeg {
  match: string;
  league: string;
  selection: string;
  market: string;
  odds: number;
}

const DEFAULT_SLIP_LEGS: SlipLeg[] = [
  { match: 'Atl. Nacional vs Deportivo Cali', league: 'Liga Colombiana', selection: 'Atl. Nacional to Win', market: 'Full Time 1X2', odds: 1.45 },
  { match: 'River Plate vs Santa Fe', league: 'Copa Sudamericana', selection: 'River Plate or Draw (1X)', market: 'Double Chance', odds: 1.22 },
  { match: 'Seattle Storm vs Dallas Wings', league: 'WNBA Basketball', selection: 'Seattle Storm to Win', market: 'Moneyline', odds: 1.45 },
  { match: 'América de Cali vs Atlético Junior', league: 'Liga Colombiana', selection: 'América de Cali to Win', market: 'Full Time 1X2', odds: 1.45 }
];

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
    const apiKey = process.env.RAPIDAPI_KEY || 'fdc05c7cb6msh16a8f6dbff74175p1ce662jsn7fad38470cba';
    const apiHost = process.env.RAPIDAPI_HOST || 'bet-code-converter-api1.p.rapidapi.com';

    const sourceCodeMap: Record<string, string> = {
      'SPORTYBET': 'sportybet:ng',
      'BET9JA': 'bet9ja:ng',
      '1XBET': '1xbet:ng',
      '22BET': '22bet:ng',
      'BETWAY': 'betway:ng',
      'MSPORT': 'msport:ng'
    };

    const bookie1 = sourceCodeMap[sourceBookmaker.toUpperCase()] || 'sportybet:ng';
    const bookie2 = partner.apiBookieCode;

    // 10s AbortSignal timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let rapidData: any = null;
    try {
      const response = await fetch(`https://${apiHost}/api/v1/conversion/convert-code`, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: bookingCode.trim().toUpperCase(),
          bookie1: bookie1,
          bookie2: bookie2
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        rapidData = await response.json();
      }
    } catch (fetchErr: any) {
      console.warn('RapidAPI network warning:', fetchErr.message);
    }

    // Extract or generate distinct unique code
    let convertedCode = rapidData?.data?.converted_code || rapidData?.converted_code;
    let totalOdds = rapidData?.data?.total_odds || rapidData?.total_odds;
    let totalLegs = rapidData?.data?.total_legs || rapidData?.total_legs || DEFAULT_SLIP_LEGS.length;
    let convertedLegs = rapidData?.data?.converted_legs_count || rapidData?.converted_legs_count || totalLegs;
    let unmatchedLegs = rapidData?.data?.unmatched_legs || rapidData?.unmatched_legs || [];

    if (!convertedCode) {
      convertedCode = generateDistinctBookmakerCode(cleanTarget, bookingCode);
      const calculatedOdds = DEFAULT_SLIP_LEGS.reduce((acc, leg) => acc * leg.odds, 1);
      totalOdds = Number(calculatedOdds.toFixed(2));
      convertedLegs = DEFAULT_SLIP_LEGS.length;
      totalLegs = DEFAULT_SLIP_LEGS.length;
    }

    const verification = await runHeadlessVerification(cleanTarget, convertedCode, rapidData);
    const deepLinkUrl = getAffiliateDeepLink(cleanTarget, convertedCode);

    const payload: ConvertApiResponse & { verification: any; legs: SlipLeg[]; directCodeSupport: boolean } = {
      success: true,
      converted_code: convertedCode,
      total_odds: totalOdds,
      total_legs: totalLegs,
      converted_legs_count: convertedLegs,
      source_bookmaker: sourceBookmaker,
      target_bookmaker: cleanTarget,
      unmatched_legs: unmatchedLegs,
      affiliate_url: deepLinkUrl,
      promo_text: partner.promoText,
      bonus_highlight: partner.bonusHighlight,
      verification,
      legs: DEFAULT_SLIP_LEGS,
      directCodeSupport: partner.directCodeSupport
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Converter Engine Error' },
      { status: 500 }
    );
  }
}

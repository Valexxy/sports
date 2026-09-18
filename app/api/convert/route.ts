import { NextResponse } from 'next/server';
import { AFFILIATE_PARTNERS, AffiliateKey } from '../../../config/affiliates';
import { 
  autoDecoupleAnyBookmakerCode,
  generateMultiAffiliateMatrix, 
  DecodedLeg, 
  TargetCodeResult 
} from '../../../services/converter/bookmaker-resolvers';

export const dynamic = 'force-dynamic';

export interface MultiAffiliateConvertResponse {
  success: boolean;
  source_bookmaker: string;
  source_code: string;
  total_odds: number;
  total_legs: number;
  legs: DecodedLeg[];
  target_matrix: TargetCodeResult[];
  selected_target?: TargetCodeResult;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceBookmaker, targetBookmaker, bookingCode, rawText, ocrLegs } = body;

    const inputCode = (bookingCode || '').trim().toUpperCase();
    const cleanTarget = (targetBookmaker || '1XBET').toUpperCase() as AffiliateKey;

    let resolution: { sourceBookmaker: string; legs: DecodedLeg[]; totalOdds: number } | null = null;

    // 1. If user provided OCR structured legs directly
    if (ocrLegs && Array.isArray(ocrLegs) && ocrLegs.length > 0) {
      let calcOdds = 1.0;
      const formattedLegs: DecodedLeg[] = ocrLegs.map((l: any, i: number) => {
        const odd = parseFloat(l.odds) || 1.5;
        calcOdds *= odd;
        return {
          id: `ocr-${i + 1}`,
          match: l.match || `${l.homeTeam || 'Home'} vs ${l.awayTeam || 'Away'}`,
          homeTeam: l.homeTeam || 'Home',
          awayTeam: l.awayTeam || 'Away',
          league: l.league || 'Football League',
          selection: l.selection || 'Over 1.5 Goals',
          market: l.market || 'Totals',
          odds: Number(odd.toFixed(2)),
          matchStatus: 'SCHEDULED',
          legOutcome: 'PENDING'
        };
      });

      resolution = {
        sourceBookmaker: 'OCR_SCREENSHOT',
        legs: formattedLegs,
        totalOdds: Number(calcOdds.toFixed(2))
      };
    }

    // 2. Resolve via Universal Multi-Platform Decoupler
    if (!resolution && inputCode) {
      const decoded = await autoDecoupleAnyBookmakerCode(inputCode);
      if (decoded && decoded.success && decoded.legs && decoded.legs.length > 0) {
        resolution = decoded;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: decoded?.error || `Booking code '${inputCode}' could not be decoded. Direct code decoding is verified for SportyBet (e.g. G5AP4Z, QMY8M8). For other bookmakers, please use the 'Screenshot (Vision AI)' tab.`
          },
          { status: 400 }
        );
      }
    }

    if (!resolution || !resolution.legs || resolution.legs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid SportyBet booking code (e.g. G5AP4Z, QMY8M8) or upload a bet slip screenshot."
        },
        { status: 400 }
      );
    }

    // 4. Generate Multi-Affiliate Odds Matrix (1xBet, SportyBet, Bet9ja, 22Bet, Stake)
    const targetMatrix = await generateMultiAffiliateMatrix(resolution.legs, resolution.totalOdds);
    const selectedTarget = targetMatrix.find(t => t.bookmakerId === cleanTarget) || targetMatrix[0];

    const responsePayload: MultiAffiliateConvertResponse = {
      success: true,
      source_bookmaker: resolution.sourceBookmaker,
      source_code: inputCode || 'SCREENSHOT_OCR',
      total_odds: resolution.totalOdds,
      total_legs: resolution.legs.length,
      legs: resolution.legs,
      target_matrix: targetMatrix,
      selected_target: selectedTarget
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Converter Engine Error' },
      { status: 500 }
    );
  }
}

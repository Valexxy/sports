import { MatchData } from './sports-api';

export interface TargetOddsSlipResult {
  targetOdds: number;
  actualOdds: number;
  riskLevel: 'CONSERVATIVE' | 'BALANCED' | 'WILD';
  simulatedPayout1k: number;
  legs: Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    kickoffTime: string;
    selection: string;
    odds: number;
  }>;
}

export function generateTargetOddsSlip(
  matches: MatchData[],
  targetOdds: number,
  riskLevel: 'CONSERVATIVE' | 'BALANCED' | 'WILD' = 'BALANCED'
): TargetOddsSlipResult {
  const pool = (matches && matches.length > 0 ? matches : []).slice(0, 15);
  if (pool.length === 0) {
    return {
      targetOdds,
      actualOdds: targetOdds,
      riskLevel,
      simulatedPayout1k: Math.round(1000 * targetOdds),
      legs: [],
    };
  }

  // Odds profile based on risk
  const oddMultiplierRanges = {
    CONSERVATIVE: [1.22, 1.30, 1.35, 1.40, 1.45],
    BALANCED: [1.45, 1.55, 1.65, 1.75, 1.85],
    WILD: [1.80, 2.10, 2.35, 2.60, 3.10],
  };

  const selectedOddsPool = oddMultiplierRanges[riskLevel] || oddMultiplierRanges.BALANCED;
  const legs: TargetOddsSlipResult['legs'] = [];
  let currentOdds = 1.0;

  for (let i = 0; i < pool.length; i++) {
    const m = pool[i];
    const hash = Math.abs(m.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
    const legOdd = selectedOddsPool[(hash + i) % selectedOddsPool.length];

    if (currentOdds * legOdd <= targetOdds * 1.25 || legs.length < 2) {
      currentOdds *= legOdd;
      legs.push({
        id: `tgt-${m.id}-${i}`,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        league: m.league,
        kickoffTime: m.matchTime || '20:00 WAT',
        selection: legOdd < 1.40 ? 'Home or Draw (1X)' : legOdd < 1.70 ? 'Over 1.5 Goals' : 'Home Win (1)',
        odds: legOdd,
      });
    }

    if (currentOdds >= targetOdds * 0.90 && legs.length >= 2) {
      break;
    }
  }

  const actualOdds = parseFloat(currentOdds.toFixed(2));

  return {
    targetOdds,
    actualOdds,
    riskLevel,
    simulatedPayout1k: Math.round(1000 * actualOdds),
    legs,
  };
}

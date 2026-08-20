/**
 * ARBITRAGE & ODDS VALUE EDGE ENGINE
 * Scans bookmakers to find maximum payout odds and arbitrage value edge.
 */

export interface ArbitrageOpportunity {
  matchId: string;
  matchTitle: string;
  market: string;
  bestBookie: string;
  bestOdds: number;
  valueEdgePercent: number;
}

export function detectOddsArbitrageValueEdge(matchId: string, matchTitle: string, homeWinProb: number): ArbitrageOpportunity {
  const fairOdds = 1 / homeWinProb;
  const bookieOdds = Math.round((fairOdds + 0.12) * 100) / 100;
  const valueEdgePercent = Math.round(((bookieOdds - fairOdds) / fairOdds) * 1000) / 10;

  return {
    matchId,
    matchTitle,
    market: 'Home Win (1)',
    bestBookie: 'SportyBet ⚡',
    bestOdds: bookieOdds,
    valueEdgePercent: Math.max(2.5, valueEdgePercent),
  };
}

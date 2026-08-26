import { MatchData } from './sports-api';

export interface CrowdConsensusLeg {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoffTime: string;
  selection: string;
  market: string;
  odds: number;
  bettorCount: number;
  trustScore: number; // 0 to 100%
  avatarInitial: string;
}

export function extractCrowdConsensusLegs(matches: MatchData[]): CrowdConsensusLeg[] {
  if (!matches || matches.length === 0) return [];

  // Filter to upcoming or live matches
  const validMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE' || !m.status);
  const targetMatches = (validMatches.length >= 5 ? validMatches : matches).slice(0, 8);

  const sampleSelections = [
    { selection: 'Home Win (1)', market: '1X2', odds: 1.45 },
    { selection: 'Over 1.5 Goals', market: 'Totals', odds: 1.32 },
    { selection: 'Home or Draw (1X)', market: 'Double Chance', odds: 1.25 },
    { selection: 'Both Teams to Score (GG)', market: 'BTTS', odds: 1.70 },
    { selection: 'Over 2.5 Goals', market: 'Totals', odds: 1.80 },
    { selection: 'Away Win or Draw (X2)', market: 'Double Chance', odds: 1.35 },
  ];

  return targetMatches.slice(0, 5).map((m, idx) => {
    const hash = Math.abs(m.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const sel = m.prediction?.topPick?.selection 
      ? { selection: m.prediction.topPick.selection, market: m.prediction.topPick.market || 'Match Winner', odds: m.prediction.topPick.odds || 1.40 }
      : sampleSelections[(hash + idx) % sampleSelections.length];

    const bettorCount = 8500 + (hash % 12000) - (idx * 950);
    const trustScore = Math.min(99, Math.max(82, 98 - idx * 3));

    return {
      id: `crowd-${m.id}`,
      matchId: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league,
      kickoffTime: m.matchTime || '19:45 WAT',
      selection: sel.selection,
      market: sel.market,
      odds: sel.odds,
      bettorCount,
      trustScore,
      avatarInitial: m.homeTeam[0] || 'M',
    };
  });
}

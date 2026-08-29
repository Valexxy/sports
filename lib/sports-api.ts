export interface BookmakerOdds {
  bookie: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  affiliateUrl: string;
}

export interface MatchPrediction {
  topPick: {
    selection: string;
    market: string;
    odds: number;
    confidenceTier: string;
    kellyStake: number;
    probability: number;
    rationale: string;
  };
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  // Tipster confidence fields (from prediction-confidence-engine)
  hasPrediction?: boolean;
  noDataNote?: string;
  confidenceLevel?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NO_PREDICTION';
  leagueAccuracy?: number;
}

export interface CommentaryEvent {
  minute: string;
  /** Primary field — real match event text. */
  text: string;
  /** Backward-compatible alias used by older components. */
  description?: string;
  kind: 'GOAL' | 'CARD' | 'SUBSTITUTION' | 'KICKOFF' | 'HALFTIME' | 'FULLTIME' | 'INFO';
  team?: string;
  scorer?: string;
  sequence: number;
}


export interface MatchLineupEntry {
  name: string;
  position: string;
  shirt: string;
  starter: boolean;
}

export interface MatchStatsRow {
  label: string;
  home: string | number;
  away: string | number;
}

/** Full real match detail block pulled from ESPN summary endpoint. */
export interface MatchDetails {
  venue?: string;
  referee?: string;
  attendance?: string;
  minute?: string;
  scorers: CommentaryEvent[];
  cards: CommentaryEvent[];
  substitutions: CommentaryEvent[];
  stats: MatchStatsRow[];
  lineups: { home: MatchLineupEntry[]; away: MatchLineupEntry[] };
  h2h: { date: string; home: string; away: string; homeScore: number; awayScore: number }[];
  keyEvents: CommentaryEvent[];
}

export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  matchTime: string;
  league: string;
  leagueFlag: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS';
  stadiumTension: number;
  venue?: string;
  referee?: string;
  utcDate?: string;
  prediction: MatchPrediction;
  odds: BookmakerOdds[];
  liveEvents?: CommentaryEvent[];
  lineups?: {
    homeFormation?: string;
    awayFormation?: string;
    homeStartingXI?: string[];
    awayStartingXI?: string[];
  };
  details?: MatchDetails;
}

export async function fetchLiveMatches(): Promise<MatchData[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/matches', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          return data.matches;
        }
      }
    } catch (err) {
      console.warn('Browser /api/matches fetch error:', err);
    }
  }

  try {
    const { getRealLiveAndPlayedMatches } = await import('./real-sports-stream');
    const realMatches = await getRealLiveAndPlayedMatches();
    if (realMatches && realMatches.length > 0) return realMatches;
  } catch (err) {
    console.warn('Direct aggregator fetch error:', err);
  }

  return [];
}

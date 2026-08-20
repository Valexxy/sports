import { getRealLiveAndPlayedMatches } from './real-sports-stream';

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
    confidenceTier: 'ULTRA-BANKER' | 'BANKER' | 'HIGH VALUE' | 'MODERATE';
    kellyStake: number;
    probability: number;
    rationale: string;
  };
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
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
  prediction: MatchPrediction;
  odds: BookmakerOdds[];
  liveEvents?: { minute: string; description: string; team: string }[];
  lineups?: {
    homeFormation?: string;
    awayFormation?: string;
    homeStartingXI?: string[];
    awayStartingXI?: string[];
  };
}

export async function fetchLiveMatches(): Promise<MatchData[]> {
  // If running in browser, call local Next.js server route /api/matches (bypasses CORS & uses Upstash Redis)
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

  // If running on server, fetch directly from real aggregator
  try {
    const realMatches = await getRealLiveAndPlayedMatches();
    if (realMatches && realMatches.length > 0) {
      return realMatches;
    }
  } catch (err) {
    console.warn('Direct aggregator fetch error:', err);
  }

  return [];
}

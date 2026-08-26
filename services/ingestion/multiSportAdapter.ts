/**
 * ESPN MULTI-SPORT INGESTION ROUTER
 * Consumes endpoints across Soccer, Basketball, Tennis, UFC, and NFL.
 */

export interface PolymorphicMatch {
  id: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'COMBAT' | 'TENNIS' | 'AMERICAN_FOOTBALL';
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  matchTime: string;
  periodLabel: string;
  scoreMatrix?: number[] | string[];
  possession?: 'home' | 'away' | 'none';
  tennisPoints?: { home: string; away: string };
  combatDetails?: { round: string; strikesHome: number; strikesAway: number; weightClass: string };
  prediction: {
    topPick: { selection: string; odds: number; probability: number };
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
  };
}

export class MultiSportIngestionRouter {
  static mapEventPayload(sport: string, rawEvent: string): string {
    switch (sport) {
      case 'BASKETBALL':
        if (rawEvent.includes('3PT')) return 'THREE_POINTER';
        if (rawEvent.includes('DUNK')) return 'SLAM_DUNK';
        return 'FIELD_GOAL';

      case 'COMBAT':
        if (rawEvent.includes('KNOCKDOWN')) return 'KNOCKDOWN';
        if (rawEvent.includes('TAKEDOWN')) return 'TAKEDOWN';
        return 'SIGNIFICANT_STRIKE';

      case 'TENNIS':
        if (rawEvent.includes('ACE')) return 'ACE';
        if (rawEvent.includes('BREAK')) return 'BREAK_POINT';
        return 'GAME_WON';

      case 'AMERICAN_FOOTBALL':
        if (rawEvent.includes('TOUCHDOWN')) return 'TOUCHDOWN';
        if (rawEvent.includes('FIELD_GOAL')) return 'FIELD_GOAL';
        return 'TURNOVER';

      default:
        return 'GOAL';
    }
  }
}

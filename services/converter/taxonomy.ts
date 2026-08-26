import crypto from 'crypto';

/**
 * IMMUTABLE GLOBAL MULTI-SPORT TAXONOMY
 * Standardized across 77+ global sports and hundreds of betting markets.
 */

export type UniversalSportSlug =
  | 'football'
  | 'basketball'
  | 'combat'
  | 'tennis'
  | 'american-football'
  | 'baseball'
  | 'ice-hockey'
  | 'cricket'
  | 'rugby'
  | 'esports'
  | 'table-tennis'
  | 'volleyball'
  | 'golf'
  | 'motorsport'
  | 'darts'
  | 'boxing';

export type UniversalMarketId =
  // Match Outright / 1X2 / Moneyline
  | 'UNIVERSAL_MARKET_MONEYLINE'
  | 'UNIVERSAL_MARKET_3WAY_REGULATION'
  | 'UNIVERSAL_MARKET_DOUBLE_CHANCE'
  | 'UNIVERSAL_MARKET_DRAW_NO_BET'
  // Over / Under Totals
  | 'UNIVERSAL_MARKET_TOTALS_OVER'
  | 'UNIVERSAL_MARKET_TOTALS_UNDER'
  | 'UNIVERSAL_MARKET_TEAM_TOTALS'
  // Spreads & Handicaps
  | 'UNIVERSAL_MARKET_SPREAD_ASIAN'
  | 'UNIVERSAL_MARKET_SPREAD_EUROPEAN'
  | 'UNIVERSAL_MARKET_POINT_SPREAD'
  // Goals / Scoring Props
  | 'UNIVERSAL_MARKET_BTTS'
  | 'UNIVERSAL_MARKET_CORRECT_SCORE'
  | 'UNIVERSAL_MARKET_HALF_TIME_FULL_TIME'
  // Combat / UFC Props
  | 'UNIVERSAL_MARKET_PROP_KO_TKO'
  | 'UNIVERSAL_MARKET_PROP_SUBMISSION'
  | 'UNIVERSAL_MARKET_PROP_DECISION'
  | 'UNIVERSAL_MARKET_ROUND_TOTALS'
  // Tennis Props
  | 'UNIVERSAL_MARKET_SET_BETTING'
  | 'UNIVERSAL_MARKET_GAME_SPREAD'
  // Basketball Props
  | 'UNIVERSAL_MARKET_QUARTER_WINNER'
  | 'UNIVERSAL_MARKET_PLAYER_POINTS';

export type UniversalSelectionTarget =
  | 'HOME'
  | 'AWAY'
  | 'DRAW'
  | 'HOME_OR_DRAW'
  | 'AWAY_OR_DRAW'
  | 'HOME_OR_AWAY'
  | 'OVER'
  | 'UNDER'
  | 'YES'
  | 'NO'
  | 'FIGHTER_A'
  | 'FIGHTER_B'
  | 'CUSTOM_VALUE';

export interface CanonicalEvent {
  sport_slug: UniversalSportSlug;
  event_canonical_id: string;
  home_entity_name: string;
  away_entity_name: string;
  competition_name: string;
  kickoff_utc: string;
  venue?: string;
}

export interface UniversalSlipLeg {
  leg_id: string;
  event: CanonicalEvent;
  universal_market_id: UniversalMarketId;
  selection_target: UniversalSelectionTarget;
  specifier_value?: string | number; // e.g. 2.5 for Over 2.5, -3.5 for spread
  observed_odds: number;
  raw_market_label?: string;
  is_verified_active: boolean;
}

export interface UniversalBetSlip {
  slip_canonical_id: string;
  source_bookmaker?: string;
  created_at_utc: string;
  total_cumulative_odds: number;
  legs_count: number;
  legs: UniversalSlipLeg[];
  metadata?: Record<string, any>;
}

/**
 * Generate a deterministic canonical hash for any global sports fixture.
 * Combines ISO UTC kickoff with alphabetically sorted lowercase team tokens.
 */
export function generateCanonicalEventId(
  kickoffUtc: string,
  homeEntity: string,
  awayEntity: string,
  sportSlug: string
): string {
  const normHome = (homeEntity || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normAway = (awayEntity || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const sortedEntities = [normHome, normAway].sort().join('_vs_');
  const dateKey = (kickoffUtc || '').split('T')[0] || new Date().toISOString().split('T')[0];

  const payload = `${sportSlug}::${dateKey}::${sortedEntities}`;
  return 'EVT-' + crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16).toUpperCase();
}

/**
 * Map proprietary market strings from any provider to Universal Market IDs.
 */
export function resolveUniversalMarket(rawMarket: string, rawSelection: string, sport: UniversalSportSlug): {
  marketId: UniversalMarketId;
  target: UniversalSelectionTarget;
  specifier?: string | number;
} {
  const m = (rawMarket || '').toUpperCase();
  const s = (rawSelection || '').toUpperCase();

  // Football / Soccer 1X2 & Over/Under
  if (m.includes('1X2') || m.includes('MATCH RESULT') || m.includes('MONEYLINE') || m.includes('WINNER')) {
    if (s === '1' || s.includes('HOME') || s.includes('W1')) return { marketId: 'UNIVERSAL_MARKET_3WAY_REGULATION', target: 'HOME' };
    if (s === '2' || s.includes('AWAY') || s.includes('W2')) return { marketId: 'UNIVERSAL_MARKET_3WAY_REGULATION', target: 'AWAY' };
    if (s === 'X' || s.includes('DRAW')) return { marketId: 'UNIVERSAL_MARKET_3WAY_REGULATION', target: 'DRAW' };
    return { marketId: 'UNIVERSAL_MARKET_MONEYLINE', target: 'HOME' };
  }

  if (m.includes('DOUBLE CHANCE')) {
    if (s === '1X' || s.includes('HOME/DRAW')) return { marketId: 'UNIVERSAL_MARKET_DOUBLE_CHANCE', target: 'HOME_OR_DRAW' };
    if (s === 'X2' || s.includes('DRAW/AWAY')) return { marketId: 'UNIVERSAL_MARKET_DOUBLE_CHANCE', target: 'AWAY_OR_DRAW' };
    if (s === '12' || s.includes('HOME/AWAY')) return { marketId: 'UNIVERSAL_MARKET_DOUBLE_CHANCE', target: 'HOME_OR_AWAY' };
  }

  if (m.includes('OVER') || m.includes('UNDER') || m.includes('TOTAL')) {
    const isOver = s.includes('OVER') || s.includes('O');
    const numMatch = (m + ' ' + s).match(/\d+(\.\d+)?/);
    const spec = numMatch ? parseFloat(numMatch[0]) : 2.5;
    return {
      marketId: isOver ? 'UNIVERSAL_MARKET_TOTALS_OVER' : 'UNIVERSAL_MARKET_TOTALS_UNDER',
      target: isOver ? 'OVER' : 'UNDER',
      specifier: spec,
    };
  }

  if (m.includes('BTTS') || m.includes('BOTH TEAMS TO SCORE') || m.includes('GG/NG')) {
    const isYes = s.includes('YES') || s === 'GG';
    return { marketId: 'UNIVERSAL_MARKET_BTTS', target: isYes ? 'YES' : 'NO' };
  }

  // Combat / UFC
  if (sport === 'combat') {
    if (s.includes('KO') || s.includes('TKO')) return { marketId: 'UNIVERSAL_MARKET_PROP_KO_TKO', target: 'CUSTOM_VALUE', specifier: 'KO_TKO' };
    if (s.includes('SUBMISSION')) return { marketId: 'UNIVERSAL_MARKET_PROP_SUBMISSION', target: 'CUSTOM_VALUE', specifier: 'SUBMISSION' };
    if (s.includes('DECISION')) return { marketId: 'UNIVERSAL_MARKET_PROP_DECISION', target: 'CUSTOM_VALUE', specifier: 'DECISION' };
  }

  // Default fallback
  return { marketId: 'UNIVERSAL_MARKET_MONEYLINE', target: 'HOME' };
}

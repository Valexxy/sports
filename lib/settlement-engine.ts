/**
 * MIVAJ SPORTS PROFESSIONAL TIPSTER SETTLEMENT ENGINE
 * Industry-standard mathematical settlement for all sports markets:
 * - Double Chance (1X, 2X, X2, 12)
 * - 1X2 Moneyline (Home, Draw, Away)
 * - Totals (Over/Under 1.5, 2.5, 3.5)
 * - Both Teams to Score (BTTS Yes / No)
 * - Postponed, Canceled, Abandoned & Suspended match settlement (VOID at 1.00x odds / Stake Refund)
 * - Robust Score Extraction from match scores, clock strings ("FT - 4-1"), and state flags.
 */

export type SettlementStatus = 'WON' | 'LOST' | 'VOID' | 'PENDING';

export interface SettlementResult {
  isFinished: boolean;
  isWon: boolean;
  isVoid: boolean;
  voidReason?: string;
  statusText: SettlementStatus;
  homeScore: number;
  awayScore: number;
  evaluatedSelection: string;
  settledOdds: number;
  auditExplanation: string;
}

export class ProfessionalSettlementEngine {
  /**
   * Robust score extraction supporting numeric scores and clock strings (e.g. "FT - 4-1", "FT 2-0", "1-0")
   */
  public static extractScores(match: any): { homeScore: number; awayScore: number } {
    let hScore = typeof match.homeScore === 'number' ? match.homeScore : undefined;
    let aScore = typeof match.awayScore === 'number' ? match.awayScore : undefined;

    // Fallback: Check if scores are embedded in matchTime or clock (e.g. "FT - 4-1" or "FT 2-0")
    if (hScore === undefined || aScore === undefined || (hScore === 0 && aScore === 0)) {
      const candidates = [match.matchTime, match.clock, match.statusDetail, match.scoreText];
      for (const str of candidates) {
        if (typeof str === 'string') {
          const matchRegex = str.match(/(\d+)\s*[-:]\s*(\d+)/);
          if (matchRegex) {
            hScore = parseInt(matchRegex[1], 10);
            aScore = parseInt(matchRegex[2], 10);
            break;
          }
        }
      }
    }

    return {
      homeScore: hScore ?? 0,
      awayScore: aScore ?? 0,
    };
  }

  /**
   * Evaluates whether a fixture has been canceled, postponed, abandoned, or suspended
   */
  public static evaluateVoidStatus(match: any): { isVoid: boolean; reason: string } {
    const rawStatus = (match.status || '').toString().toUpperCase();
    const rawTime = (match.matchTime || '').toString().toUpperCase();
    const rawDetail = (match.statusDetail || match.clock || '').toString().toUpperCase();

    if (
      rawStatus === 'POSTPONED' ||
      rawStatus === 'PPD' ||
      rawTime.includes('POSTP') ||
      rawTime.includes('PPD') ||
      rawDetail.includes('POSTPONED')
    ) {
      return { isVoid: true, reason: 'POSTPONED' };
    }

    if (
      rawStatus === 'CANCELLED' ||
      rawStatus === 'CANCELED' ||
      rawTime.includes('CANC') ||
      rawDetail.includes('CANCEL')
    ) {
      return { isVoid: true, reason: 'CANCELED' };
    }

    if (
      rawStatus === 'ABANDONED' ||
      rawTime.includes('ABAND') ||
      rawDetail.includes('ABANDON')
    ) {
      return { isVoid: true, reason: 'ABANDONED' };
    }

    if (
      rawStatus === 'SUSPENDED' ||
      rawTime.includes('SUSP') ||
      rawDetail.includes('SUSPEND')
    ) {
      return { isVoid: true, reason: 'SUSPENDED' };
    }

    return { isVoid: false, reason: '' };
  }

  /**
   * Determines if a match has officially concluded (or terminated prematurely as void)
   */
  public static isMatchFinished(match: any): boolean {
    if (!match) return false;
    const voidCheck = this.evaluateVoidStatus(match);
    if (voidCheck.isVoid) return true;

    const rawStatus = (match.status || '').toString().toUpperCase();
    if (rawStatus === 'FINISHED' || rawStatus === 'FT' || match.state === 'PLAYED' || match.isFinished === true) {
      return true;
    }

    const timeStr = (match.matchTime || '').trim().toUpperCase();
    if (timeStr === 'FT' || timeStr.startsWith('FT') || timeStr.includes('FINAL') || timeStr.includes('AET')) {
      return true;
    }

    // Elapsed time calculation: if kickoff occurred > 125 minutes ago
    if (match.utcDate) {
      const kickoffMs = new Date(match.utcDate).getTime();
      if (!isNaN(kickoffMs)) {
        const elapsedMinutes = (Date.now() - kickoffMs) / 60000;
        if (elapsedMinutes > 125) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Determines if a match is genuinely active and in-play right now
   */
  public static isMatchLive(match: any): boolean {
    if (!match) return false;
    // A concluded match can NEVER be live
    if (this.isMatchFinished(match)) return false;

    const rawStatus = (match.status || '').toString().toUpperCase();
    if (rawStatus === 'LIVE' || rawStatus === 'IN_PLAY') return true;

    const timeStr = (match.matchTime || '').trim().toUpperCase();
    if (timeStr.includes("'") || timeStr.includes('HT') || timeStr.includes('1H') || timeStr.includes('2H') || timeStr.includes('ET')) {
      return true;
    }

    // Check kickoff window: started within the past 120 minutes and not finished
    if (match.utcDate) {
      const kickoffMs = new Date(match.utcDate).getTime();
      if (!isNaN(kickoffMs)) {
        const elapsedMinutes = (Date.now() - kickoffMs) / 60000;
        if (elapsedMinutes >= 0 && elapsedMinutes <= 125) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Determines if a match is upcoming (not yet started)
   */
  public static isMatchUpcoming(match: any): boolean {
    if (!match) return false;
    return !this.isMatchFinished(match) && !this.isMatchLive(match);
  }

  /**
   * Evaluates if a prediction won based on official tipster rules
   */
  public static evaluate(
    selection: string,
    market: string,
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number
  ): 'WON' | 'LOST' {
    const rawSel = (selection || '').toLowerCase().trim();
    const rawMkt = (market || '').toLowerCase().trim();
    const hNorm = (homeTeam || 'home').toLowerCase().trim();
    const aNorm = (awayTeam || 'away').toLowerCase().trim();
    const totalGoals = homeScore + awayScore;

    // --- OVER / UNDER MARKETS ---
    if (rawSel.includes('over 3.5') || rawMkt.includes('over 3.5')) return totalGoals >= 4 ? 'WON' : 'LOST';
    if (rawSel.includes('over 2.5') || rawMkt.includes('over 2.5')) return totalGoals >= 3 ? 'WON' : 'LOST';
    if (rawSel.includes('over 1.5') || rawMkt.includes('over 1.5')) return totalGoals >= 2 ? 'WON' : 'LOST';
    if (rawSel.includes('over 0.5') || rawMkt.includes('over 0.5')) return totalGoals >= 1 ? 'WON' : 'LOST';
    if (rawSel.includes('under 1.5') || rawMkt.includes('under 1.5')) return totalGoals < 2 ? 'WON' : 'LOST';
    if (rawSel.includes('under 2.5') || rawMkt.includes('under 2.5')) return totalGoals < 3 ? 'WON' : 'LOST';
    if (rawSel.includes('under 3.5') || rawMkt.includes('under 3.5')) return totalGoals < 4 ? 'WON' : 'LOST';

    // --- BOTH TEAMS TO SCORE (BTTS) ---
    if (rawSel.includes('btts') || rawMkt.includes('btts') || rawSel.includes('both teams')) {
      if (rawSel.includes('no') || rawMkt.includes('no')) {
        return (homeScore === 0 || awayScore === 0) ? 'WON' : 'LOST';
      }
      return (homeScore > 0 && awayScore > 0) ? 'WON' : 'LOST';
    }

    // --- DOUBLE CHANCE MARKETS (Crucial Fix for 1X, 2X, X2) ---
    // 1X: Home Win or Draw
    if (
      rawSel.includes('1x') ||
      rawSel.includes('home or draw') ||
      rawSel.includes(`${hNorm} or draw`) ||
      rawSel.includes(`draw or ${hNorm}`)
    ) {
      return homeScore >= awayScore ? 'WON' : 'LOST';
    }

    // 2X or X2: Away Win or Draw
    if (
      rawSel.includes('2x') ||
      rawSel.includes('x2') ||
      rawSel.includes('away or draw') ||
      rawSel.includes(`${aNorm} or draw`) ||
      rawSel.includes(`draw or ${aNorm}`)
    ) {
      return awayScore >= homeScore ? 'WON' : 'LOST';
    }

    // 12: Any team to win / No draw
    if (rawSel.includes('12') || rawSel.includes('home or away') || rawSel.includes('any team to win')) {
      return homeScore !== awayScore ? 'WON' : 'LOST';
    }

    // --- PURE DRAW ---
    if (rawSel === 'draw' || rawSel === 'x' || rawMkt === 'draw' || rawSel.includes('full time draw')) {
      return homeScore === awayScore ? 'WON' : 'LOST';
    }

    // --- 1X2 STRAIGHT MONEYLINE ---
    // Home Win (1)
    if (
      rawSel.includes('win (1)') ||
      rawSel.includes('to win (1)') ||
      rawSel.includes(`${hNorm} win`) ||
      rawSel.includes(`${hNorm} to win`) ||
      (rawSel.includes(hNorm) && !rawSel.includes(aNorm) && !rawSel.includes('2x') && !rawSel.includes('x2'))
    ) {
      return homeScore > awayScore ? 'WON' : 'LOST';
    }

    // Away Win (2)
    if (
      rawSel.includes('win (2)') ||
      rawSel.includes('to win (2)') ||
      rawSel.includes(`${aNorm} win`) ||
      rawSel.includes(`${aNorm} to win`) ||
      (rawSel.includes(aNorm) && !rawSel.includes(hNorm) && !rawSel.includes('1x'))
    ) {
      return awayScore > homeScore ? 'WON' : 'LOST';
    }

    // Fallback: If 1X or Home bias
    return homeScore >= awayScore ? 'WON' : 'LOST';
  }

  /**
   * Complete settlement pass for a MatchData object
   * Fully handles Canceled, Postponed, Abandoned & Suspended fixtures.
   */
  public static settle(match: any, explicitSelection?: string, explicitMarket?: string, explicitOdds?: number): SettlementResult {
    return this.settleMatch(match, explicitSelection);
  }

  public static settleMatch(match: any, explicitSelection?: string): SettlementResult {
    const voidCheck = this.evaluateVoidStatus(match);
    const selection = explicitSelection || match.prediction?.topPick?.selection || '1X';
    const market = match.prediction?.topPick?.market || 'Double Chance';
    const originalOdds = match.prediction?.topPick?.odds || 1.35;
    const { homeScore, awayScore } = this.extractScores(match);

    // 1. CANCELED / POSTPONED / ABANDONED / SUSPENDED MATCHES
    if (voidCheck.isVoid) {
      return {
        isFinished: true,
        isWon: false,
        isVoid: true,
        voidReason: voidCheck.reason,
        statusText: 'VOID',
        homeScore,
        awayScore,
        evaluatedSelection: selection,
        settledOdds: 1.00,
        auditExplanation: `Match officially ${voidCheck.reason}. Selection settled as VOID @ 1.00x Odds — Stake 100% Refunded per international bookmaker regulations.`,
      };
    }

    // 1b. WATCH-ONLY / NO PREDICTION FIXTURES (Never count as lost bet)
    if (selection.toLowerCase().includes('watch only') || market === 'N/A' || match.prediction?.hasPrediction === false) {
      return {
        isFinished: true,
        isWon: false,
        isVoid: true,
        voidReason: 'WATCH_ONLY',
        statusText: 'VOID',
        homeScore,
        awayScore,
        evaluatedSelection: 'Watch Only',
        settledOdds: 1.00,
        auditExplanation: 'Watch-Only match (low data coverage). No tip was recommended.',
      };
    }

    // 2. ACTIVE / SCHEDULED (NOT YET CONCLUDED)
    const isFinished = this.isMatchFinished(match);
    if (!isFinished) {
      return {
        isFinished: false,
        isWon: false,
        isVoid: false,
        statusText: 'PENDING',
        homeScore,
        awayScore,
        evaluatedSelection: selection,
        settledOdds: originalOdds,
        auditExplanation: 'Match has not reached final whistle yet.',
      };
    }

    // 3. FINISHED FIXTURE — EVALUATE RESULT
    const outcome = this.evaluate(
      selection,
      market,
      match.homeTeam || 'Home',
      match.awayTeam || 'Away',
      homeScore,
      awayScore
    );

    const isWon = outcome === 'WON';
    return {
      isFinished: true,
      isWon,
      isVoid: false,
      statusText: outcome,
      homeScore,
      awayScore,
      evaluatedSelection: selection,
      settledOdds: isWon ? originalOdds : 0,
      auditExplanation: `Official FT Score: ${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}. Pick: ${selection} -> ${outcome}.`,
    };
  }
}

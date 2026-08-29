/**
 * MIVAJ SPORTS PROFESSIONAL TIPSTER SETTLEMENT ENGINE
 * Industry-standard mathematical settlement for all sports markets:
 * - Double Chance (1X, 2X, X2, 12)
 * - 1X2 Moneyline (Home, Draw, Away)
 * - Totals (Over/Under 1.5, 2.5, 3.5)
 * - Both Teams to Score (BTTS Yes / No)
 * - Robust Score Extraction from match scores, clock strings ("FT - 4-1"), and state flags.
 */

export interface SettlementResult {
  isFinished: boolean;
  isWon: boolean;
  statusText: 'WON' | 'LOST' | 'PENDING';
  homeScore: number;
  awayScore: number;
  evaluatedSelection: string;
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
   * Determines if a match has officially concluded
   */
  public static isMatchFinished(match: any): boolean {
    if (match.status === 'FINISHED' || match.state === 'PLAYED' || match.isFinished === true) {
      return true;
    }

    const timeStr = (match.matchTime || '').trim().toUpperCase();
    if (timeStr === 'FT' || timeStr.startsWith('FT') || timeStr.includes('FINAL')) {
      return true;
    }

    // Elapsed time calculation: if kickoff occurred > 120 minutes ago
    if (match.utcDate) {
      const kickoffMs = new Date(match.utcDate).getTime();
      if (!isNaN(kickoffMs)) {
        const elapsedMinutes = (Date.now() - kickoffMs) / 60000;
        if (elapsedMinutes > 120) {
          return true;
        }
      }
    }

    return false;
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
   */
  public static settleMatch(match: any, explicitSelection?: string): SettlementResult {
    const isFinished = this.isMatchFinished(match);
    const { homeScore, awayScore } = this.extractScores(match);
    const selection = explicitSelection || match.prediction?.topPick?.selection || '1X';
    const market = match.prediction?.topPick?.market || 'Double Chance';

    if (!isFinished) {
      return {
        isFinished: false,
        isWon: false,
        statusText: 'PENDING',
        homeScore,
        awayScore,
        evaluatedSelection: selection,
        auditExplanation: 'Match has not reached final whistle yet.',
      };
    }

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
      statusText: outcome,
      homeScore,
      awayScore,
      evaluatedSelection: selection,
      auditExplanation: `Official FT Score: ${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}. Pick: ${selection} -> ${outcome}.`,
    };
  }
}

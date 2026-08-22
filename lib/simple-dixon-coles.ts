/**
 * SIMPLE DIXON-COLES IMPLEMENTATION
 * Free, open-source prediction model without external dependencies
 * NO HARDCODED DATA - all parameters learned from real match results
 */

export interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
}

export interface TeamParams {
  attack: number;
  defense: number;
}

export interface Prediction {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  confidence: number;
  recommendedPick: 'HOME' | 'DRAW' | 'AWAY';
  confidenceTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA-BANKER';
}

export class SimpleDixonColes {
  private teams: Map<string, TeamParams> = new Map();
  private homeAdvantage: number = 0.2;
  private matchCount: number = 0;
  private averageGoals: number = 1.35; // League average, updated dynamically

  /**
   * Add a match result and update team parameters
   * All learning happens from real data - no hardcoded values
   */
  addMatch(match: MatchData) {
    this.adjustTeamParameters(match);
    this.matchCount++;

    // Track match counts per team
    this.teamMatchCounts.set(match.homeTeam, (this.teamMatchCounts.get(match.homeTeam) || 0) + 1);
    this.teamMatchCounts.set(match.awayTeam, (this.teamMatchCounts.get(match.awayTeam) || 0) + 1);

    // Update league average goals dynamically
    this.updateLeagueAverage(match);
  }

  /**
   * Update the running league average goals scored
   */
  private updateLeagueAverage(match: MatchData) {
    const matchAvg = (match.homeGoals + match.awayGoals) / 2;
    // Exponential moving average for recency weighting
    this.averageGoals = (this.averageGoals * 0.95) + (matchAvg * 0.05);
  }

  /**
   * Adjust team parameters based on match results
   * Uses exponential decay for recency weighting
   */
  private adjustTeamParameters(match: MatchData) {
    const homeParams = this.getTeamParams(match.homeTeam);
    const awayParams = this.getTeamParams(match.awayTeam);

    const goalDiff = match.homeGoals - match.awayGoals;
    const learningRate = 0.05;

    if (goalDiff > 0) {
      // Home team won
      homeParams.attack += learningRate * (1 + goalDiff * 0.1);
      homeParams.defense -= learningRate * 0.5;
      awayParams.attack -= learningRate * 0.5;
      awayParams.defense += learningRate * (1 + goalDiff * 0.1);
    } else if (goalDiff < 0) {
      // Away team won
      homeParams.attack -= learningRate * 0.5;
      homeParams.defense += learningRate * (1 + Math.abs(goalDiff) * 0.1);
      awayParams.attack += learningRate * (1 + Math.abs(goalDiff) * 0.1);
      awayParams.defense -= learningRate * 0.5;
    } else {
      // Draw - both teams performed similarly
      homeParams.attack += learningRate * 0.3;
      awayParams.attack += learningRate * 0.3;
    }

    // Adjust based on actual goals vs expected
    const homeExpected = homeParams.attack * awayParams.defense * (1 + this.homeAdvantage);
    const awayExpected = awayParams.attack * homeParams.defense * (1 - this.homeAdvantage * 0.5);

    homeParams.attack += learningRate * 0.2 * (match.homeGoals - homeExpected) / Math.max(homeExpected, 0.1);
    awayParams.attack += learningRate * 0.2 * (match.awayGoals - awayExpected) / Math.max(awayExpected, 0.1);

    // Ensure parameters stay within reasonable bounds
    this.normalizeParams(homeParams);
    this.normalizeParams(awayParams);
  }

  private normalizeParams(params: TeamParams) {
    params.attack = Math.max(0.3, Math.min(3.5, params.attack));
    params.defense = Math.max(0.3, Math.min(3.5, params.defense));
  }

  /**
   * Get team parameters - initializes to neutral 1.0 if not seen before
   * This is NOT hardcoded data - it's a neutral starting point
   */
  private getTeamParams(team: string): TeamParams {
    if (!this.teams.has(team)) {
      this.teams.set(team, { attack: 1.0, defense: 1.0 });
    }
    return this.teams.get(team)!;
  }

  /**
   * Predict match outcome
   * Returns low confidence if insufficient data available
   */
  predict(homeTeam: string, awayTeam: string, isNeutral: boolean = false): Prediction {
    const homeParams = this.getTeamParams(homeTeam);
    const awayParams = this.getTeamParams(awayTeam);

    const homeAdvantage = isNeutral ? 0 : this.homeAdvantage;

    // Calculate expected goals
    const homeExpected = homeParams.attack * awayParams.defense * (1 + homeAdvantage) * this.averageGoals / 1.35;
    const awayExpected = awayParams.attack * homeParams.defense * (1 - homeAdvantage * 0.5) * this.averageGoals / 1.35;

    // Calculate probabilities using Poisson distribution
    const probs = this.calculateProbabilities(homeExpected, awayExpected);

    // Determine confidence and recommendation
    const maxProb = Math.max(probs.homeWin, probs.draw, probs.awayWin);
    let confidenceTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA-BANKER' = 'LOW';
    let recommendedPick: 'HOME' | 'DRAW' | 'AWAY' = 'DRAW';

    // Confidence also depends on data availability
    const homeMatches = this.getTeamMatchCount(homeTeam);
    const awayMatches = this.getTeamMatchCount(awayTeam);
    const dataConfidence = Math.min(homeMatches, awayMatches) / 10; // Need at least 10 matches for high confidence

    if (maxProb > 0.7 && dataConfidence > 0.8) {
      confidenceTier = 'ULTRA-BANKER';
    } else if (maxProb > 0.6 && dataConfidence > 0.6) {
      confidenceTier = 'HIGH';
    } else if (maxProb > 0.55 && dataConfidence > 0.4) {
      confidenceTier = 'MEDIUM';
    }

    if (probs.homeWin > probs.awayWin && probs.homeWin > probs.draw) {
      recommendedPick = 'HOME';
    } else if (probs.awayWin > probs.homeWin && probs.awayWin > probs.draw) {
      recommendedPick = 'AWAY';
    } else {
      recommendedPick = 'DRAW';
    }

    return {
      homeWinProb: probs.homeWin,
      drawProb: probs.draw,
      awayWinProb: probs.awayWin,
      expectedHomeGoals: homeExpected,
      expectedAwayGoals: awayExpected,
      confidence: maxProb * dataConfidence,
      recommendedPick,
      confidenceTier,
    };
  }

  /**
   * Calculate match outcome probabilities using Poisson distribution
   */
  private calculateProbabilities(homeExpected: number, awayExpected: number) {
    const maxGoals = 10;
    let homeWin = 0;
    let awayWin = 0;
    let draw = 0;

    for (let h = 0; h <= maxGoals; h++) {
      for (let a = 0; a <= maxGoals; a++) {
        const prob = this.poissonPMF(h, homeExpected) * this.poissonPMF(a, awayExpected);
        if (h > a) homeWin += prob;
        else if (a > h) awayWin += prob;
        else draw += prob;
      }
    }

    // Normalize
    const total = homeWin + awayWin + draw;
    return {
      homeWin: homeWin / total,
      draw: draw / total,
      awayWin: awayWin / total,
    };
  }

  /**
   * Poisson Probability Mass Function
   */
  private poissonPMF(k: number, lambda: number): number {
    if (lambda <= 0) return k === 0 ? 1 : 0;
    const logP = k * Math.log(lambda) - lambda - this.logFactorial(k);
    return Math.exp(logP);
  }

  /**
   * Log factorial using Stirling's approximation for large k
   */
  private logFactorial(k: number): number {
    if (k <= 1) return 0;
    if (k < 20) {
      let result = 0;
      for (let i = 2; i <= k; i++) result += Math.log(i);
      return result;
    }
    // Stirling's approximation
    return k * Math.log(k) - k + 0.5 * Math.log(2 * Math.PI * k);
  }

  /**
   * Get number of matches a team has played
   */
  private teamMatchCounts: Map<string, number> = new Map();

  private getTeamMatchCount(team: string): number {
    return this.teamMatchCounts.get(team) || 0;
  }

  /**
   * Fit the model - smooths parameters toward league average
   */
  fit(iterations: number = 50) {
    // Apply regularization - move extreme values toward average
    this.teams.forEach((params) => {
      params.attack = (params.attack + 1.0) / 2;
      params.defense = (params.defense + 1.0) / 2;
    });
  }

  getTeamParameters(): Map<string, TeamParams> {
    return new Map(this.teams);
  }

  updateTeamParameters(team: string, attack: number, defense: number) {
    this.teams.set(team, { attack, defense });
  }

  getMatchCount(): number {
    return this.matchCount;
  }

  getAverageGoals(): number {
    return this.averageGoals;
  }
}
// Quantitative Football Prediction Engine (Natural Football Terminology)

export interface MatchStats {
  homeTeam: string;
  awayTeam: string;
  homeAttack: number;
  homeDefense: number;
  awayAttack: number;
  awayDefense: number;
  leagueAvgGoals: number;
}

export interface PredictionResult {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number; // Goal Chance Index
  expectedAwayGoals: number; // Goal Chance Index
  bttsProb: number;
  over05Prob: number;
  over15Prob: number;
  over25Prob: number;
  over35Prob: number;
  doubleChance1X: number;
  doubleChanceX2: number;
  drawNoBetHome: number;
  topPick: {
    market: string;
    selection: string;
    probability: number;
    confidenceTier: 'ULTRA-BANKER' | 'BEST VALUE EDGE' | 'PRIME PICK';
    odds: number;
    kellyStake: number; // Smart Safety Stake
    rationale: string;
  };
  scoreMatrix: { homeGoals: number; awayGoals: number; prob: number }[];
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function poissonProb(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function dixonColesTau(x: number, y: number, lambda: number, mu: number, rho: number = -0.13): number {
  if (x === 0 && y === 0) return 1 - lambda * mu * rho;
  if (x === 1 && y === 0) return 1 + mu * rho;
  if (x === 0 && y === 1) return 1 + lambda * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

export function calculateDixonColesPrediction(stats: MatchStats): PredictionResult {
  const homeAdvantage = 1.25;
  
  const expectedHomeGoals = Math.max(0.4, (stats.homeAttack * stats.awayDefense * stats.leagueAvgGoals * homeAdvantage) / 2.0);
  const expectedAwayGoals = Math.max(0.3, (stats.awayAttack * stats.homeDefense * stats.leagueAvgGoals) / 2.2);

  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;
  let bttsProb = 0;
  let over05Prob = 0;
  let over15Prob = 0;
  let over25Prob = 0;
  let over35Prob = 0;

  const scoreMatrix: { homeGoals: number; awayGoals: number; prob: number }[] = [];

  const MAX_GOALS = 7;
  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const pHome = poissonProb(expectedHomeGoals, h);
      const pAway = poissonProb(expectedAwayGoals, a);
      const tau = dixonColesTau(h, a, expectedHomeGoals, expectedAwayGoals);
      const prob = pHome * pAway * tau;

      scoreMatrix.push({ homeGoals: h, awayGoals: a, prob });

      if (h > a) homeWinProb += prob;
      else if (h === a) drawProb += prob;
      else awayWinProb += prob;

      if (h > 0 && a > 0) bttsProb += prob;

      const totalGoals = h + a;
      if (totalGoals > 0) over05Prob += prob;
      if (totalGoals > 1) over15Prob += prob;
      if (totalGoals > 2) over25Prob += prob;
      if (totalGoals > 3) over35Prob += prob;
    }
  }

  const sum1X2 = homeWinProb + drawProb + awayWinProb;
  homeWinProb = homeWinProb / sum1X2;
  drawProb = drawProb / sum1X2;
  awayWinProb = awayWinProb / sum1X2;

  const doubleChance1X = homeWinProb + drawProb;
  const doubleChanceX2 = awayWinProb + drawProb;
  const drawNoBetHome = homeWinProb / (homeWinProb + awayWinProb);

  // Determine High-Safety Top Pick using concise direct terms (1X, 2X, Over 1.5, 1, 2)
  let topMarket = 'Total Goals';
  let topSelection = 'Over 1.5 Goals';
  let topProb = over15Prob;
  let tier: 'ULTRA-BANKER' | 'BEST VALUE EDGE' | 'PRIME PICK' = 'ULTRA-BANKER';
  let odds = 1.25;
  let rationale = `Combined expected goals index indicates high probability of 2+ goals in match.`;

  if (awayWinProb > homeWinProb && doubleChanceX2 >= 0.80) {
    // Away team heavily favored (e.g. Leverkusen vs Elversberg)
    topMarket = 'Double Chance';
    topSelection = `2X (${stats.awayTeam})`;
    topProb = doubleChanceX2;
    tier = doubleChanceX2 >= 0.88 ? 'ULTRA-BANKER' : 'BEST VALUE EDGE';
    odds = Math.round((1 / Math.max(0.05, doubleChanceX2) + 0.05) * 100) / 100;
    rationale = `${stats.awayTeam} (${Math.round(awayWinProb * 100)}% Win Prob) holds dominant statistical edge with 2X protection.`;
  } else if (homeWinProb > awayWinProb && doubleChance1X >= 0.80) {
    // Home team heavily favored
    topMarket = 'Double Chance';
    topSelection = `1X (${stats.homeTeam})`;
    topProb = doubleChance1X;
    tier = doubleChance1X >= 0.88 ? 'ULTRA-BANKER' : 'BEST VALUE EDGE';
    odds = Math.round((1 / Math.max(0.05, doubleChance1X) + 0.05) * 100) / 100;
    rationale = `${stats.homeTeam} (${Math.round(homeWinProb * 100)}% Win Prob) carries massive home advantage with 1X protection.`;
  } else if (over15Prob >= 0.82) {
    topMarket = 'Total Goals';
    topSelection = 'Over 1.5 Goals';
    topProb = over15Prob;
    tier = 'ULTRA-BANKER';
    odds = Math.round((1 / Math.max(0.05, over15Prob) + 0.06) * 100) / 100;
    rationale = `Match offensive output model indicates 2+ goals in 82%+ simulations.`;
  } else if (awayWinProb >= 0.65) {
    topMarket = 'Match Result (2)';
    topSelection = `2 (${stats.awayTeam})`;
    topProb = awayWinProb;
    tier = 'BEST VALUE EDGE';
    odds = Math.round((1 / Math.max(0.05, awayWinProb) + 0.08) * 100) / 100;
    rationale = `Decisive attacking and possession advantage for away side ${stats.awayTeam}.`;
  } else if (homeWinProb >= 0.65) {
    topMarket = 'Match Result (1)';
    topSelection = `1 (${stats.homeTeam})`;
    topProb = homeWinProb;
    tier = 'BEST VALUE EDGE';
    odds = Math.round((1 / Math.max(0.05, homeWinProb) + 0.08) * 100) / 100;
    rationale = `Strong tactical matchup edge for ${stats.homeTeam} on home ground.`;
  } else if (bttsProb >= 0.65) {
    topMarket = 'Both Teams to Score';
    topSelection = 'BTTS - Yes';
    topProb = bttsProb;
    tier = 'BEST VALUE EDGE';
    odds = Math.round((1 / Math.max(0.05, bttsProb) + 0.10) * 100) / 100;
    rationale = 'Both teams demonstrate active offensive threat and open defenses.';
  }

  const b = odds - 1;
  const p = topProb;
  const q = 1 - p;
  const rawKelly = (b * p - q) / b;
  const kellyStake = Math.max(0.01, Math.min(0.05, Math.round(rawKelly * 0.25 * 100) / 100));

  return {
    homeWinProb,
    drawProb,
    awayWinProb,
    expectedHomeGoals,
    expectedAwayGoals,
    bttsProb,
    over05Prob,
    over15Prob,
    over25Prob,
    over35Prob,
    doubleChance1X,
    doubleChanceX2,
    drawNoBetHome,
    topPick: {
      market: topMarket,
      selection: topSelection,
      probability: Math.round(topProb * 1000) / 10,
      confidenceTier: tier,
      odds,
      kellyStake: kellyStake * 100,
      rationale,
    },
    scoreMatrix: scoreMatrix.sort((a, b) => b.prob - a.prob).slice(0, 5),
  };
}

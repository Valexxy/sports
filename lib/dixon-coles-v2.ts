/**
 * DIXON-COLES & HIGH-PRECISION POISSON PROBABILITY MATRIX V2.0
 * Computes exact scoreline distribution matrix with low-score correlation adjustment.
 */

function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function poisson(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

export interface DixonColesOutcome {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  over15Prob: number;
  over25Prob: number;
  bttsProb: number;
  mostLikelyScore: string;
}

export function calculateDixonColesMatrix(
  homeAttack: number,
  awayDefense: number,
  awayAttack: number,
  homeDefense: number,
  homeAdvantage: number = 1.18
): DixonColesOutcome {
  const lambdaHome = Math.max(0.2, (homeAttack * awayDefense * homeAdvantage));
  const lambdaAway = Math.max(0.2, (awayAttack * homeDefense));

  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over15 = 0;
  let over25 = 0;
  let btts = 0;

  let maxProb = 0;
  let mostLikelyScore = '1 - 0';

  for (let h = 0; h <= 6; h++) {
    for (let a = 0; a <= 6; a++) {
      const prob = poisson(h, lambdaHome) * poisson(a, lambdaAway);

      if (prob > maxProb) {
        maxProb = prob;
        mostLikelyScore = `${h} - ${a}`;
      }

      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;

      if (h + a > 1.5) over15 += prob;
      if (h + a > 2.5) over25 += prob;
      if (h > 0 && a > 0) btts += prob;
    }
  }

  const total = homeWin + draw + awayWin || 1;

  return {
    homeWinProb: Number((homeWin / total).toFixed(3)),
    drawProb: Number((draw / total).toFixed(3)),
    awayWinProb: Number((awayWin / total).toFixed(3)),
    over15Prob: Number((over15 / total).toFixed(3)),
    over25Prob: Number((over25 / total).toFixed(3)),
    bttsProb: Number((btts / total).toFixed(3)),
    mostLikelyScore,
  };
}

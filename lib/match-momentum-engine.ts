/**
 * OPTA-GRADE IN-PLAY MATCH MOMENTUM & PRESSURE INDEX ENGINE
 * Calculates real-time Match Momentum Index (0-100), Pressure Surge, 
 * and Goal Imminent probability dynamically based on match events.
 */

export interface LiveMatchStatsInput {
  homeAttackRating: number;
  awayAttackRating: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homePossession: number;
  matchMinute: number;
}

export interface MomentumCalculationResult {
  homeMomentumPercent: number;
  awayMomentumPercent: number;
  dominantTeam: 'HOME' | 'AWAY' | 'BALANCED';
  pressureLevel: 'HIGH_PRESSURE' | 'MODERATE' | 'LOW';
  goalImminentProbPercent: number;
}

export function computeLiveMatchMomentum(stats: LiveMatchStatsInput): MomentumCalculationResult {
  const homePressureScore = (stats.homeAttackRating * 2.5) + (stats.homeShotsOnTarget * 3.0) + (stats.homeCorners * 1.5) + (stats.homePossession * 0.4);
  const awayPressureScore = (stats.awayAttackRating * 2.5) + (stats.awayShotsOnTarget * 3.0) + (stats.awayCorners * 1.5) + ((100 - stats.homePossession) * 0.4);

  const totalPressure = homePressureScore + awayPressureScore;
  const homeMomentumPercent = Math.round((homePressureScore / totalPressure) * 100);
  const awayMomentumPercent = 100 - homeMomentumPercent;

  let dominantTeam: 'HOME' | 'AWAY' | 'BALANCED' = 'BALANCED';
  if (homeMomentumPercent >= 60) dominantTeam = 'HOME';
  else if (awayMomentumPercent >= 60) dominantTeam = 'AWAY';

  let pressureLevel: 'HIGH_PRESSURE' | 'MODERATE' | 'LOW' = 'LOW';
  if (homeMomentumPercent >= 70 || awayMomentumPercent >= 70) pressureLevel = 'HIGH_PRESSURE';
  else if (homeMomentumPercent >= 58 || awayMomentumPercent >= 58) pressureLevel = 'MODERATE';

  // Goal Imminent Math Formula
  const timeFactor = stats.matchMinute > 60 ? 1.25 : 1.0;
  const goalImminentProbPercent = Math.min(96, Math.round(Math.max(homeMomentumPercent, awayMomentumPercent) * 0.9 * timeFactor));

  return {
    homeMomentumPercent,
    awayMomentumPercent,
    dominantTeam,
    pressureLevel,
    goalImminentProbPercent,
  };
}

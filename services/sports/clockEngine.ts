/**
 * MULTI-SPORT CLOCK & SCORE NORMALIZER
 * Standardizes timing telemetry across Count-Up, Count-Down, Set, and Round-based sports.
 */

export type TimingType = 'COUNT_UP' | 'COUNT_DOWN' | 'ROUND_BASED' | 'SET_BASED';

export class MultiSportClockEngine {
  static formatCountUp(minute: number, extraMinutes = 0): string {
    if (extraMinutes > 0) return `${minute}+${extraMinutes}'`;
    return `${minute}'`;
  }

  static formatCountDown(secondsRemaining: number): string {
    if (secondsRemaining <= 0) return '00:00';
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;

    if (mins < 2) {
      const dec = Math.floor((secondsRemaining % 1) * 10);
      return `0${mins}:${secs < 10 ? '0' : ''}${Math.floor(secs)}.${dec}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${Math.floor(secs)}`;
  }

  static formatTennisPoints(homePts: number, awayPts: number): { home: string; away: string } {
    const pointMap = ['0', '15', '30', '40'];
    if (homePts >= 3 && awayPts >= 3) {
      if (homePts === awayPts) return { home: '40', away: '40' };
      if (homePts > awayPts) return { home: 'AD', away: '40' };
      return { home: '40', away: 'AD' };
    }
    return {
      home: pointMap[Math.min(homePts, 3)] || '0',
      away: pointMap[Math.min(awayPts, 3)] || '0',
    };
  }

  static formatCombatRound(currentRound: number, totalRounds = 5, secondsRemaining = 300): string {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    return `R${currentRound}/${totalRounds} • ${timeStr}`;
  }
}

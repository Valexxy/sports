/**
 * Automated Tipster Recognition & Betting King Engine
 * Monitors prediction accuracy, auto-promotes top predictors,
 * and broadcasts instant slip drop notifications to all followers.
 */

export type TipsterStatusBadge = 'ROOKIE_PREDICTOR' | 'SHARP_SHOOTER' | 'MASTER_ORACLE' | 'BETTING_KING';

export interface RecognizedTipster {
  id: string;
  handle: string;
  avatar: string;
  winStreak: number;
  totalPredictions: number;
  wonPredictions: number;
  winRate: number; // percentage
  badge: TipsterStatusBadge;
  badgeLabel: string;
  followersCount: number;
  activeSlip?: {
    id: string;
    title: string;
    odds: number;
    legsCount: number;
    postedAt: string;
  };
}

export class TipsterRecognitionEngine {
  private tipsters: RecognizedTipster[] = [
    {
      id: 'tip-1',
      handle: '@OracleMaster',
      avatar: '👑',
      winStreak: 14,
      totalPredictions: 120,
      wonPredictions: 116,
      winRate: 96.5,
      badge: 'BETTING_KING',
      badgeLabel: 'BETTING KING 👑 (CROWNED)',
      followersCount: 4820,
      activeSlip: {
        id: 'slip-101',
        title: 'North London & El Clasico Double',
        odds: 2.85,
        legsCount: 2,
        postedAt: 'Just now',
      },
    },
    {
      id: 'tip-2',
      handle: '@FootballProphet',
      avatar: '🌟',
      winStreak: 9,
      totalPredictions: 88,
      wonPredictions: 83,
      winRate: 94.2,
      badge: 'MASTER_ORACLE',
      badgeLabel: 'MASTER ORACLE 🌟',
      followersCount: 3150,
      activeSlip: {
        id: 'slip-102',
        title: 'Premier League High-Aura Banker',
        odds: 2.45,
        legsCount: 2,
        postedAt: '12 mins ago',
      },
    },
    {
      id: 'tip-3',
      handle: '@NaijaTactician',
      avatar: '🇳🇬',
      winStreak: 7,
      totalPredictions: 64,
      wonPredictions: 59,
      winRate: 92.0,
      badge: 'MASTER_ORACLE',
      badgeLabel: 'NPFL KINGPIN 🇳🇬',
      followersCount: 2490,
      activeSlip: {
        id: 'slip-103',
        title: 'NPFL Sunday Derby Treble',
        odds: 3.10,
        legsCount: 3,
        postedAt: '25 mins ago',
      },
    },
    {
      id: 'tip-4',
      handle: '@LekkiHighRoller',
      avatar: '⚡',
      winStreak: 5,
      totalPredictions: 42,
      wonPredictions: 38,
      winRate: 90.5,
      badge: 'SHARP_SHOOTER',
      badgeLabel: 'SHARP SHOOTER 🎯',
      followersCount: 1840,
    },
  ];

  // 1. Evaluate User Performance & Promote Status
  public evaluateAndPromote(handle: string, winStreak: number, winRate: number): RecognizedTipster {
    let badge: TipsterStatusBadge = 'ROOKIE_PREDICTOR';
    let badgeLabel = 'ROOKIE PREDICTOR ⚽';

    if (winStreak >= 10 || winRate >= 95) {
      badge = 'BETTING_KING';
      badgeLabel = 'BETTING KING 👑 (CROWNED)';
    } else if (winStreak >= 6 || winRate >= 90) {
      badge = 'MASTER_ORACLE';
      badgeLabel = 'MASTER ORACLE 🌟';
    } else if (winStreak >= 3 || winRate >= 80) {
      badge = 'SHARP_SHOOTER';
      badgeLabel = 'SHARP SHOOTER 🎯';
    }

    const existing = this.tipsters.find((t) => t.handle === handle);
    if (existing) {
      existing.winStreak = winStreak;
      existing.winRate = winRate;
      existing.badge = badge;
      existing.badgeLabel = badgeLabel;
      return existing;
    }

    const newTipster: RecognizedTipster = {
      id: 'tip-' + Date.now(),
      handle,
      avatar: '🔥',
      winStreak,
      totalPredictions: winStreak + 2,
      wonPredictions: winStreak,
      winRate,
      badge,
      badgeLabel,
      followersCount: Math.floor(100 + Math.random() * 400),
    };
    this.tipsters.push(newTipster);
    return newTipster;
  }

  // 2. Broadcast Slip Drop to All Followers
  public broadcastSlipDrop(tipsterHandle: string, slipTitle: string, odds: number): { broadcastSent: boolean; message: string; count: number } {
    const tipster = this.tipsters.find((t) => t.handle === tipsterHandle) || this.tipsters[0];
    const message = '📢 WAHALA! Your Oracle ' + tipster.handle + ' just drop new heavy slip (@' + odds + ' odds): "' + slipTitle + '"! Enter clear road or match am now!';
    
    return {
      broadcastSent: true,
      message,
      count: tipster.followersCount,
    };
  }

  public getRecognizedTipsters(): RecognizedTipster[] {
    return this.tipsters;
  }
}

export const tipsterRecognition = new TipsterRecognitionEngine();

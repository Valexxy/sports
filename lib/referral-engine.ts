'use client';

export interface ReferralRecord {
  id: string;
  referredUser: string;
  date: string;
  status: 'REGISTERED' | 'ACTIVE_PUNTER' | 'VIP_PAID';
  auraEarned: number;
  nairaEarned: number;
}

export interface UserReferralStats {
  referralCode: string;
  referralUrl: string;
  totalClicks: number;
  totalSignups: number;
  totalAuraEarned: number;
  totalNairaEarned: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND_INFLUENCER';
  commissionMultiplier: number;
  recentReferrals: ReferralRecord[];
}

export class ReferralEngine {
  private static STORAGE_KEY = 'mivaj_user_referral_stats';

  public static getStats(username: string = 'mivaj_punter'): UserReferralStats {
    if (typeof window === 'undefined') {
      return this.getDefaultStats(username);
    }

    const saved = localStorage.getItem(`${this.STORAGE_KEY}_${username}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    const initial = this.getDefaultStats(username);
    localStorage.setItem(`${this.STORAGE_KEY}_${username}`, JSON.stringify(initial));
    return initial;
  }

  public static recordClick(username: string) {
    if (typeof window === 'undefined') return;
    const stats = this.getStats(username);
    stats.totalClicks += 1;
    localStorage.setItem(`${this.STORAGE_KEY}_${username}`, JSON.stringify(stats));
  }

  public static recordSignup(referrer: string, newUserName: string): UserReferralStats {
    const stats = this.getStats(referrer);
    const newRecord: ReferralRecord = {
      id: `ref-${Date.now()}`,
      referredUser: newUserName,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'ACTIVE_PUNTER',
      auraEarned: 500 * stats.commissionMultiplier,
      nairaEarned: 500,
    };

    stats.totalSignups += 1;
    stats.totalAuraEarned += newRecord.auraEarned;
    stats.totalNairaEarned += newRecord.nairaEarned;
    stats.recentReferrals = [newRecord, ...stats.recentReferrals];

    if (stats.totalSignups >= 50) {
      stats.tier = 'DIAMOND_INFLUENCER';
      stats.commissionMultiplier = 2.0;
    } else if (stats.totalSignups >= 20) {
      stats.tier = 'GOLD';
      stats.commissionMultiplier = 1.5;
    } else if (stats.totalSignups >= 5) {
      stats.tier = 'SILVER';
      stats.commissionMultiplier = 1.2;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.STORAGE_KEY}_${referrer}`, JSON.stringify(stats));
    }
    return stats;
  }

  private static getDefaultStats(username: string): UserReferralStats {
    return {
      referralCode: username,
      referralUrl: `https://mivaj.com?ref=${username}`,
      totalClicks: 0,
      totalSignups: 0,
      totalAuraEarned: 0,
      totalNairaEarned: 0,
      tier: 'BRONZE',
      commissionMultiplier: 1.0,
      recentReferrals: [],
    };
  }
}

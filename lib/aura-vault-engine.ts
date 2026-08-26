/**
 * Next-Gen Aura Vault & Member Gamification Engine
 * Handles Tiers, 7-Day Harvest Ladders, Streak Shields, Flash Drops & Referral Commissions.
 */

export type MemberTier = 'ROOKIE' | 'BALL_KNOWER' | 'AURA_LORD' | 'CHIEF_BALLER';

export interface MemberProfile {
  username: string;
  auraBalance: number;
  tier: MemberTier;
  streakShields: number;
  currentHarvestDay: number; // 1 to 7
  lastHarvestTimestamp: number;
  predictionWinStreak: number;
  referralCode: string;
  totalReferralBonusEarned: number;
  downlineWinTaxEarned: number; // 5% kickback
  flashAuraActiveUntil?: number; // 15-min drop
}

const STORAGE_KEY = 'mivaj_aura_vault_profile';

export const HARVEST_REWARDS: Record<number, { aura: number; title: string; bonus?: string }> = {
  1: { aura: 50, title: 'Day 1: Street Kickoff' },
  2: { aura: 100, title: 'Day 2: Momentum Builder' },
  3: { aura: 200, title: 'Day 3: Midweek Boost', bonus: '+1 Free Streak Shield 🛡️' },
  4: { aura: 350, title: 'Day 4: High Roller Vibe' },
  5: { aura: 500, title: 'Day 5: Weekend Warmup' },
  6: { aura: 750, title: 'Day 6: VIP Countdown' },
  7: { aura: 1500, title: 'Day 7: The Golden Sunday Jackpot 👑', bonus: '2X Aura Multiplier Badge' },
};

export class AuraVaultEngine {
  private profile: MemberProfile;

  constructor() {
    this.profile = this.loadProfile();
  }

  private loadProfile(): MemberProfile {
    if (typeof window === 'undefined') {
      return this.getDefaultProfile('CyberStriker');
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    const username = localStorage.getItem('aurascore_user_name') || 'baller_' + Math.floor(100 + Math.random() * 900);
    const def = this.getDefaultProfile(username);
    this.saveProfile(def);
    return def;
  }

  private getDefaultProfile(username: string): MemberProfile {
    return {
      username,
      auraBalance: 1450,
      tier: 'BALL_KNOWER',
      streakShields: 1,
      currentHarvestDay: 1,
      lastHarvestTimestamp: 0,
      predictionWinStreak: 4,
      referralCode: 'AURA-' + Math.floor(1000 + Math.random() * 9000),
      totalReferralBonusEarned: 1500,
      downlineWinTaxEarned: 450,
    };
  }

  public saveProfile(p: MemberProfile = this.profile): void {
    this.profile = p;
    this.recalculateTier();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      } catch {}
    }
  }

  public getProfile(): MemberProfile {
    this.recalculateTier();
    return this.profile;
  }

  public recalculateTier(): void {
    const bal = this.profile.auraBalance;
    if (bal >= 20000) {
      this.profile.tier = 'CHIEF_BALLER';
    } else if (bal >= 5000) {
      this.profile.tier = 'AURA_LORD';
    } else if (bal >= 1000) {
      this.profile.tier = 'BALL_KNOWER';
    } else {
      this.profile.tier = 'ROOKIE';
    }
  }

  // 1. Claim Daily Harvest (Streak Retention Loop)
  public claimDailyHarvest(): { success: boolean; reward?: any; error?: string } {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceLast = now - this.profile.lastHarvestTimestamp;

    // Check if cooldown expired (allow immediate claim if first time or 24h passed)
    if (this.profile.lastHarvestTimestamp > 0 && timeSinceLast < oneDayMs) {
      const remainingHours = Math.ceil((oneDayMs - timeSinceLast) / (60 * 60 * 1000));
      return { success: false, error: 'Next Aura Harvest opens in ' + remainingHours + ' hours! Keep your streak active.' };
    }

    // Check streak reset if missed more than 48h
    if (this.profile.lastHarvestTimestamp > 0 && timeSinceLast > 2 * oneDayMs) {
      this.profile.currentHarvestDay = 1;
    }

    const dayReward = HARVEST_REWARDS[this.profile.currentHarvestDay] || HARVEST_REWARDS[1];
    
    // Check Flash Aura multiplier
    const isFlashActive = this.isFlashAuraActive();
    const multiplier = isFlashActive ? 2 : 1;
    const earnedAura = dayReward.aura * multiplier;

    this.profile.auraBalance += earnedAura;
    this.profile.lastHarvestTimestamp = now;

    if (this.profile.currentHarvestDay === 3) {
      this.profile.streakShields += 1;
    }

    // Advance to next day or wrap around 7-day loop
    this.profile.currentHarvestDay = this.profile.currentHarvestDay >= 7 ? 1 : this.profile.currentHarvestDay + 1;
    this.saveProfile();

    return {
      success: true,
      reward: {
        aura: earnedAura,
        title: dayReward.title,
        bonus: dayReward.bonus,
        nextDay: this.profile.currentHarvestDay,
        isFlashActive,
      },
    };
  }

  // 2. Flash Aura 15-Minute Drop
  public triggerFlashAuraDrop(): number {
    const expiresAt = Date.now() + 15 * 60 * 1000;
    this.profile.flashAuraActiveUntil = expiresAt;
    this.saveProfile();
    return expiresAt;
  }

  public isFlashAuraActive(): boolean {
    if (!this.profile.flashAuraActiveUntil) return false;
    return Date.now() < this.profile.flashAuraActiveUntil;
  }

  // 3. Streak Shield Usage (Loss Aversion)
  public protectStreakWithShield(): { protected: boolean; remainingShields: number } {
    if (this.profile.streakShields > 0) {
      this.profile.streakShields -= 1;
      this.saveProfile();
      return { protected: true, remainingShields: this.profile.streakShields };
    }
    return { protected: false, remainingShields: 0 };
  }

  // 4. Multi-Tier Referral & 5% Aura Tax Kickback
  public processDownlineWinKickback(downlineWinAura: number): number {
    const commission = Math.round(downlineWinAura * 0.05); // 5% Aura Tax
    this.profile.auraBalance += commission;
    this.profile.downlineWinTaxEarned += commission;
    this.saveProfile();
    return commission;
  }
}

export const auraVault = new AuraVaultEngine();

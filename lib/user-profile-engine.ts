/**
 * CENTRALIZED USER PROFILE & DATA ENGINE
 * Single source of truth for all user data:
 * - 100% Editable Personal Information (Name, Bio, Contacts, Avatar, Club, City, Birthday)
 * - Complete System & Notification Settings
 * - Viral Club Supporter Pass Engine & Matchday Streaks
 * - XP, Levels & Aura Wallet
 * - Placed Bets & Emoji Reactions
 * - Referral Network
 */

import { calculateLevelFromXp, UserLevelInfo, XP_REWARDS } from './xp-engine';

export interface UserReferralRecord {
  id: string;
  username: string;
  joinedAt: string;
  auraCredited: number;
  xpCredited: number;
  status: 'ACTIVE' | 'PENDING';
}

export interface UserSettings {
  oddsFormat: 'DECIMAL' | 'FRACTIONAL' | 'AMERICAN';
  defaultSport: string;
  timezone: string;
  hapticIntensity: 'HIGH' | 'MEDIUM' | 'OFF';
  soundEffects: boolean;
  notifyTelegramBankers: boolean;
  notifyGoalAlerts: boolean;
  notifyNightlyAudit: boolean;
  twoFactorEnabled: boolean;
}

export interface UserProfileData {
  // Identity & Personal Information (100% Editable)
  username: string;
  fullName: string;
  nickname?: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  telegramHandle: string;
  avatar: string;
  avatarCustomUrl?: string;
  bio: string;
  country: string;
  city: string;
  birthDate: string;

  // Club & Supporter Loyalty (Viral Engine)
  club: string;
  secondaryClub?: string;
  supporterStreakDays: number;
  lastSupporterCheckInDate: string;
  supporterRank: string;

  // Financial & Gamification
  auraBalance: number;
  nairaBalance: number;
  xp: number;
  level: UserLevelInfo;
  vipTier: string;
  memberSince: string;

  // Settings & Preferences
  settings: UserSettings;
  referrals: UserReferralRecord[];
  emojiReactions: Record<string, string[]>;
}

const STORAGE_KEYS = {
  PROFILE: 'mivaj_user_session',
  NICKNAME: 'mivaj_user_nickname',
  XP: 'mivaj_user_xp',
  REACTIONS: 'mivaj_user_emoji_reactions',
  REFERRALS: 'mivaj_user_referrals_list',
  SETTINGS: 'mivaj_user_settings',
};

export const DEFAULT_SETTINGS: UserSettings = {
  oddsFormat: 'DECIMAL',
  defaultSport: 'SOCCER',
  timezone: 'Africa/Lagos (WAT)',
  hapticIntensity: 'HIGH',
  soundEffects: true,
  notifyTelegramBankers: true,
  notifyGoalAlerts: true,
  notifyNightlyAudit: true,
  twoFactorEnabled: false,
};

export const DEFAULT_PROFILE: UserProfileData = {
  username: 'CyberStriker_99',
  fullName: 'Victor Chukwuemeka',
  nickname: 'The Striker',
  avatar: '⚡',
  avatarCustomUrl: '',
  club: 'Arsenal',
  secondaryClub: 'Super Eagles',
  email: 'cyberstriker@mivaj.com',
  phone: '+234 807 201 5725',
  whatsappNumber: '+234 807 201 5725',
  telegramHandle: '@cyberstriker_99',
  bio: 'Certified Arsenal die-hard and Dixon-Coles statistical betting enthusiast. In Arsenal we trust! 🔴⚪',
  country: 'Nigeria',
  city: 'Port Harcourt',
  birthDate: '1998-10-24',

  supporterStreakDays: 14,
  lastSupporterCheckInDate: '',
  supporterRank: 'Certified Die-Hard 🔴⚪',

  auraBalance: 1450,
  nairaBalance: 25000,
  xp: 1250,
  level: calculateLevelFromXp(1250),
  vipTier: 'PLATINUM PRODIGY 👑',
  memberSince: 'Aug 2026',

  settings: DEFAULT_SETTINGS,
  referrals: [],
  emojiReactions: {},
};

export class UserProfileEngine {
  public static getProfile(): UserProfileData {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      let data: any = stored ? JSON.parse(stored) : {};

      const savedNickname = localStorage.getItem(STORAGE_KEYS.NICKNAME);
      const username = data.username || savedNickname || DEFAULT_PROFILE.username;
      const xp = typeof data.xp === 'number' ? data.xp : (Number(localStorage.getItem(STORAGE_KEYS.XP)) || DEFAULT_PROFILE.xp);
      const auraBalance = typeof data.auraBalance === 'number' ? data.auraBalance : (typeof data.aura_balance === 'number' ? data.aura_balance : DEFAULT_PROFILE.auraBalance);
      const nairaBalance = typeof data.nairaBalance === 'number' ? data.nairaBalance : (typeof data.naira_balance === 'number' ? data.naira_balance : DEFAULT_PROFILE.nairaBalance);

      // Load reactions
      const reactionsRaw = localStorage.getItem(STORAGE_KEYS.REACTIONS);
      const emojiReactions = reactionsRaw ? JSON.parse(reactionsRaw) : {};

      // Load referrals
      const referralsRaw = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      const referrals: UserReferralRecord[] = referralsRaw ? JSON.parse(referralsRaw) : [];

      const level = calculateLevelFromXp(xp);

      // Load settings
      const settingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const settings: UserSettings = {
        ...DEFAULT_SETTINGS,
        ...(data.settings || {}),
        ...(settingsRaw ? JSON.parse(settingsRaw) : {}),
      };

      const fullProfile: UserProfileData = {
        username,
        fullName: data.fullName || DEFAULT_PROFILE.fullName,
        nickname: data.nickname || DEFAULT_PROFILE.nickname,
        avatar: data.avatar || DEFAULT_PROFILE.avatar,
        avatarCustomUrl: data.avatarCustomUrl || '',
        club: data.club || DEFAULT_PROFILE.club,
        secondaryClub: data.secondaryClub || DEFAULT_PROFILE.secondaryClub,
        email: data.email || DEFAULT_PROFILE.email,
        phone: data.phone || DEFAULT_PROFILE.phone,
        whatsappNumber: data.whatsappNumber || data.phone || DEFAULT_PROFILE.whatsappNumber,
        telegramHandle: data.telegramHandle || DEFAULT_PROFILE.telegramHandle,
        bio: data.bio || DEFAULT_PROFILE.bio,
        country: data.country || DEFAULT_PROFILE.country,
        city: data.city || DEFAULT_PROFILE.city,
        birthDate: data.birthDate || DEFAULT_PROFILE.birthDate,

        supporterStreakDays: typeof data.supporterStreakDays === 'number' ? data.supporterStreakDays : DEFAULT_PROFILE.supporterStreakDays,
        lastSupporterCheckInDate: data.lastSupporterCheckInDate || '',
        supporterRank: data.supporterRank || `${data.club || 'Arsenal'} Loyalist 🛡️`,

        auraBalance,
        nairaBalance,
        xp,
        level,
        vipTier: level.title + ' ' + level.badge,
        memberSince: data.memberSince || DEFAULT_PROFILE.memberSince,

        settings,
        referrals,
        emojiReactions,
      };

      return fullProfile;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public static updateProfile(partial: Partial<UserProfileData>): UserProfileData {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    const current = this.getProfile();
    const updated: UserProfileData = {
      ...current,
      ...partial,
      settings: {
        ...current.settings,
        ...(partial.settings || {}),
      }
    };

    if (partial.xp !== undefined) {
      updated.level = calculateLevelFromXp(updated.xp);
      updated.vipTier = updated.level.title + ' ' + updated.level.badge;
      localStorage.setItem(STORAGE_KEYS.XP, String(updated.xp));
    }

    if (partial.username) {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, partial.username);
    }

    if (partial.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated.settings));
    }

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

    // Dispatch custom events so every component reacts in real-time
    window.dispatchEvent(new CustomEvent('mivaj_profile_updated', { detail: updated }));
    window.dispatchEvent(new CustomEvent('mivaj_supporter_updated', { detail: { club: updated.club, streak: updated.supporterStreakDays } }));

    return updated;
  }

  public static updateSettings(partialSettings: Partial<UserSettings>): UserSettings {
    const profile = this.getProfile();
    const newSettings: UserSettings = {
      ...profile.settings,
      ...partialSettings,
    };
    this.updateProfile({ settings: newSettings });
    return newSettings;
  }

  /**
   * VIRAL SUPPORTER MATCHDAY CHECK-IN
   * Increments the user's active supporter streak and rewards Aura + XP!
   */
  public static checkInSupporter(clubName?: string): { success: boolean; streak: number; message: string; alreadyCheckedIn: boolean } {
    if (typeof window === 'undefined') return { success: false, streak: 0, message: '', alreadyCheckedIn: false };
    const profile = this.getProfile();
    const todayStr = new Date().toISOString().split('T')[0];

    if (profile.lastSupporterCheckInDate === todayStr) {
      return {
        success: true,
        streak: profile.supporterStreakDays,
        message: `Already checked in today for ${profile.club}! Streak is safe at ${profile.supporterStreakDays} days 🔥`,
        alreadyCheckedIn: true,
      };
    }

    const targetClub = clubName || profile.club || 'Arsenal';
    const newStreak = (profile.supporterStreakDays || 0) + 1;
    const bonusAura = 150;
    const bonusXp = 200;

    let rankTitle = 'Matchday Regular ⚽';
    if (newStreak >= 30) rankTitle = 'Club Hall of Fame Icon 👑';
    else if (newStreak >= 14) rankTitle = 'Certified Die-Hard Supporter 🔥';
    else if (newStreak >= 7) rankTitle = 'Loyal Ultras Member 🛡️';

    const updated = this.updateProfile({
      club: targetClub,
      supporterStreakDays: newStreak,
      lastSupporterCheckInDate: todayStr,
      supporterRank: `${targetClub} ${rankTitle}`,
      auraBalance: profile.auraBalance + bonusAura,
      xp: profile.xp + bonusXp,
    });

    return {
      success: true,
      streak: newStreak,
      message: `🎉 Matchday Check-in confirmed! +${bonusAura} Aura & +${bonusXp} XP earned for supporting ${targetClub}! Current Streak: ${newStreak} Days 🔥`,
      alreadyCheckedIn: false,
    };
  }

  public static addXp(amount: number, reason?: string): UserLevelInfo {
    const current = this.getProfile();
    const newXp = current.xp + amount;
    const newLevel = calculateLevelFromXp(newXp);
    this.updateProfile({ xp: newXp });
    return newLevel;
  }

  public static addAura(amount: number): number {
    const current = this.getProfile();
    const newBal = current.auraBalance + amount;
    this.updateProfile({ auraBalance: newBal });
    return newBal;
  }

  // --- EMOJI REACTION PERSISTENCE ---
  public static getUserReaction(matchId: string): string[] {
    const profile = this.getProfile();
    return profile.emojiReactions[matchId] || [];
  }

  public static toggleReaction(matchId: string, emoji: string): { reacted: boolean; countDelta: number } {
    if (typeof window === 'undefined') return { reacted: false, countDelta: 0 };
    const profile = this.getProfile();
    const currentList = profile.emojiReactions[matchId] || [];
    const exists = currentList.includes(emoji);

    let nextList: string[];
    let delta = 0;
    if (exists) {
      nextList = currentList.filter((e) => e !== emoji);
      delta = -1;
    } else {
      nextList = [...currentList, emoji];
      delta = 1;
      this.addXp(XP_REWARDS.EMOJI_REACTION, 'Emoji reaction on match');
    }

    const updatedReactions = {
      ...profile.emojiReactions,
      [matchId]: nextList,
    };

    localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(updatedReactions));
    this.updateProfile({ emojiReactions: updatedReactions });

    return { reacted: !exists, countDelta: delta };
  }

  // --- REFERRAL SYSTEM ---
  public static getReferrals(): UserReferralRecord[] {
    const profile = this.getProfile();
    return profile.referrals;
  }

  public static addReferral(friendUsername: string): UserReferralRecord {
    const profile = this.getProfile();
    const newRef: UserReferralRecord = {
      id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username: friendUsername.startsWith('@') ? friendUsername : `@${friendUsername}`,
      joinedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      auraCredited: 500,
      xpCredited: XP_REWARDS.REFERRAL_SIGNUP,
      status: 'ACTIVE',
    };

    const updatedList = [newRef, ...profile.referrals];
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(updatedList));

    // Award bonus (+500 Aura & +350 XP)
    this.addAura(500);
    this.addXp(XP_REWARDS.REFERRAL_SIGNUP, `Referral bonus from ${friendUsername}`);

    this.updateProfile({ referrals: updatedList });
    return newRef;
  }
}

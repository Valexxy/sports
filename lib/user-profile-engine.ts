/**
 * CENTRALIZED USER PROFILE & DATA ENGINE
 * Single source of truth for all user data:
 * - Username (edited only in profile)
 * - XP & Levels
 * - Aura Wallet & Rewards
 * - Placed bets
 * - Emoji reactions (persisted across sessions)
 * - Referral network
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

export interface UserProfileData {
  username: string;
  avatar: string;
  club: string;
  email: string;
  phone: string;
  auraBalance: number;
  xp: number;
  level: UserLevelInfo;
  vipTier: string;
  memberSince: string;
  referrals: UserReferralRecord[];
  emojiReactions: Record<string, string[]>; // matchId -> array of emojis user reacted to
}

const STORAGE_KEYS = {
  PROFILE: 'mivaj_user_session',
  NICKNAME: 'mivaj_user_nickname',
  XP: 'mivaj_user_xp',
  REACTIONS: 'mivaj_user_emoji_reactions',
  REFERRALS: 'mivaj_user_referrals_list',
};

const DEFAULT_PROFILE: UserProfileData = {
  username: 'CyberStriker_99',
  avatar: '⚡',
  club: 'Arsenal',
  email: 'cyberstriker@mivaj.com',
  phone: '+234 807 201 5725',
  auraBalance: 1450,
  xp: 1250, // Level 4 Tactician
  level: calculateLevelFromXp(1250),
  vipTier: 'PLATINUM PRODIGY 👑',
  memberSince: 'Aug 2026',
  referrals: [],
  emojiReactions: {},
};

export class UserProfileEngine {
  public static getProfile(): UserProfileData {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      let data: any = stored ? JSON.parse(stored) : {};

      // Ensure username aligns with nickname
      const savedNickname = localStorage.getItem(STORAGE_KEYS.NICKNAME);
      const username = data.username || savedNickname || DEFAULT_PROFILE.username;
      const xp = typeof data.xp === 'number' ? data.xp : (Number(localStorage.getItem(STORAGE_KEYS.XP)) || DEFAULT_PROFILE.xp);
      const auraBalance = typeof data.auraBalance === 'number' ? data.auraBalance : (typeof data.aura_balance === 'number' ? data.aura_balance : DEFAULT_PROFILE.auraBalance);

      // Load reactions
      const reactionsRaw = localStorage.getItem(STORAGE_KEYS.REACTIONS);
      const emojiReactions = reactionsRaw ? JSON.parse(reactionsRaw) : {};

      // Load referrals
      const referralsRaw = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      const referrals: UserReferralRecord[] = referralsRaw ? JSON.parse(referralsRaw) : [];

      const level = calculateLevelFromXp(xp);

      const fullProfile: UserProfileData = {
        username,
        avatar: data.avatar || DEFAULT_PROFILE.avatar,
        club: data.club || DEFAULT_PROFILE.club,
        email: data.email || DEFAULT_PROFILE.email,
        phone: data.phone || DEFAULT_PROFILE.phone,
        auraBalance,
        xp,
        level,
        vipTier: level.title + ' ' + level.badge,
        memberSince: data.memberSince || DEFAULT_PROFILE.memberSince,
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
    };

    if (partial.xp !== undefined) {
      updated.level = calculateLevelFromXp(updated.xp);
      updated.vipTier = updated.level.title + ' ' + updated.level.badge;
      localStorage.setItem(STORAGE_KEYS.XP, String(updated.xp));
    }

    if (partial.username) {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, partial.username);
    }

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

    // Dispatch a custom event so other components on the page react immediately
    window.dispatchEvent(new CustomEvent('mivaj_profile_updated', { detail: updated }));

    return updated;
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
      // Award XP for reacting
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

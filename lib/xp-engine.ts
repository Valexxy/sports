/**
 * MIVAJ SPORTS XP & LEVEL PROGRESSION ENGINE
 * Tracks user experience points, level milestones, and rewards for punter actions.
 */

export interface UserLevelInfo {
  level: number;
  title: string;
  badge: string;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export const LEVEL_MILESTONES = [
  { level: 1, title: 'ROOKIE PUNTER', badge: '🌱', minXp: 0, maxXp: 200 },
  { level: 2, title: 'PROSPECT STRIKER', badge: '⚽', minXp: 201, maxXp: 500 },
  { level: 3, title: 'RISING STAR', badge: '⚡', minXp: 501, maxXp: 1000 },
  { level: 4, title: 'TACTICAL MASTER', badge: '🧠', minXp: 1001, maxXp: 2000 },
  { level: 5, title: 'HIGH ROLLER', badge: '🔥', minXp: 2001, maxXp: 3500 },
  { level: 6, title: 'ELITE ANALYST', badge: '💎', minXp: 3501, maxXp: 6000 },
  { level: 7, title: 'PLATINUM PRODIGY', badge: '👑', minXp: 6001, maxXp: 10000 },
  { level: 8, title: 'STADIUM LEGEND', badge: '🏆', minXp: 10001, maxXp: 999999 },
];

export const XP_REWARDS = {
  DAILY_CHECKIN: 25,
  PLACE_BET: 20,
  WON_BET: 100,
  EMOJI_REACTION: 5,
  BIRTHDAY_WISH: 15,
  SHARE_SLIP: 15,
  REFERRAL_SIGNUP: 350, // Referrals are primary XP & Aura earner
  PROFILE_UPDATE: 20,
};

export function calculateLevelFromXp(xp: number): UserLevelInfo {
  const current = LEVEL_MILESTONES.find((m) => xp >= m.minXp && xp <= m.maxXp) || LEVEL_MILESTONES[0];
  const range = current.maxXp - current.minXp;
  const inLevel = Math.max(0, xp - current.minXp);
  const progressPercent = Math.min(100, Math.round((inLevel / (range || 1)) * 100));

  return {
    level: current.level,
    title: current.title,
    badge: current.badge,
    currentXp: xp,
    nextLevelXp: current.maxXp,
    progressPercent,
  };
}

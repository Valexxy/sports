/**
 * MIVAJ SPORTS TELEGRAM VIRAL REFERRAL ENGINE
 * Implements exponential viral mechanics (K-factor > 1.2)
 * to scale @mivajsport from thousands to 100,000+ active members.
 */

export interface TelegramReferralProfile {
  userId: string;
  username: string;
  referralCode: string;
  referralLink: string;
  totalInvited: number;
  unlockedTiers: string[];
}

export const TELEGRAM_CHANNEL_HANDLE = 'mivajsport';
export const TELEGRAM_CHANNEL_URL = 'https://t.me/mivajsport';
export const TELEGRAM_BOT_URL = 'https://t.me/mivajsport_bot';

export function generateTelegramReferralLink(userIdentifier: string): string {
  const cleanId = encodeURIComponent(userIdentifier.trim().toLowerCase());
  return `${TELEGRAM_CHANNEL_URL}?start=ref_${cleanId}`;
}

export const VIRAL_GROWTH_TIERS = [
  { invitesRequired: 1, reward: '🔓 Verified Referee Ledger Early Whistle Alerts' },
  { invitesRequired: 3, reward: '🔥 Ultra-Banker 88%+ Model Prediction Slip' },
  { invitesRequired: 5, reward: '👑 Master Oracle Private Telegram VIP Lounge' },
  { invitesRequired: 10, reward: '💰 Entry into Monthly ₦1,000,000 Cash Pool' },
];

export const HIGH_CONVERTING_TELEGRAM_HOOKS = [
  {
    hookTitle: '🔥 The 3-Hour Matchday Lock',
    copy: `🚨 TODAY'S ULTRA-BANKER IS READY (88% Poisson Confidence)!\n\nWe don't post banker slips publicly on social media to protect the odds. Access today's full referee-audited slip exclusively inside our official Telegram channel:\n\n👉 Join Free: https://t.me/mivajsport\n\n(Over 50,000+ smart football fans are already inside!)`,
  },
  {
    hookTitle: '⚡ Sub-Second Live Goal Heartbeats',
    copy: `⚽ GOAL ALERTS FASTER THAN YOUR TV STREAM!\n\nExperience sub-second live score haptics, hospital ward injury wires, and verified referee audits directly on your phone.\n\n👉 Tap to Join @mivajsport on Telegram Free: https://t.me/mivajsport`,
  },
  {
    hookTitle: '🎁 Viral Invite & Win Giveaway',
    copy: `🏆 MIVAJ TELEGRAM INVITATIONAL: Win ₦500,000 in Cash & iPhone 16!\n\n1. Join @mivajsport on Telegram\n2. Grab your unique referral link from our bot\n3. Share with 3 football friends to unlock VIP Oracle Bankers!\n\n👉 Start Here: https://t.me/mivajsport`,
  },
];

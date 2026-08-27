export interface CpaAffiliateOffer {
  id: string;
  name: string;
  category: 'SPORTSBOOK' | 'CRYPTO_CASINO' | 'CONTENT_LOCKER';
  logo: string;
  affiliateUrl: string;
  badge: string;
  bonusText: string;
  estPayoutCpa: string; // e.g. '$35 - $300'
  rating: number;
  perks: string[];
  ctaText: string;
}

export const TOP_CPA_AFFILIATES: CpaAffiliateOffer[] = [
  {
    id: 'STAKE_VIP',
    name: 'Stake.com VIP',
    category: 'CRYPTO_CASINO',
    logo: '👑',
    affiliateUrl: 'https://stake.com/?c=bPn8D0iA',
    badge: 'HIGHEST VIP PAYOUT',
    bonusText: '200% Deposit Bonus up to $3,000 + Daily VIP Rakeback',
    estPayoutCpa: '$150 - $450 CPA',
    rating: 9.9,
    perks: ['Instant Crypto & OPay Deposits', 'Zero Withdrawal Limits', '100% Slip Acceptance'],
    ctaText: 'Claim $3,000 Bonus on Stake'
  },
  {
    id: '22BET_AFRICA',
    name: '22Bet Sports',
    category: 'SPORTSBOOK',
    logo: '⚡',
    affiliateUrl: 'https://22bet.ng/?tag=d_972744m_97c_',
    badge: 'BEST NIGERIA / AFRICA CPA',
    bonusText: '100% First Deposit Match up to ₦130,000',
    estPayoutCpa: '$35 - $60 CPA',
    rating: 9.8,
    perks: ['Fast Bank Transfer & OPay', 'Over 1,500 Daily Live Markets', 'High Accumulator Odds'],
    ctaText: 'Claim ₦130,000 Bonus on 22Bet'
  },
  {
    id: 'SPORTYBET_MEGA',
    name: 'SportyBet',
    category: 'SPORTSBOOK',
    logo: '🔥',
    affiliateUrl: 'https://sportybet.com/ng?ref=aurascore',
    badge: 'MOST VIRAL VOLUME',
    bonusText: '1,000% Dynamic Multi-Bet Win Boost',
    estPayoutCpa: '$25 - $40 CPA',
    rating: 9.7,
    perks: ['Fastest Mobile Cashout', 'Instant Booking Code Load', 'Zero Data App'],
    ctaText: 'Bet on SportyBet'
  },
  {
    id: 'BET9JA_TITAN',
    name: 'Bet9ja Nigeria',
    category: 'SPORTSBOOK',
    logo: '🦅',
    affiliateUrl: 'https://sports.bet9ja.com?ref=aurascore',
    badge: '#1 NIGERIAN BOOKMAKER',
    bonusText: '170% Multiple Boost + ₦100,000 Welcome Bonus',
    estPayoutCpa: '$30 - $50 CPA',
    rating: 9.6,
    perks: ['Largest Local Retail Network', 'Cut 1 Cashout Insurance', 'Live Streaming'],
    ctaText: 'Claim Boost on Bet9ja'
  },
  {
    id: '1XBET_GLOBAL',
    name: '1xBet Global',
    category: 'SPORTSBOOK',
    logo: '💎',
    affiliateUrl: 'https://1xbet.ng?ref=aurascore',
    badge: '300% FIRST DEPOSIT',
    bonusText: '300% Welcome Package up to ₦145,600',
    estPayoutCpa: '$40 - $80 CPA',
    rating: 9.7,
    perks: ['Massive Worldwide Markets', 'Advancebet Feature', '60+ Deposit Methods'],
    ctaText: 'Claim 300% on 1xBet'
  }
];

export const SMARTLINK_CONFIG = {
  monetagDirectLink: 'https://5gvci.com/4/11643531', // Monetag High-CPM SmartLink
  cpaGripLockerUrl: 'https://www.cpagrip.com/show.php?l=0&u=aurascore',
  telegramVipChannel: 'https://t.me/mivajsport',
  enableSmartlinkOnCopy: true,
  enableInterstitialLocker: true
};

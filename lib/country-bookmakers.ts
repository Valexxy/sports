'use client';

export interface CountryBookmaker {
  id: string;
  name: string;
  badge: string;
  currency: string;
  currencySymbol: string;
  country: string;
  countryCode: string;
  bonusText: string;
  color: string;
  homeMultiplier: number;
  drawMultiplier: number;
  awayMultiplier: number;
}

export function getCountrySpecificBookmakers(countryCode: string = 'NG', city: string = ''): CountryBookmaker[] {
  const code = (countryCode || 'NG').toUpperCase();

  if (code === 'NG' || code === 'NIGERIA') {
    return [
      {
        id: 'bet9ja',
        name: 'Bet9ja Nigeria',
        badge: '👑 #1 in Nigeria',
        currency: 'NGN',
        currencySymbol: '₦',
        country: 'Nigeria',
        countryCode: 'NG',
        bonusText: '100% Welcome Bonus up to ₦100,000',
        color: '#10b981',
        homeMultiplier: 1.0,
        drawMultiplier: 1.0,
        awayMultiplier: 1.0,
      },
      {
        id: 'sportybet',
        name: 'SportyBet NG',
        badge: '⚡ Instant Cashout',
        currency: 'NGN',
        currencySymbol: '₦',
        country: 'Nigeria',
        countryCode: 'NG',
        bonusText: '1000% Boost on Accas',
        color: '#ef4444',
        homeMultiplier: 1.02,
        drawMultiplier: 0.99,
        awayMultiplier: 1.01,
      },
      {
        id: '1xbet_ng',
        name: '1xBet Nigeria',
        badge: '🔥 Highest Odds',
        currency: 'NGN',
        currencySymbol: '₦',
        country: 'Nigeria',
        countryCode: 'NG',
        bonusText: '300% First Deposit Bonus',
        color: '#3b82f6',
        homeMultiplier: 1.03,
        drawMultiplier: 1.01,
        awayMultiplier: 1.02,
      },
      {
        id: 'betway_ng',
        name: 'Betway NG',
        badge: '🛡️ Official EPL Partner',
        currency: 'NGN',
        currencySymbol: '₦',
        country: 'Nigeria',
        countryCode: 'NG',
        bonusText: 'Free Bet up to ₦20,000',
        color: '#22c55e',
        homeMultiplier: 1.01,
        drawMultiplier: 1.0,
        awayMultiplier: 1.01,
      },
    ];
  }

  if (code === 'GB' || code === 'UK' || code === 'ENGLAND') {
    return [
      {
        id: 'bet365_uk',
        name: 'Bet365 UK',
        badge: '👑 UK #1 Live In-Play',
        currency: 'GBP',
        currencySymbol: '£',
        country: 'United Kingdom',
        countryCode: 'GB',
        bonusText: 'Bet £10 Get £30 in Free Bets',
        color: '#047857',
        homeMultiplier: 1.0,
        drawMultiplier: 1.0,
        awayMultiplier: 1.0,
      },
      {
        id: 'skybet',
        name: 'SkyBet UK',
        badge: '⚡ Super 6 Active',
        currency: 'GBP',
        currencySymbol: '£',
        country: 'United Kingdom',
        countryCode: 'GB',
        bonusText: '£30 in Free Bets on £10 Stake',
        color: '#0284c7',
        homeMultiplier: 1.01,
        drawMultiplier: 0.98,
        awayMultiplier: 1.02,
      },
      {
        id: 'paddypower',
        name: 'Paddy Power',
        badge: '🎯 Money Back as Free Bet',
        currency: 'GBP',
        currencySymbol: '£',
        country: 'United Kingdom',
        countryCode: 'GB',
        bonusText: 'Money Back if 1 Leg Fails',
        color: '#15803d',
        homeMultiplier: 1.02,
        drawMultiplier: 1.01,
        awayMultiplier: 1.0,
      },
    ];
  }

  if (code === 'US' || code === 'USA' || code === 'UNITED STATES') {
    return [
      {
        id: 'draftkings',
        name: 'DraftKings Sportsbook',
        badge: '👑 US #1 Odds',
        currency: 'USD',
        currencySymbol: '$',
        country: 'United States',
        countryCode: 'US',
        bonusText: 'Bet $5 Get $150 Instantly',
        color: '#22c55e',
        homeMultiplier: 1.02,
        drawMultiplier: 1.0,
        awayMultiplier: 1.01,
      },
      {
        id: 'fanduel',
        name: 'FanDuel Sportsbook',
        badge: '⚡ Same Game Parlay+',
        currency: 'USD',
        currencySymbol: '$',
        country: 'United States',
        countryCode: 'US',
        bonusText: 'No Sweat First Bet up to $1,000',
        color: '#3b82f6',
        homeMultiplier: 1.01,
        drawMultiplier: 1.01,
        awayMultiplier: 1.0,
      },
      {
        id: 'betmgm',
        name: 'BetMGM',
        badge: '🦁 King of Sportsbooks',
        currency: 'USD',
        currencySymbol: '$',
        country: 'United States',
        countryCode: 'US',
        bonusText: 'Up to $1,500 Back in Bonus Bets',
        color: '#eab308',
        homeMultiplier: 1.03,
        drawMultiplier: 0.99,
        awayMultiplier: 1.02,
      },
    ];
  }

  // Global Default (Europe / Africa / Asia / Americas)
  return [
    {
      id: 'bet365_global',
      name: 'Bet365 Global',
      badge: '👑 Worldwide Edge',
      currency: 'USD',
      currencySymbol: '$',
      country: 'Global',
      countryCode: 'GLOBAL',
      bonusText: 'Up to $30 in Bet Credits',
      color: '#047857',
      homeMultiplier: 1.0,
      drawMultiplier: 1.0,
      awayMultiplier: 1.0,
    },
    {
      id: '1xbet_global',
      name: '1xBet Worldwide',
      badge: '🔥 Global Multi-Odds',
      currency: 'USD',
      currencySymbol: '$',
      country: 'Global',
      countryCode: 'GLOBAL',
      bonusText: '100% Deposit Match',
      color: '#3b82f6',
      homeMultiplier: 1.03,
      drawMultiplier: 1.01,
      awayMultiplier: 1.02,
    },
    {
      id: 'unibet',
      name: 'Unibet',
      badge: '🛡️ By Players For Players',
      currency: 'EUR',
      currencySymbol: '€',
      country: 'Global',
      countryCode: 'GLOBAL',
      bonusText: 'Money Back on First Bet',
      color: '#22c55e',
      homeMultiplier: 1.01,
      drawMultiplier: 1.0,
      awayMultiplier: 1.01,
    },
  ];
}

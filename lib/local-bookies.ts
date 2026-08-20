/**
 * TIMEZONE-LOCALIZED BOOKMAKERS RECOMMENDER ENGINE
 * Dynamically pairs sports fans with top localized sportsbooks based on location/timezone.
 */

export interface LocalBookie {
  name: string;
  flag: string;
  bonus: string;
  url: string;
}

export function getLocalBookiesForTimezone(timezone: string): LocalBookie[] {
  if (timezone.includes('Lagos') || timezone.includes('Africa')) {
    return [
      { name: 'SportyBet ⚡', flag: '🇳🇬', bonus: '150% Welcome Bonus', url: 'https://www.sportybet.com' },
      { name: 'Bet9ja 🇳🇬', flag: '🇳🇬', bonus: '100% Deposit Bonus', url: 'https://www.bet9ja.com' },
      { name: '1xBet ⚡', flag: '🌍', bonus: '200% Bonus Code', url: 'https://1xbet.com' },
      { name: 'MSport 🚀', flag: '🇳🇬', bonus: '₦500k Voucher', url: 'https://www.msport.com' },
    ];
  }

  if (timezone.includes('Nairobi') || timezone.includes('Kenya')) {
    return [
      { name: 'SportPesa 🇰🇪', flag: '🇰🇪', bonus: 'Jackpot Bonus', url: 'https://www.ke.sportpesa.com' },
      { name: 'Betika 🇰🇪', flag: '🇰🇪', bonus: 'KSh 1000 Bonus', url: 'https://www.betika.com' },
    ];
  }

  if (timezone.includes('London') || timezone.includes('Europe')) {
    return [
      { name: 'Bet365 🇬🇧', flag: '🇬🇧', bonus: 'Bet £10 Get £30', url: 'https://www.bet365.com' },
      { name: 'SkyBet 🇬🇧', flag: '🇬🇧', bonus: '£30 Free Bets', url: 'https://m.skybet.com' },
      { name: 'William Hill', flag: '🇬🇧', bonus: '£40 Welcome Offer', url: 'https://www.williamhill.com' },
    ];
  }

  if (timezone.includes('America') || timezone.includes('New_York')) {
    return [
      { name: 'DraftKings 🇺🇸', flag: '🇺🇸', bonus: 'Bet $5 Get $200', url: 'https://www.draftkings.com' },
      { name: 'FanDuel 🇺🇸', flag: '🇺🇸', bonus: '$150 Bonus Bets', url: 'https://www.fanduel.com' },
    ];
  }

  return [
    { name: 'SportyBet ⚡', flag: '🌍', bonus: 'Top Global Odds', url: 'https://www.sportybet.com' },
    { name: '1xBet ⚡', flag: '🌍', bonus: 'Best Odds Edge', url: 'https://1xbet.com' },
  ];
}

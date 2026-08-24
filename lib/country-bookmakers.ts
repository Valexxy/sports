export interface CountryBookmaker {
  name: string;
  flag: string;
  badge: string;
  bonus: string;
  url: string;
  color: string;
  status: 'ACTIVE' | 'CONNECTING';
}

export function getCountrySpecificBookmakers(countryCode: string = 'NG', _city?: string): CountryBookmaker[] {
  return [
    {
      name: 'Stake.com VIP',
      flag: '⚡🌍',
      badge: 'VERIFIED #1 PARTNER',
      bonus: '200% Deposit Match + Instant Crypto Payouts',
      url: 'https://stake.com/?c=bPn8D0iA',
      color: 'from-emerald-600 to-teal-800',
      status: 'ACTIVE',
    },
    {
      name: '22Bet Nigeria',
      flag: '🇳🇬⚽',
      badge: 'TOP NAIJA ODDS',
      bonus: '₦130,000 Welcome Bonus on 1st Deposit',
      url: 'https://22bet.com.ng/?tag=972744',
      color: 'from-cyan-600 to-blue-800',
      status: 'ACTIVE',
    },
    {
      name: 'SportyBet',
      flag: '⚡🇳🇬',
      badge: 'GATEWAY CONNECTING',
      bonus: 'Fastest 5-Sec Cashout in Nigeria',
      url: 'https://stake.com/?c=bPn8D0iA',
      color: 'from-red-600 to-rose-800',
      status: 'CONNECTING',
    },
    {
      name: 'Bet9ja',
      flag: '🇳🇬👑',
      badge: 'GATEWAY CONNECTING',
      bonus: '₦100,000 Match Bonus + Cut-1 Protection',
      url: 'https://22bet.com.ng/?tag=972744',
      color: 'from-green-600 to-emerald-900',
      status: 'CONNECTING',
    },
  ];
}

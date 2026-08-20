export interface SportsNewsItem {
  id: string;
  title: string;
  summary: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS' | 'MMA';
  category: 'BREAKING' | 'TRANSFERS' | 'INJURY' | 'TACTICAL';
  source: string;
  timeAgo: string;
  imageEmoji: string;
  readTime: string;
}

export const MOCK_SPORTS_NEWS: SportsNewsItem[] = [
  {
    id: 'n1',
    title: 'Arsenal Finalizing Record Midfield Signings Before Transfer Window Closes',
    summary: 'Mikel Arteta confirms high-velocity tactical adjustments ahead of the London derby with key attacking reinforcements.',
    sport: 'SOCCER',
    category: 'TRANSFERS',
    source: 'Sky Sports',
    timeAgo: '12m ago',
    imageEmoji: '⚽🔴',
    readTime: '2 min read',
  },
  {
    id: 'n2',
    title: 'Real Madrid Injury Boost: Star Attacker Returns to Full Training Before UCL Clash',
    summary: 'Medical team gives full clearance following intensive rehabilitation ahead of mid-week European championship fixture.',
    sport: 'SOCCER',
    category: 'INJURY',
    source: 'Fabrizio Romano',
    timeAgo: '35m ago',
    imageEmoji: '⚪🇪🇸',
    readTime: '3 min read',
  },
  {
    id: 'n3',
    title: 'Boston Celtics Drop 120-Point Masterclass in Game 4 NBA Playoff Thriller',
    summary: 'High-percentage shooting from beyond the arc secures crucial home court advantage in eastern conference showdown.',
    sport: 'BASKETBALL',
    category: 'BREAKING',
    source: 'ESPN NBA',
    timeAgo: '1h ago',
    imageEmoji: '🏀☘️',
    readTime: '4 min read',
  },
  {
    id: 'n4',
    title: 'Alcaraz Storms Into Grand Slam Semifinals With Straight-Set Masterclass',
    summary: 'Dominant first-serve percentage and baseline rallies seal victory in 2-hour tennis thriller.',
    sport: 'TENNIS',
    category: 'TACTICAL',
    source: 'ATP Tour',
    timeAgo: '2h ago',
    imageEmoji: '🎾🇪🇸',
    readTime: '3 min read',
  },
  {
    id: 'n5',
    title: 'Enyimba FC Reclaims Top Spot in NPFL After Commanding 2-0 Victory',
    summary: 'Solid defensive structure and early first-half goals propel Aba giants to the summit of Nigerian football.',
    sport: 'SOCCER',
    category: 'BREAKING',
    source: 'NPFL News',
    timeAgo: '3h ago',
    imageEmoji: '🇳🇬🔵',
    readTime: '2 min read',
  },
];

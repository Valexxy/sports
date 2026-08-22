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

/**
 * Real football news is served via `/api/news` (BBC/Sky/NYT RSS).
 * This module intentionally exports NO fabricated articles.
 */

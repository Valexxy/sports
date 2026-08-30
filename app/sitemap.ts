import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mivaj.com';
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/standings`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/injuries`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/transfers`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/birthdays`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/converter`, lastModified: now, changeFrequency: 'daily', priority: 0.92 },
    { url: `${baseUrl}/settlement`, lastModified: now, changeFrequency: 'hourly', priority: 0.90 },
    { url: `${baseUrl}/clubs`, lastModified: now, changeFrequency: 'daily', priority: 0.90 },
    { url: `${baseUrl}/players`, lastModified: now, changeFrequency: 'daily', priority: 0.90 },
    { url: `${baseUrl}/dashboard`, lastModified: now, changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/arbitrage`, lastModified: now, changeFrequency: 'daily', priority: 0.80 },
    { url: `${baseUrl}/bankroll`, lastModified: now, changeFrequency: 'daily', priority: 0.80 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: 'daily', priority: 0.80 },
    { url: `${baseUrl}/vip`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/challenge`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'weekly', priority: 0.60 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${baseUrl}/responsible-gaming`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
  ];
}

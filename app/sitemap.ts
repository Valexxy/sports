import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mivaj.com';
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/dashboard`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/admin`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/arbitrage`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/bankroll`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/settlement`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/responsible-gaming`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}

import { MetadataRoute } from 'next';
import { getRealLiveAndPlayedMatches, normalizeTeamKey } from '../lib/real-sports-stream';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getRealLiveAndPlayedMatches();
  
  const dynamicRoutes = matches.map((match) => ({
    url: `https://mivaj.com/predictions/${normalizeTeamKey(match.homeTeam)}-vs-${normalizeTeamKey(match.awayTeam)}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://mivaj.com', lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    ...dynamicRoutes
  ];
}

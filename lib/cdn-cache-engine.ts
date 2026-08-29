/**
 * MIVAJ SPORTS CDN & EDGE CACHING ENGINE
 * Configures Cloudflare Edge Cache, Statically & jsDelivr CDN routing
 * to prevent Vercel bandwidth exhaustion and eliminate serverless execution limits.
 */

export interface CacheRuleDefinition {
  pathPattern: string;
  edgeTtlSeconds: number;
  browserTtlSeconds: number;
  staleWhileRevalidateSeconds: number;
  purpose: string;
}

export const CDN_CACHE_MATRIX: CacheRuleDefinition[] = [
  {
    pathPattern: '/api/matches',
    edgeTtlSeconds: 25,
    browserTtlSeconds: 10,
    staleWhileRevalidateSeconds: 60,
    purpose: 'Shields Vercel from peak live score polling spikes',
  },
  {
    pathPattern: '/api/v1/standings*',
    edgeTtlSeconds: 1800, // 30 mins
    browserTtlSeconds: 300,
    staleWhileRevalidateSeconds: 3600,
    purpose: 'Caches ESPN core table feeds at Cloudflare 300+ edge nodes',
  },
  {
    pathPattern: '/api/v1/injuries*',
    edgeTtlSeconds: 3600, // 1 hour
    browserTtlSeconds: 600,
    staleWhileRevalidateSeconds: 7200,
    purpose: 'Caches FPL medical wire across all worldwide regions',
  },
  {
    pathPattern: '/api/v1/transfers*',
    edgeTtlSeconds: 3600, // 1 hour
    browserTtlSeconds: 600,
    staleWhileRevalidateSeconds: 7200,
    purpose: 'Caches transfer transactions and market valuations',
  },
  {
    pathPattern: '/api/v1/birthdays*',
    edgeTtlSeconds: 43200, // 12 hours
    browserTtlSeconds: 3600,
    staleWhileRevalidateSeconds: 86400,
    purpose: 'Shields Wikipedia & TheSportsDB almanac lookups',
  },
  {
    pathPattern: '/_next/static/*',
    edgeTtlSeconds: 31536000, // 1 year (immutable)
    browserTtlSeconds: 31536000,
    staleWhileRevalidateSeconds: 0,
    purpose: 'Offloads 100% of Next.js JS/CSS chunks to Cloudflare CDN',
  },
];

export function getCdnHeaders(ruleType: 'MATCHES' | 'STANDINGS' | 'INJURIES' | 'TRANSFERS' | 'BIRTHDAYS' | 'STATIC'): Record<string, string> {
  const ruleMap: Record<string, { sMaxAge: number; swr: number }> = {
    MATCHES: { sMaxAge: 25, swr: 60 },
    STANDINGS: { sMaxAge: 1800, swr: 3600 },
    INJURIES: { sMaxAge: 3600, swr: 7200 },
    TRANSFERS: { sMaxAge: 3600, swr: 7200 },
    BIRTHDAYS: { sMaxAge: 43200, swr: 86400 },
    STATIC: { sMaxAge: 31536000, swr: 0 },
  };

  const selected = ruleMap[ruleType] || ruleMap.MATCHES;

  return {
    'Cache-Control': `public, s-maxage=${selected.sMaxAge}, stale-while-revalidate=${selected.swr}`,
    'CDN-Cache-Control': `public, max-age=${selected.sMaxAge}`,
    'Cloudflare-CDN-Cache-Control': `public, max-age=${selected.sMaxAge}`,
    'X-CDN-Provider': 'Cloudflare Global Anycast Edge',
    'X-Ecosystem': 'Mivaj Sports AI',
  };
}

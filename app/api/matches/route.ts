import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';

import { getCdnHeaders } from '../../../lib/cdn-cache-engine';

// In-memory process cache to guarantee instant < 5ms response
let inMemoryCache: { data: any[]; timestamp: number } | null = null;
const MEMORY_CACHE_TTL_MS = 30 * 1000; // 30 seconds

export const dynamic = 'force-dynamic';

// Cloudflare & Vercel edge cache headers
const EDGE_HEADERS = getCdnHeaders('MATCHES');

export async function GET() {
  try {
    const now = Date.now();

    // If cache is fresh, return immediately (< 5ms)
    if (inMemoryCache && (now - inMemoryCache.timestamp) < MEMORY_CACHE_TTL_MS && inMemoryCache.data.length > 0) {
      return NextResponse.json({
        success: true,
        count: inMemoryCache.data.length,
        source: 'memory_hot',
        matches: inMemoryCache.data,
      }, { headers: EDGE_HEADERS });
    }

    // Fetch matches
    const matches = await getRealLiveAndPlayedMatches();

    if (matches && matches.length > 0) {
      inMemoryCache = { data: matches, timestamp: now };
      return NextResponse.json({
        success: true,
        count: matches.length,
        source: 'origin_fresh',
        matches,
      }, { headers: EDGE_HEADERS });
    }

    // If fetch returned empty but we have stale cache, return stale cache
    if (inMemoryCache && inMemoryCache.data.length > 0) {
      return NextResponse.json({
        success: true,
        count: inMemoryCache.data.length,
        source: 'memory_stale',
        matches: inMemoryCache.data,
      }, { headers: EDGE_HEADERS });
    }

    return NextResponse.json({ success: true, count: 0, source: 'empty', matches: [] }, { headers: EDGE_HEADERS });
  } catch (err: any) {
    if (inMemoryCache && inMemoryCache.data.length > 0) {
      return NextResponse.json({
        success: true,
        count: inMemoryCache.data.length,
        source: 'fallback',
        matches: inMemoryCache.data,
      }, { headers: EDGE_HEADERS });
    }
    return NextResponse.json({ success: false, error: err.message, matches: [] }, { status: 500 });
  }
}


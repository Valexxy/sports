/**
 * PRIVACY-FIRST ANALYTICS ENGINE (Google Analytics-free)
 * Lightweight, cookieless, GDPR-friendly usage metrics stored in Upstash Redis.
 *
 * No third-party trackers, no cross-site cookies, no fingerprinting. We only
 * record anonymous, aggregated counts: page views, unique visitors (by a
 * rotating daily session id), active sports, and referral campaign touches.
 */

import { redisClient } from './upstash-redis-engine';

const PREFIX = 'aurascore:metrics';

// A per-day counter prefix so each metric is naturally time-bucketed by UTC date.
function dateKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export type MetricName =
  | 'pageview'
  | 'unique_visitor'
  | 'match_view'
  | 'prediction_click'
  | 'follow_click'
  | 'push_subscribe'
  | 'push_sent'
  | 'translation_used';

async function increment(key: string, delta = 1): Promise<void> {
  try {
    await redisClient.incrby(key, delta);
    // Keep hot counters around for analysis, then expire after 180 days.
    await redisClient.expire(key, 60 * 60 * 24 * 180);
  } catch (err) {
    console.warn('[metrics] increment error:', err);
  }
}

export async function trackEvent(name: MetricName, extra?: { sessionId?: string }): Promise<void> {
  const day = dateKey();
  await increment(`${PREFIX}:${day}:${name}`);

  // Unique visitors tracked by session id set.
  if (extra?.sessionId) {
    try {
      await redisClient.sadd(`${PREFIX}:${day}:unique_visitors`, extra.sessionId);
      await redisClient.expire(`${PREFIX}:${day}:unique_visitors`, 60 * 60 * 24 * 30);
    } catch {}
  }
}

export async function trackPageView(sessionId?: string): Promise<void> {
  await trackEvent('pageview');
  if (sessionId) await trackEvent('unique_visitor', { sessionId });
}

export async function trackMatchView(sessionId?: string): Promise<void> {
  await increment(`${PREFIX}:${dateKey()}:match_view`);
}

export async function getTodayMetrics(): Promise<Record<string, number>> {
  const day = dateKey();
  const metrics: Record<string, number> = {
    pageviews: 0,
    unique_visitors: 0,
    match_views: 0,
  };

  try {
    const [pv, uv, mv] = await Promise.all([
      redisClient.get<number>(`${PREFIX}:${day}:pageview`),
      redisClient.scard(`${PREFIX}:${day}:unique_visitors`),
      redisClient.get<number>(`${PREFIX}:${day}:match_view`),
    ]);
    metrics.pageviews = pv || 0;
    metrics.unique_visitors = uv || 0;
    metrics.match_views = mv || 0;
  } catch (err) {
    console.warn('[metrics] getTodayMetrics error:', err);
  }

  return metrics;
}

export interface MetricsSeries {
  labels: string[];
  values: number[];
}

/** Returns a 14-day pageview time-series for charts. */
export async function getPageviewsSeries(days = 14): Promise<MetricsSeries> {
  const labels: string[] = [];
  const values: number[] = [];

  try {
    const pipeline = redisClient.pipeline();
    const keys: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const key = `${PREFIX}:${d.toISOString().slice(0, 10)}:pageview`;
      keys.push(d.toISOString().slice(0, 10));
      pipeline.get(key);
    }
    const results = await pipeline.exec();
    results.forEach((res, idx) => {
      labels.push(keys[idx].slice(5)); // MM-DD
      values.push(typeof res === 'number' ? res : 0);
    });
  } catch {
    // fallback to zeros
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      labels.push(d.toISOString().slice(5, 10));
      values.push(0);
    }
  }

  return { labels, values };
}
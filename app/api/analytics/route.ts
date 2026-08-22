import { NextResponse } from 'next/server';
import {
  trackEvent,
  trackPageView,
  getTodayMetrics,
  getPageviewsSeries,
  MetricName,
} from '../../../lib/privacy-analytics-engine';
import { getSubscriptionCount } from '../../../lib/push-subscription-store';

export const dynamic = 'force-dynamic';

/**
 * POST -> record an anonymous privacy-first analytics event (no GA)
 * GET  -> read today's aggregates + a 14-day pageview series (admin dashboard)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name as MetricName) || 'pageview';
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : undefined;

    if (name === 'pageview') {
      await trackPageView(sessionId);
    } else {
      await trackEvent(name, sessionId ? { sessionId } : undefined);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const [today, series, pushSubs] = await Promise.all([
      getTodayMetrics(),
      getPageviewsSeries(14),
      getSubscriptionCount(),
    ]);

    return NextResponse.json({
      success: true,
      today,
      series,
      pushSubscriptions: pushSubs,
    });
  } catch (err: any) {
    console.error('/api/analytics error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
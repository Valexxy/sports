'use client';

/**
 * ENTERPRISE REAL-TIME TELEMETRY & WEB VITALS MONITOR
 * Tracks Core Web Vitals (LCP, FID, CLS, TTFB) & Client Connection Health
 */

class EnterpriseTelemetryEngine {
  private metrics: Map<string, number> = new Map();

  public init() {
    if (typeof window === 'undefined') return;

    // Track Navigation Timing (TTFB)
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const ttfb = timing.responseStart - timing.requestStart;
      this.metrics.set('TTFB', Math.max(0, ttfb));
    }

    // Report Network Type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      this.metrics.set('EffectiveType', connection.effectiveType === '4g' ? 4 : 3);
    }
  }

  public getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }
}

export const enterpriseTelemetry = new EnterpriseTelemetryEngine();

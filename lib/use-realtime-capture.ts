'use client';

import { useState, useEffect, useCallback } from 'react';
import { phoneHardware } from './phone-hardware-engine';
import { stadiumAudio } from './sound-synthesizer';

export interface StreamTelemetry {
  isConnected: boolean;
  latencyMs: number;
  packetsPerMin: string;
  lastTickTime: number;
  protocol: string;
  activeIngestionFeeds: string[];
}

export function useRealtimeCapture() {
  const [telemetry, setTelemetry] = useState<StreamTelemetry>({
    isConnected: false,
    latencyMs: 16,
    packetsPerMin: '1,420 pkts/min',
    lastTickTime: Date.now(),
    protocol: 'SSE-Edge-v2.5',
    activeIngestionFeeds: ['ESPN-CDN', 'BBC-LiveWire', 'Open-Meteo', 'TheSportsDB'],
  });

  const [liveStreamEvents, setLiveStreamEvents] = useState<any[]>([]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/stream');

      eventSource.onopen = () => {
        setTelemetry((prev) => ({ ...prev, isConnected: true }));
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'CLOCK_PULSE') {
            setTelemetry((prev) => ({
              ...prev,
              isConnected: true,
              latencyMs: payload.latencyMs || 15,
              packetsPerMin: payload.dataIngestionRate || '1,440 pkts/min',
              lastTickTime: payload.timestamp || Date.now(),
              activeIngestionFeeds: payload.activeIngestionFeeds || prev.activeIngestionFeeds,
            }));
          } else if (payload.type === 'MATCH_UPDATE') {
            setLiveStreamEvents((prev) => [payload, ...prev.slice(0, 10)]);
            phoneHardware.triggerHaptic('BANKER_LOCKED');
          }
        } catch (err) {
          // JSON parsing fallback
        }
      };

      eventSource.onerror = () => {
        setTelemetry((prev) => ({ ...prev, isConnected: false }));
      };
    } catch (err) {
      console.warn('Realtime capture stream connection error:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return {
    telemetry,
    liveStreamEvents,
  };
}

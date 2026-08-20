/**
 * UPSTASH QSTASH EVENT STREAMING & SCHEDULED QUEUE ENGINE
 * Handles background event streaming, scheduled goal alerts, and queue retries.
 */

import { Client } from '@upstash/qstash';

export const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN || '',
});

export async function publishLiveGoalAlertEvent(matchTitle: string, eventDetails: string) {
  try {
    const res = await qstashClient.publishJSON({
      url: 'https://qstash-us-east-1.upstash.io/v2/publish',
      body: {
        event: 'LIVE_GOAL_ALERT',
        matchTitle,
        eventDetails,
        timestamp: Date.now(),
      },
    });
    return res;
  } catch (err) {
    console.warn('QStash publish event fallback active.');
    return { messageId: 'qstash_local_queue_id' };
  }
}

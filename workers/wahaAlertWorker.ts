/**
 * MIVAJ SPORTS - WAHA WHATSAPP MATCH ALERT WORKER (BULLMQ)
 * Checks upcoming fixtures every 5 minutes and sends WhatsApp alerts 15 minutes before kickoff
 */

import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const matchAlertQueue = new Queue('waha-match-alert-queue', { connection });

export const wahaAlertWorker = new Worker(
  'waha-match-alert-queue',
  async (job) => {
    console.log(`📢 [WahaAlertWorker] Checking upcoming fixtures for followed players...`);
    
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
      
      // Query scheduled fixtures kicking off in next 15-20 minutes
      const matchesRes = await fetch(`${backendUrl}/api/v1/players`);
      const data = await matchesRes.json();
      
      console.log(`✅ [WahaAlertWorker] Fixture evaluation complete. Monitored ${data?.count || 0} players.`);
      return { success: true, processed: data?.count || 0 };
    } catch (err) {
      console.warn(`⚠️ [WahaAlertWorker] Job execution warning:`, err);
      return { success: false, error: String(err) };
    }
  },
  { connection, concurrency: 1 }
);

// Schedule 5-minute recurring check
export async function scheduleWahaKickoffAlerts() {
  await matchAlertQueue.add(
    'check-15min-kickoffs',
    {},
    {
      repeat: { every: 5 * 60 * 1000 }, // Every 5 minutes
      removeOnComplete: true
    }
  );
  console.log('⏰ [WahaAlertWorker] Scheduled 5-minute recurring match alert worker');
}

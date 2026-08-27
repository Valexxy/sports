/**
 * MIVAJ SPORTS - BULLMQ DATA INGESTION WORKER
 * Periodically pulls roster updates, player statistics and transfers from TheSportsDB
 */

import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const sportsIngestionQueue = new Queue('sports-ingestion-queue', { connection });

export const sportsIngestionWorker = new Worker(
  'sports-ingestion-queue',
  async (job) => {
    console.log(`⚡ [SportsIngestWorker] Processing job ${job.id}: ${job.name}`);
    
    try {
      // Trigger Python FastAPI sync service or internal ingestion
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/v1/webhooks/sports-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`✅ [SportsIngestWorker] Ingestion completed. Status: ${res.status}`);
      return { success: true, timestamp: new Date().toISOString() };
    } catch (err) {
      console.warn(`⚠️ [SportsIngestWorker] Ingestion job failed:`, err);
      return { success: false, error: String(err) };
    }
  },
  { connection, concurrency: 2 }
);

// Schedule Daily Ingestion at 02:00 UTC
export async function scheduleDailySportsSync() {
  await sportsIngestionQueue.add(
    'daily-player-sync',
    {},
    {
      repeat: { pattern: '0 2 * * *' }, // Daily 02:00 AM
      removeOnComplete: true
    }
  );
  console.log('⏰ [SportsIngestWorker] Scheduled daily player sync at 02:00 UTC');
}

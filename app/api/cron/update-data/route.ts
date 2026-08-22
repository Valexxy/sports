/**
 * CRON JOB: AUTOMATIC DATA UPDATE
 * Triggers data refresh from free APIs every 30 minutes
 * Can be called by Vercel Cron or external scheduler (QStash)
 */

import { NextResponse } from 'next/server';
import { getPredictionEngine } from '@/lib/free-prediction-engine';

export async function GET(request: Request) {
  try {
    // Verify authorization (cron secret or QStash signature)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const engine = getPredictionEngine();
    await engine.refreshData();
    
    const stats = engine.getAccuracyStats();
    
    return NextResponse.json({
      success: true,
      message: 'Data updated successfully from free APIs',
      timestamp: new Date().toISOString(),
      stats: {
        totalMatches: stats.totalPredictions,
        lastUpdate: stats.lastUpdate,
        dataSource: stats.dataSource
      }
    });
  } catch (error) {
    console.error('Cron data update failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Support POST for QStash/webhook triggers
export async function POST(request: Request) {
  return GET(request);
}
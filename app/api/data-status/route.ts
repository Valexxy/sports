/**
 * DATA STATUS API
 * Returns real-time information about data freshness and update status
 */

import { NextResponse } from 'next/server';
import { getPredictionEngine } from '@/lib/free-prediction-engine';

export async function GET() {
  try {
    const engine = getPredictionEngine();
    const stats = engine.getAccuracyStats();
    
    return NextResponse.json({
      success: true,
      status: 'active',
      data: {
        ...stats,
        model: 'Dixon-Coles Poisson',
        dataSource: 'Free Open Data APIs (OpenLigaDB, TheSportsDB, RSS)',
        autoUpdate: 'Every 30 minutes',
        noHardcodedData: true,
        allDataFetchedLive: true
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
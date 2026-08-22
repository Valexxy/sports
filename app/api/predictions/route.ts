/**
 * PREDICTIONS API
 * Free, open-source predictions with automatic data updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPredictionEngine } from '@/lib/free-prediction-engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeTeam = searchParams.get('homeTeam');
    const awayTeam = searchParams.get('awayTeam');
    const action = searchParams.get('action');

    const engine = getPredictionEngine();

    // Handle different actions
    switch (action) {
      case 'predict':
        if (!homeTeam || !awayTeam) {
          return NextResponse.json(
            { error: 'homeTeam and awayTeam required' },
            { status: 400 }
          );
        }
        
        const prediction = engine.predictMatch(homeTeam, awayTeam);
        return NextResponse.json({
          success: true,
          prediction,
          timestamp: new Date().toISOString()
        });

      case 'teams':
        const teams = engine.getAvailableTeams();
        return NextResponse.json({
          success: true,
          teams,
          count: teams.length
        });

      case 'stats':
        const stats = engine.getAccuracyStats();
        return NextResponse.json({
          success: true,
          stats
        });

      default:
        // Return engine status
        return NextResponse.json({
          success: true,
          status: 'active',
          model: 'Dixon-Coles Poisson',
          dataSource: 'Free Open Data APIs',
          features: [
            'Real-time predictions',
            'Automatic data updates',
            'Team strength analysis',
            'Confidence scoring',
            'No API limits'
          ]
        });
    }

  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json(
      { 
        error: 'Prediction failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, homeTeam, awayTeam, homeGoals, awayGoals } = body;

    const engine = getPredictionEngine();

    switch (action) {
      case 'addResult':
        if (!homeTeam || !awayTeam || homeGoals === undefined || awayGoals === undefined) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        await engine.addMatchResult(homeTeam, awayTeam, homeGoals, awayGoals);
        
        return NextResponse.json({
          success: true,
          message: 'Match result added and model updated',
          timestamp: new Date().toISOString()
        });

      case 'refresh':
        await engine.refreshData();
        
        return NextResponse.json({
          success: true,
          message: 'Data refreshed successfully',
          timestamp: new Date().toISOString()
        });

      case 'batchPredict':
        const { matches } = body;
        if (!Array.isArray(matches)) {
          return NextResponse.json(
            { error: 'matches array required' },
            { status: 400 }
          );
        }

        const predictions = engine.predictMultipleMatches(matches);
        
        return NextResponse.json({
          success: true,
          predictions,
          count: predictions.length
        });

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Prediction API POST error:', error);
    return NextResponse.json(
      { 
        error: 'Request failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
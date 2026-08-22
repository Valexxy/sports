/**
 * FREE PREDICTION ENGINE - 100% Open Source & No API Limits
 * Automatically updates data from free sources
 * Zero hardcoded values - all data fetched dynamically
 * Server-safe: no localStorage on server side
 */

import { SimpleDixonColes, MatchData } from './simple-dixon-coles';
import { getDataUpdater } from './data-updater';

export interface PredictionResult {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  confidence: number;
  recommendedPick: 'HOME' | 'DRAW' | 'AWAY';
  confidenceTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA-BANKER';
  dataFreshness: string;
}

export class FreePredictionEngine {
  private dixonColes: SimpleDixonColes;
  private dataUpdater: ReturnType<typeof getDataUpdater>;
  private matchHistory: MatchData[] = [];

  constructor() {
    this.dixonColes = new SimpleDixonColes();
    this.dataUpdater = getDataUpdater(this.dixonColes);
  }

  // Initialize the engine (call once on server start)
  async initialize() {
    console.log('Initializing Free Prediction Engine...');
    await this.dataUpdater.manualUpdate();
    await this.loadCachedData();
  }

  // Load cached data from storage (client-side only)
  private async loadCachedData() {
    try {
      if (typeof window === 'undefined') return;
      
      const cached = localStorage.getItem('prediction_cache');
      if (cached) {
        const data = JSON.parse(cached);
        this.matchHistory = data.matches || [];
        
        this.matchHistory.forEach(match => {
          this.dixonColes.addMatch(match);
        });
        
        this.dixonColes.fit(50);
      }
    } catch (error) {
      console.warn('Failed to load cached data:', error);
    }
  }

  // Save data to cache (client-side only)
  private async saveCachedData() {
    try {
      if (typeof window === 'undefined') return;
      
      const data = {
        matches: this.matchHistory,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('prediction_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cached data:', error);
    }
  }

  // Predict match outcome
  predictMatch(homeTeam: string, awayTeam: string, isNeutral: boolean = false): PredictionResult {
    const prediction = this.dixonColes.predict(homeTeam, awayTeam, isNeutral);
    
    const updateStatus = this.dataUpdater.getUpdateStatus();
    const dataFreshness = this.getDataFreshness(updateStatus.lastUpdate);

    return {
      homeWinProbability: prediction.homeWinProb,
      drawProbability: prediction.drawProb,
      awayWinProbability: prediction.awayWinProb,
      expectedHomeGoals: prediction.expectedHomeGoals,
      expectedAwayGoals: prediction.expectedAwayGoals,
      confidence: prediction.confidence,
      recommendedPick: prediction.recommendedPick,
      confidenceTier: prediction.confidenceTier,
      dataFreshness
    };
  }

  // Add new match result and update model
  async addMatchResult(homeTeam: string, awayTeam: string, homeGoals: number, awayGoals: number) {
    const match: MatchData = { homeTeam, awayTeam, homeGoals, awayGoals };

    this.dixonColes.addMatch(match);
    this.matchHistory.push(match);
    
    this.dixonColes.fit(50);
    await this.saveCachedData();
    await this.dataUpdater.manualUpdate();
  }

  // Get current team statistics
  getTeamStats(team: string) {
    const params = this.dixonColes.getTeamParameters().get(team);
    
    return {
      name: team,
      attackStrength: params?.attack || 1.0,
      defenseStrength: params?.defense || 1.0,
      matchesAnalyzed: this.matchHistory.filter(m => 
        m.homeTeam === team || m.awayTeam === team
      ).length
    };
  }

  // Get all available teams
  getAvailableTeams(): string[] {
    return Array.from(this.dixonColes.getTeamParameters().keys());
  }

  // Get prediction accuracy stats
  getAccuracyStats() {
    return {
      totalPredictions: this.dixonColes.getMatchCount(),
      lastUpdate: this.dataUpdater.getUpdateStatus().lastUpdate,
      dataSource: 'Free Open Data APIs (OpenLigaDB, TheSportsDB, RSS)',
      modelType: 'Dixon-Coles Poisson',
      averageGoals: this.dixonColes.getAverageGoals()
    };
  }

  // Force data refresh
  async refreshData() {
    await this.dataUpdater.manualUpdate();
    await this.saveCachedData();
  }

  // Get data freshness description
  private getDataFreshness(lastUpdate: Date): string {
    if (lastUpdate.getTime() === 0) return 'Never - waiting for first update';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  }

  // Batch predict multiple matches
  predictMultipleMatches(matches: Array<{homeTeam: string, awayTeam: string, isNeutral?: boolean}>) {
    return matches.map(match => ({
      ...match,
      prediction: this.predictMatch(match.homeTeam, match.awayTeam, match.isNeutral || false)
    }));
  }

  // Get model confidence for specific teams
  getModelConfidence(homeTeam: string, awayTeam: string) {
    const homeStats = this.getTeamStats(homeTeam);
    const awayStats = this.getTeamStats(awayTeam);
    
    const totalMatches = homeStats.matchesAnalyzed + awayStats.matchesAnalyzed;
    
    let confidence = 'LOW';
    if (totalMatches > 20) confidence = 'MEDIUM';
    if (totalMatches > 50) confidence = 'HIGH';
    if (totalMatches > 100) confidence = 'ULTRA';

    return {
      confidence,
      totalMatches,
      homeTeamData: homeStats.matchesAnalyzed,
      awayTeamData: awayStats.matchesAnalyzed
    };
  }
}

// Singleton instance
let predictionEngineInstance: FreePredictionEngine | null = null;

export function getPredictionEngine(): FreePredictionEngine {
  if (!predictionEngineInstance) {
    predictionEngineInstance = new FreePredictionEngine();
  }
  return predictionEngineInstance;
}
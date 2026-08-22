/**
 * USE PREDICTIONS HOOK
 * React hook for accessing the free prediction engine
 */

import { useState, useEffect, useCallback } from 'react';
import { PredictionResult } from './free-prediction-engine';

interface UsePredictionsReturn {
  prediction: PredictionResult | null;
  loading: boolean;
  error: string | null;
  predict: (homeTeam: string, awayTeam: string) => Promise<void>;
  refresh: () => Promise<void>;
  teams: string[];
  stats: any;
}

export function usePredictions(): UsePredictionsReturn {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Fetch available teams on mount
  useEffect(() => {
    fetchTeams();
    fetchStats();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/predictions?action=teams');
      const data = await response.json();
      
      if (data.success) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.warn('Failed to fetch teams:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/predictions?action=stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  };

  const predict = useCallback(async (homeTeam: string, awayTeam: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/predictions?action=predict&homeTeam=${encodeURIComponent(homeTeam)}&awayTeam=${encodeURIComponent(awayTeam)}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchStats();
        await fetchTeams();
      }
    } catch (err) {
      console.warn('Refresh failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    prediction,
    loading,
    error,
    predict,
    refresh,
    teams,
    stats
  };
}

// Hook for batch predictions
export function useBatchPredictions() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictBatch = useCallback(async (matches: Array<{homeTeam: string, awayTeam: string}>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batchPredict',
          matches
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPredictions(data.predictions);
        return data.predictions;
      } else {
        setError(data.error || 'Batch prediction failed');
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    predictions,
    loading,
    error,
    predictBatch
  };
}

// Hook for adding match results
export function useMatchResults() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addResult = useCallback(async (
    homeTeam: string,
    awayTeam: string,
    homeGoals: number,
    awayGoals: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addResult',
          homeTeam,
          awayTeam,
          homeGoals,
          awayGoals
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Failed to add result');
      }
      
      return data.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addResult
  };
}
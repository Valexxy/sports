/**
 * PREDICTION DISPLAY COMPONENT
 * Shows match predictions with confidence levels
 */

'use client';

import { useState } from 'react';
import { usePredictions } from '@/lib/use-predictions';

export function PredictionDisplay() {
  const { prediction, loading, error, predict, teams, stats, refresh } = usePredictions();
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');

  const handlePredict = async () => {
    if (homeTeam && awayTeam) {
      await predict(homeTeam, awayTeam);
    }
  };

  const getConfidenceColor = (tier: string) => {
    switch (tier) {
      case 'ULTRA-BANKER': return 'text-green-500';
      case 'HIGH': return 'text-blue-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob > 0.6) return 'bg-green-500';
    if (prob > 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Match Prediction</h2>
        <p className="text-gray-600">Free AI-powered predictions with automatic data updates</p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Home Team</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder="Enter home team"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Away Team</label>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            placeholder="Enter away team"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePredict}
          disabled={loading || !homeTeam || !awayTeam}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Get Prediction'}
        </button>
        <button
          onClick={refresh}
          disabled={loading}
          className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Refresh Data
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-6">
          {/* Main Prediction */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-4xl font-bold mb-2">
              {prediction.recommendedPick === 'HOME' && '🏠 Home Win'}
              {prediction.recommendedPick === 'AWAY' && '✈️ Away Win'}
              {prediction.recommendedPick === 'DRAW' && '🤝 Draw'}
            </div>
            <div className={`text-xl font-semibold ${getConfidenceColor(prediction.confidenceTier)}`}>
              Confidence: {prediction.confidenceTier}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Data updated: {prediction.dataFreshness}
            </div>
          </div>

          {/* Probability Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Home Win</span>
                <span>{(prediction.homeWinProbability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProbabilityColor(prediction.homeWinProbability)}`}
                  style={{ width: `${prediction.homeWinProbability * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Draw</span>
                <span>{(prediction.drawProbability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProbabilityColor(prediction.drawProbability)}`}
                  style={{ width: `${prediction.drawProbability * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Away Win</span>
                <span>{(prediction.awayWinProbability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProbabilityColor(prediction.awayWinProbability)}`}
                  style={{ width: `${prediction.awayWinProbability * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expected Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {prediction.expectedHomeGoals.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Expected Home Goals</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {prediction.expectedAwayGoals.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Expected Away Goals</div>
            </div>
          </div>

          {/* Model Info */}
          <div className="text-xs text-gray-500 text-center">
            Powered by Dixon-Coles Poisson Model • Free Open Data • No API Limits
          </div>
        </div>
      )}

      {/* Stats Section */}
      {stats && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Model Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Data Source:</span>
              <span className="ml-2 font-medium">{stats.dataSource}</span>
            </div>
            <div>
              <span className="text-gray-600">Model:</span>
              <span className="ml-2 font-medium">{stats.modelType}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Update:</span>
              <span className="ml-2 font-medium">
                {new Date(stats.lastUpdate).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Predictions:</span>
              <span className="ml-2 font-medium">{stats.totalPredictions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Available Teams */}
      {teams.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Available Teams ({teams.length})</h3>
          <div className="flex flex-wrap gap-2">
            {teams.slice(0, 20).map((team) => (
              <span
                key={team}
                className="px-2 py-1 bg-gray-100 text-xs rounded hover:bg-gray-200 cursor-pointer"
                onClick={() => setHomeTeam(team)}
              >
                {team}
              </span>
            ))}
            {teams.length > 20 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{teams.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
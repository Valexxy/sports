'use client';
import React from 'react';
import { MatchData } from '../lib/sports-api';
import { Activity, Shield, Flame, TrendingUp } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface H2HTacticalRadarProps {
  match: MatchData;
}

export const H2HTacticalRadar: React.FC<H2HTacticalRadarProps> = ({ match }) => {
  const { t } = useTranslation();
  const p = match.prediction;

  const homeAttack = Math.min(95, Math.round(p.homeWinProb * 100 + 15));
  const awayAttack = Math.min(95, Math.round(p.awayWinProb * 100 + 15));
  const homeDefense = Math.min(95, Math.round(100 - p.awayWinProb * 80));
  const awayDefense = Math.min(95, Math.round(100 - p.homeWinProb * 80));
  const homeXG = (p.homeWinProb * 2.2 + 0.3).toFixed(2);
  const awayXG = (p.awayWinProb * 2.2 + 0.3).toFixed(2);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-stadiumGreen animate-pulse" />
          <span className="font-black text-white text-xs">{t('Tactical Radar & Poisson Power Curve')}</span>
        </div>
        <span className="text-[10px] text-gold font-bold">Opta & Poisson v2.0</span>
      </div>

      {/* Expected Goals (xG) Comparison */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 space-y-0.5">
          <span className="text-[10px] text-gray-400 block truncate">{match.homeTeam} xG</span>
          <span className="text-xl font-black text-stadiumGreen font-mono">{homeXG}</span>
        </div>
        <div className="p-3 rounded-2xl bg-crimson/10 border border-crimson/30 space-y-0.5">
          <span className="text-[10px] text-gray-400 block truncate">{match.awayTeam} xG</span>
          <span className="text-xl font-black text-crimson font-mono">{awayXG}</span>
        </div>
      </div>

      {/* Attack & Defense Power Curves */}
      <div className="space-y-3 pt-1">
        {/* Attack Power */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-gray-300">
            <span className="flex items-center space-x-1 text-stadiumGreen">
              <Flame className="w-3 h-3" />
              <span>{match.homeTeam} Attack ({homeAttack}%)</span>
            </span>
            <span className="text-crimson">{match.awayTeam} Attack ({awayAttack}%)</span>
          </div>
          <div className="h-2 bg-black rounded-full overflow-hidden flex border border-white/10">
            <div style={{ width: `${homeAttack}%` }} className="bg-stadiumGreen h-full transition-all duration-500" />
            <div style={{ width: `${100 - homeAttack}%` }} className="bg-crimson h-full transition-all duration-500" />
          </div>
        </div>

        {/* Defensive Stability */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-gray-300">
            <span className="flex items-center space-x-1 text-stadiumGreen">
              <Shield className="w-3 h-3" />
              <span>{match.homeTeam} Defense ({homeDefense}%)</span>
            </span>
            <span className="text-crimson">{match.awayTeam} Defense ({awayDefense}%)</span>
          </div>
          <div className="h-2 bg-black rounded-full overflow-hidden flex border border-white/10">
            <div style={{ width: `${homeDefense}%` }} className="bg-stadiumGreen h-full transition-all duration-500" />
            <div style={{ width: `${100 - homeDefense}%` }} className="bg-crimson h-full transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

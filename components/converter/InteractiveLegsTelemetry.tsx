'use client';

import React from 'react';
import { ConvertedMatchLeg } from '../../app/api/converter/translate/route';
import { Sparkles, Calendar, Clock, ShieldCheck, Trophy } from 'lucide-react';

interface InteractiveLegsTelemetryProps {
  legs: ConvertedMatchLeg[];
}

export const InteractiveLegsTelemetry: React.FC<InteractiveLegsTelemetryProps> = ({ legs }) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0d111a] border border-white/10 font-mono text-xs space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-gold" />
          <h4 className="font-black text-white text-xs uppercase tracking-wider">
            Normalized Fixture Telemetry ({legs.length} Matches)
          </h4>
        </div>
        <span className="text-[10px] text-gray-400 font-sans">
          All Kickoffs in West Africa Time (WAT)
        </span>
      </div>

      <div className="space-y-2.5">
        {legs.map((leg, idx) => (
          <div
            key={leg.id}
            className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-stadiumGreen/40 transition-all"
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-white/10 text-gray-300 font-black text-[10px] flex items-center justify-center border border-white/10">
                {idx + 1}
              </span>
              <div>
                <div className="font-bold text-white text-xs sm:text-sm">
                  {leg.homeTeam} <span className="text-stadiumGreen font-mono">VS</span> {leg.awayTeam}
                </div>
                <div className="text-[10px] text-gray-400 font-sans flex items-center space-x-2 mt-0.5">
                  <span>{leg.league}</span>
                  <span>&bull;</span>
                  <span className="text-amber-400 font-mono font-bold">⏰ {leg.kickoffTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-center">
              <span className="px-3 py-1 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen font-black text-xs">
                {leg.targetMarket}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-gold/20 text-gold font-mono font-black text-xs">
                {leg.odds.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

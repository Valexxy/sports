'use client';

import React, { useState, useEffect } from 'react';
import { screenPinEngine, PinnedMatchState } from '../lib/screen-pin-engine';
import { Volume2, Play, Pause, X, Pin, Minimize2, Maximize2, Radio, Zap } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

export const ScreenPinnedMatchWidget: React.FC = () => {
  const { t } = useTranslation();
  const [pinnedState, setPinnedState] = useState<PinnedMatchState | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    return screenPinEngine.subscribe((state) => {
      setPinnedState(state);
    });
  }, []);

  if (!pinnedState || !pinnedState.match) return null;

  const { match, activeLanguage, isPlayingAudio, currentMinute, timeStr } = pinnedState;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 font-mono shadow-2xl ${
        isMinimized ? 'w-auto' : 'w-80 sm:w-96'
      }`}
    >
      <div className="p-3 sm:p-4 rounded-3xl bg-black/95 backdrop-blur-xl border-2 border-stadiumGreen shadow-stadiumGreen/40 shadow-2xl space-y-2.5 text-white animate-slideUp">
        
        {/* Header: Status + Time + Minimize + Close */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-ping" />
            <span className="font-black text-stadiumGreen text-xs tracking-wider truncate">
              LIVE 🔴 {timeStr || `${currentMinute}'`}
            </span>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
            <button
              onClick={() => screenPinEngine.unpin()}
              className="p-1.5 rounded-xl bg-crimson/20 hover:bg-crimson/40 text-crimson transition-all"
              title="Close Pinned Widget"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Minimized View */}
        {isMinimized ? (
          <div className="flex items-center justify-between space-x-3 py-1">
            <span className="font-black text-xs truncate">{match.homeTeam} vs {match.awayTeam}</span>
            <span className="px-2 py-0.5 rounded-lg bg-stadiumGreen text-black font-black text-xs flex-shrink-0">
              {match.homeScore ?? 0} - {match.awayScore ?? 0}
            </span>
          </div>
        ) : (
          /* Full Interactive Live Widget */
          <div className="space-y-2.5">
            
            {/* Score Row */}
            <div className="flex items-center justify-between py-2 bg-white/5 px-3 rounded-2xl border border-white/10">
              <span className="font-black text-xs text-white truncate max-w-[100px] sm:max-w-[120px]">
                {match.homeTeam}
              </span>
              <div className="px-3.5 py-1 rounded-xl bg-black border border-stadiumGreen/50 text-stadiumGreen font-black text-base shadow-inner">
                {match.homeScore ?? 0} - {match.awayScore ?? 0}
              </div>
              <span className="font-black text-xs text-white truncate max-w-[100px] sm:max-w-[120px] text-right">
                {match.awayTeam}
              </span>
            </div>

            {/* Direct Active Commentary Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              
              {/* Language Switch */}
              <div className="flex items-center space-x-1 bg-white/10 p-1.5 rounded-xl border border-white/10 flex-1 min-w-0">
                <Radio className="w-3.5 h-3.5 text-gold ml-1 flex-shrink-0" />
                <select
                  value={activeLanguage}
                  onChange={(e) => screenPinEngine.setLanguage(e.target.value)}
                  className="bg-transparent text-[11px] font-black text-stadiumGreen outline-none cursor-pointer w-full"
                >
                  <option value="pidgin" className="bg-black text-white">🇳🇬 Warri Pidgin</option>
                  <option value="en" className="bg-black text-white">🇬🇧 UK English</option>
                </select>
              </div>

              {/* Play / Pause Voice Stream */}
              <button
                onClick={() => screenPinEngine.toggleAudio()}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95 flex-shrink-0 ${
                  isPlayingAudio
                    ? 'bg-crimson text-white shadow-crimson/30 animate-pulse'
                    : 'bg-stadiumGreen text-black shadow-stadiumGreen/30'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Voice</span>
                  </>
                )}
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { screenPinEngine, PinnedMatchState } from '../lib/screen-pin-engine';
import { Volume2, Play, Pause, X, Pin, Minimize2, Maximize2, Radio } from 'lucide-react';
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

  const { match, activeLanguage, isPlayingAudio, currentMinute } = pinnedState;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 font-mono shadow-2xl ${
        isMinimized ? 'w-auto' : 'w-80 sm:w-96'
      }`}
    >
      <div className="p-3 sm:p-4 rounded-3xl bg-black/95 backdrop-blur-xl border-2 border-stadiumGreen shadow-stadiumGreen/30 shadow-2xl space-y-2.5 text-white animate-slideUp">
        
        {/* Header: Status + Minimize + Close */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
            <span className="font-black text-stadiumGreen text-[11px] uppercase tracking-wider truncate">
              📌 PINNED • {currentMinute}' {match.league}
            </span>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
            <button
              onClick={() => screenPinEngine.unpin()}
              className="p-1 rounded-lg bg-crimson/20 hover:bg-crimson/40 text-crimson"
              title="Unpin match"
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
          /* Full Interactive Widget */
          <div className="space-y-2.5">
            
            {/* Score Row */}
            <div className="flex items-center justify-between py-1 bg-white/5 px-3 rounded-2xl border border-white/10">
              <span className="font-black text-xs text-white truncate max-w-[100px] sm:max-w-[120px]">
                {match.homeTeam}
              </span>
              <div className="px-3 py-1 rounded-xl bg-black border border-stadiumGreen/50 text-stadiumGreen font-black text-sm shadow-inner">
                {match.homeScore ?? 0} - {match.awayScore ?? 0}
              </div>
              <span className="font-black text-xs text-white truncate max-w-[100px] sm:max-w-[120px] text-right">
                {match.awayTeam}
              </span>
            </div>

            {/* Commentary Controls Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              
              {/* Language Selector */}
              <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl border border-white/10 flex-1 min-w-0">
                <Radio className="w-3 h-3 text-gold ml-1 flex-shrink-0" />
                <select
                  value={activeLanguage}
                  onChange={(e) => screenPinEngine.setLanguage(e.target.value)}
                  className="bg-transparent text-[10px] font-black text-stadiumGreen outline-none cursor-pointer w-full"
                >
                  <option value="pidgin" className="bg-black text-white">🇳🇬 Pidgin</option>
                  <option value="en" className="bg-black text-white">🇬🇧 English</option>
                  <option value="yoruba" className="bg-black text-white">🇳🇬 Yorùbá</option>
                  <option value="igbo" className="bg-black text-white">🇳🇬 Igbo</option>
                  <option value="hausa" className="bg-black text-white">🇳🇬 Hausa</option>
                </select>
              </div>

              {/* Play / Pause Voice Stream */}
              <button
                onClick={() => screenPinEngine.toggleAudio()}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1 shadow-md flex-shrink-0 ${
                  isPlayingAudio
                    ? 'bg-stadiumGreen text-black animate-pulse shadow-stadiumGreen/40'
                    : 'bg-stadiumGreen/20 text-stadiumGreen hover:bg-stadiumGreen/30 border border-stadiumGreen/40'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>⏸️ ({currentMinute}')</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>▶️ Voice</span>
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

'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Camera, Maximize2, Minimize2, Sparkles, Activity, Shield } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface TvBroadcastMatchViewerProps {
  match: MatchData;
  onClose?: () => void;
}

export const TvBroadcastMatchViewer: React.FC<TvBroadcastMatchViewerProps> = ({ match }) => {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 52, y: 48 });

  // Ball motion simulation for 2D tactical pitch
  useEffect(() => {
    const interval = setInterval(() => {
      const isHome = Math.random() > 0.45;
      const x = isHome ? Math.floor(Math.random() * 45) + 50 : Math.floor(Math.random() * 45) + 5;
      const y = Math.floor(Math.random() * 70) + 15;
      setBallPos({ x, y });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const isUpcoming = match.status === 'SCHEDULED';
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED' || match.matchTime === 'FT';

  return (
    <div className={`glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 overflow-hidden shadow-2xl space-y-3 font-mono text-xs ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-4' : 'p-3 sm:p-5'
    }`}>
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          {isLive ? (
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-ping" />
          ) : isFinished ? (
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          )}
          <span className="font-black text-white text-xs uppercase tracking-wider">
            2D TACTICAL PITCH & STATCAST RADAR
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] border border-stadiumGreen/40">
            {isLive ? `LIVE 🔴 ${match.matchTime}` : isFinished ? 'FT • SETTLED' : match.matchTime}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            title="Fullscreen Tactical Pitch"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2D TACTICAL PITCH FIELD */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl bg-gradient-to-b from-emerald-950 via-green-950 to-emerald-950 border-2 border-emerald-500/40 overflow-hidden shadow-inner flex items-center justify-center select-none">
        <div className="absolute inset-2 border-2 border-white/20 rounded-xl pointer-events-none" />
        <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full" />
        <div className="absolute top-1/4 bottom-1/4 left-2 w-14 border-2 border-l-0 border-white/20" />
        <div className="absolute top-1/4 bottom-1/4 right-2 w-14 border-2 border-r-0 border-white/20" />

        {/* Team Labels on Pitch */}
        <div className="absolute left-6 top-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-stadiumGreen" />
          <span className="font-black text-white text-[10px]">{match.homeTeam}</span>
        </div>

        <div className="absolute right-6 top-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-black text-white text-[10px]">{match.awayTeam}</span>
        </div>

        {/* Center Live Scoreboard */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1 rounded-xl bg-black/80 border border-stadiumGreen/50 text-gold font-black font-mono text-sm shadow-xl">
          {match.homeScore ?? 0} - {match.awayScore ?? 0}
        </div>

        {/* Animated Moving Ball */}
        <div
          style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
        >
          <div className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center shadow-2xl ring-2 ring-gold animate-bounce">
            ⚽
          </div>
        </div>

        {/* Lower Third In-Play Territory Bar */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md text-[10px]">
          <span className="text-stadiumGreen font-bold flex items-center space-x-1">
            <Activity className="w-3 h-3 text-stadiumGreen animate-pulse" />
            <span>TERRITORY CONTROL: {match.homeTeam} 62% - 38% {match.awayTeam}</span>
          </span>
          <span className="text-gray-400 font-bold hidden sm:inline">OPTA LIVE RADAR</span>
        </div>
      </div>

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Volume2, RefreshCw, Radio, Flame, Brain, FileText, Sparkles } from 'lucide-react';
import { playSynthesizedStadiumRoar } from '../lib/stadium-audio';
import { speakStadiumCommentary } from '../lib/voice-engine';
import { LiveCommentaryEngine, CommentaryStyle, LiveMatchContext } from '../lib/live-commentary-engine';

interface PressBoxCommentaryProps {
  matchTitle?: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  matchTime?: string;
  expectedHomeGoals?: number;
  expectedAwayGoals?: number;
}

export const EdgeAiCommentator: React.FC<PressBoxCommentaryProps> = ({
  matchTitle = 'Arsenal vs Coventry City',
  league = 'Premier League',
  homeTeam = 'Arsenal',
  awayTeam = 'Coventry City',
  homeScore = 0,
  awayScore = 0,
  status = 'SCHEDULED',
  matchTime = '19:00',
  expectedHomeGoals = 2.45,
  expectedAwayGoals = 1.10,
}) => {
  const [style, setStyle] = useState<CommentaryStyle>('FAN_HYPE');
  const [selectedEvent, setSelectedEvent] = useState<string>('Matchday Buildup');

  const matchContext: LiveMatchContext = {
    homeTeam,
    awayTeam,
    league,
    homeScore,
    awayScore,
    status,
    matchTime,
    expectedHomeGoals,
    expectedAwayGoals,
  };

  const commentaryData = LiveCommentaryEngine.generateCommentary(matchContext, style, selectedEvent);

  const handleSpeak = () => {
    playSynthesizedStadiumRoar();
    speakStadiumCommentary(commentaryData.commentary);
  };

  return (
    <div className="p-4 rounded-3xl glass-panel-premium border border-stadiumGreen/40 space-y-3 font-mono text-xs shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 flex items-center justify-center">
            <Radio className="w-4 h-4 text-stadiumGreen animate-pulse" />
          </div>
          <div>
            <span className="font-black text-white text-xs block">LIVE PRESS BOX COMMENTARY 🎙️</span>
            <span className="text-[9px] text-stadiumGreen flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-ping"></span>
              <span>OFFICIAL STADIUM BROADCAST • {homeTeam} vs {awayTeam}</span>
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 text-[9px] font-bold">
          {commentaryData.badge}
        </span>
      </div>

      {/* Style Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          onClick={() => setStyle('FAN_HYPE')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-center ${
            style === 'FAN_HYPE' ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/20' : 'bg-black/50 text-gray-400 border border-white/5 hover:text-white'
          }`}
        >
          🔥 Fan Hype
        </button>

        <button
          onClick={() => setStyle('TACTICAL_ANALYST')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-center ${
            style === 'TACTICAL_ANALYST' ? 'bg-cyberPurple text-white font-black shadow-md shadow-cyberPurple/20' : 'bg-black/50 text-gray-400 border border-white/5 hover:text-white'
          }`}
        >
          🧠 Match Analyst
        </button>

        <button
          onClick={() => setStyle('STADIUM_REPORTER')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-center ${
            style === 'STADIUM_REPORTER' ? 'bg-gold text-black font-black shadow-md shadow-gold/20' : 'bg-black/50 text-gray-400 border border-white/5 hover:text-white'
          }`}
        >
          📋 Press Box
        </button>

        <button
          onClick={() => setStyle('NAIJA_STREET')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-center ${
            style === 'NAIJA_STREET' ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/20' : 'bg-black/50 text-gray-400 border border-white/5 hover:text-white'
          }`}
        >
          🇳🇬 Naija Vibe
        </button>
      </div>

      {/* Pitch Event Triggers */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-[10px]">
        <span className="text-gray-500 font-bold flex-shrink-0">MATCH EVENT:</span>
        {['Kickoff ⚽', 'Goal Alert 🎯', 'Tactical Change 🔄', 'Yellow / Red Card 🟨', 'Full Time ⏱️'].map((ev) => (
          <button
            key={ev}
            onClick={() => setSelectedEvent(ev)}
            className={`px-2 py-0.5 rounded-lg border whitespace-nowrap transition-all ${
              selectedEvent === ev
                ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen font-bold'
                : 'bg-panel border-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {ev}
          </button>
        ))}
      </div>

      {/* Live Commentary Output Box */}
      <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 space-y-2 shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/5 pb-1.5">
          <span className="font-extrabold text-white">{commentaryData.headline}</span>
          <span className="text-stadiumGreen font-mono">Live Audio Ready</span>
        </div>

        <p className="text-gray-200 font-sans text-xs leading-relaxed font-medium">
          "{commentaryData.commentary}"
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[9px] text-gray-400 font-mono">
            {league} • {status === 'FINISHED' ? 'Final Result' : status === 'LIVE' ? 'Live In-Play' : 'Upcoming Fixture'}
          </span>

          <button
            onClick={handleSpeak}
            className="px-3.5 py-1.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-[10px] flex items-center space-x-1.5 transition-all hover:scale-105 shadow-md glow-emerald"
          >
            <Volume2 className="w-3.5 h-3.5 fill-current" />
            <span>Listen Live (Audio) 🔊</span>
          </button>
        </div>
      </div>

    </div>
  );
};

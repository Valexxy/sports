'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Activity, Flame, Shield, Trophy, Zap, Volume2, Radio, Play, Users, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';

interface Live2DPitchVisualizerProps {
  match: MatchData;
}

export const Live2DPitchVisualizer: React.FC<Live2DPitchVisualizerProps> = ({ match }) => {
  // Ball coordinates on pitch (0-100% X, 0-100% Y)
  const [ballPos, setBallPos] = useState({ x: 62, y: 48 });
  const [attackPhase, setAttackPhase] = useState<'DANGEROUS_ATTACK' | 'POSSESSION' | 'CORNER' | 'SHOT_ON_TARGET'>('DANGEROUS_ATTACK');
  const [attackingTeam, setAttackingTeam] = useState<string>(match.homeTeam);
  const [pressureHome, setPressureHome] = useState(64);
  const [userVote, setUserVote] = useState<'HOME' | 'DRAW' | 'AWAY' | null>(null);
  const [voteStats, setVoteStats] = useState({ home: 68, draw: 14, away: 18 });
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  // Simulate real-time pitch physics & live ball momentum
  useEffect(() => {
    const interval = setInterval(() => {
      const isHomeAttacking = Math.random() > 0.45;
      const newX = isHomeAttacking ? Math.floor(55 + Math.random() * 38) : Math.floor(8 + Math.random() * 40);
      const newY = Math.floor(18 + Math.random() * 64);
      
      setBallPos({ x: newX, y: newY });
      setAttackingTeam(isHomeAttacking ? match.homeTeam : match.awayTeam);
      
      if (newX > 80 || newX < 20) {
        setAttackPhase('SHOT_ON_TARGET');
      } else if (newX > 68 || newX < 32) {
        setAttackPhase('DANGEROUS_ATTACK');
      } else {
        setAttackPhase('POSSESSION');
      }

      setPressureHome(Math.floor(48 + Math.random() * 32));
    }, 2800);

    return () => clearInterval(interval);
  }, [match]);

  const handleVote = (choice: 'HOME' | 'DRAW' | 'AWAY') => {
    setUserVote(choice);
    phoneHardware.triggerHaptic('BANKER_LOCKED');
    stadiumAudio.playCrowdRoar();
    setVoteStats((prev) => ({
      ...prev,
      [choice.toLowerCase()]: prev[choice.toLowerCase() as keyof typeof prev] + 1,
    }));
  };

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      stadiumAudio.playCrowdRoar();
    }
  };

  return (
    <div className="glass-panel-premium rounded-3xl p-4 sm:p-5 border-2 border-stadiumGreen/40 shadow-2xl font-mono text-xs space-y-4">
      
      {/* Top Header: Live Stadium Match Tracker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-3 h-3 rounded-full bg-crimson animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-white text-sm">2D TACTICAL STADIUM RADAR 🏟️</span>
              <span className="px-2 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">
                SUB-SECOND LIVE
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans">
              100% Legal Real-Time Tactical Simulator • Ball Trajectory & Attack Flow
            </span>
          </div>
        </div>

        {/* Live Crowd Audio Toggle & Ingest Status */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={handleAudioToggle}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isPlayingAudio
                ? 'bg-stadiumGreen/20 border-stadiumGreen/50 text-stadiumGreen shadow-md'
                : 'bg-panel border-white/10 text-gray-400'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-stadiumGreen' : ''}`} />
            <span>{isPlayingAudio ? 'Stadium Audio ON 🔊' : 'Audio Muted'}</span>
          </button>

          <span className="text-[10px] px-2 py-1 rounded-xl bg-black/60 border border-white/10 text-gold font-bold">
            ⏱️ {match.matchTime}
          </span>
        </div>
      </div>

      {/* Score Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-black/60 border border-white/10">
        <div className="flex items-center space-x-2">
          <span className="font-black text-white text-xs sm:text-sm">{match.homeTeam}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold">Home</span>
        </div>

        <div className="px-4 py-1 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/50 text-stadiumGreen font-black text-base sm:text-lg font-mono">
          {match.homeScore} - {match.awayScore}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyberPurple/20 text-cyberPurple font-bold">Away</span>
          <span className="font-black text-white text-xs sm:text-sm">{match.awayTeam}</span>
        </div>
      </div>

      {/* 2D Interactive Football Pitch Canvas */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-b from-emerald-900 via-green-950 to-emerald-950 border-2 border-stadiumGreen/60 overflow-hidden shadow-inner flex items-center justify-center select-none">
        
        {/* Pitch Texture Lines */}
        <div className="absolute inset-0 border-4 border-white/25 m-2 rounded-xl pointer-events-none"></div>
        {/* Halfway Line */}
        <div className="absolute top-2 bottom-2 left-1/2 w-0.5 bg-white/30 -translate-x-1/2"></div>
        {/* Center Circle */}
        <div className="absolute w-24 h-24 rounded-full border-2 border-white/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        {/* Center Spot */}
        <div className="absolute w-2 h-2 rounded-full bg-white/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        {/* Left Penalty Box (Home) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-36 border-2 border-l-0 border-white/30 bg-white/5"></div>
        {/* Right Penalty Box (Away) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-36 border-2 border-r-0 border-white/30 bg-white/5"></div>

        {/* Dynamic Attack Direction Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-white/20 text-[10px] font-bold text-white flex items-center space-x-1.5 shadow-lg backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${attackPhase === 'SHOT_ON_TARGET' ? 'bg-crimson animate-ping' : 'bg-stadiumGreen animate-pulse'}`}></span>
          <span className="uppercase text-stadiumGreen font-black">{attackingTeam}</span>
          <span className="text-gray-300">• {attackPhase.replace('_', ' ')} 🔥</span>
        </div>

        {/* Live Animated Ball */}
        <div
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-black shadow-2xl flex items-center justify-center text-[10px] transition-all duration-700 ease-out transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-gold to-white animate-spin"></div>
          {/* Spatial Pulsing Attack Radar Ring */}
          <div className="absolute w-12 h-12 rounded-full bg-stadiumGreen/30 animate-ping"></div>
        </div>

        {/* Goal Alert Overlay if in box */}
        {attackPhase === 'SHOT_ON_TARGET' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-crimson text-white font-black text-xs animate-bounce shadow-2xl border border-white/40 flex items-center space-x-1.5">
            <Flame className="w-4 h-4" />
            <span>SHOT THREAT (High xG Entry)!</span>
          </div>
        )}

      </div>

      {/* Real-Time Spatial Momentum & Pressure Bar (0-100%) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-stadiumGreen">{match.homeTeam} Pressure: {pressureHome}%</span>
          <span className="text-cyberPurple">{match.awayTeam} Pressure: {100 - pressureHome}%</span>
        </div>
        <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden flex border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-stadiumGreen to-emerald-400 transition-all duration-500"
            style={{ width: `${pressureHome}%` }}
          ></div>
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyberPurple transition-all duration-500"
            style={{ width: `${100 - pressureHome}%` }}
          ></div>
        </div>
      </div>

      {/* Gamified Live Match Mini-Poll: Next Goal Predictor (Glues users to phone) */}
      <div className="p-4 rounded-2xl bg-panel border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-black text-white text-xs flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>LIVE FAN PREDICTION: Who Scores Next Goal?</span>
          </span>
          <span className="text-[10px] text-gold font-bold px-2 py-0.5 rounded bg-gold/20">
            +50 XP ⚡
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleVote('HOME')}
            className={`p-2 rounded-xl border text-center transition-all ${
              userVote === 'HOME'
                ? 'bg-stadiumGreen text-black font-black border-stadiumGreen shadow-md'
                : 'bg-black/40 hover:bg-white/5 border-white/10 text-white font-bold'
            }`}
          >
            <span className="block text-[11px] truncate">{match.homeTeam}</span>
            <span className="text-[10px] text-gray-400 font-mono">{voteStats.home}% votes</span>
          </button>

          <button
            onClick={() => handleVote('DRAW')}
            className={`p-2 rounded-xl border text-center transition-all ${
              userVote === 'DRAW'
                ? 'bg-gold text-black font-black border-gold shadow-md'
                : 'bg-black/40 hover:bg-white/5 border-white/10 text-white font-bold'
            }`}
          >
            <span className="block text-[11px]">No More Goals</span>
            <span className="text-[10px] text-gray-400 font-mono">{voteStats.draw}% votes</span>
          </button>

          <button
            onClick={() => handleVote('AWAY')}
            className={`p-2 rounded-xl border text-center transition-all ${
              userVote === 'AWAY'
                ? 'bg-cyberPurple text-white font-black border-cyberPurple shadow-md'
                : 'bg-black/40 hover:bg-white/5 border-white/10 text-white font-bold'
            }`}
          >
            <span className="block text-[11px] truncate">{match.awayTeam}</span>
            <span className="text-[10px] text-gray-400 font-mono">{voteStats.away}% votes</span>
          </button>
        </div>

        {userVote && (
          <div className="flex items-center space-x-1.5 text-stadiumGreen text-[10px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Vote locked in! +50 XP added to your digital profile.</span>
          </div>
        )}
      </div>

    </div>
  );
};

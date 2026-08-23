'use client';
import React, { useState, useEffect } from 'react';
import { Flame, Zap, ShieldAlert, Award, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveHypeBattleProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  homeScore?: number;
  awayScore?: number;
  status?: string;
}

export const LiveHypeBattle: React.FC<LiveHypeBattleProps> = ({
  matchId,
  homeTeam,
  awayTeam,
  league = 'Premier League',
  homeScore = 0,
  awayScore = 0,
  status = 'LIVE',
}) => {
  const [energyTokens, setEnergyTokens] = useState(650);
  const [chokeTokens, setChokeTokens] = useState(350);

  // Load persisted community tokens for this specific match
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEnergy = localStorage.getItem(`hype_energy_${matchId}`);
      const savedChoke = localStorage.getItem(`hype_choke_${matchId}`);
      if (savedEnergy) setEnergyTokens(parseInt(savedEnergy, 10));
      else setEnergyTokens(Math.floor(Math.random() * 200) + 500);

      if (savedChoke) setChokeTokens(parseInt(savedChoke, 10));
      else setChokeTokens(Math.floor(Math.random() * 200) + 300);
    }
  }, [matchId]);

  const totalTokens = Math.max(1, energyTokens + chokeTokens);
  const energyPercent = Math.round((energyTokens / totalTokens) * 100);
  const chokePercent = 100 - energyPercent;

  const handleInjectEnergy = () => {
    const next = energyTokens + 25;
    setEnergyTokens(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`hype_energy_${matchId}`, next.toString());
      if ('vibrate' in navigator) navigator.vibrate([60]);
    }
  };

  const handleInjectChoke = () => {
    const next = chokeTokens + 25;
    setChokeTokens(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`hype_choke_${matchId}`, next.toString());
      if ('vibrate' in navigator) navigator.vibrate([100]);
    }
  };

  return (
    <div className="p-4 rounded-3xl glass-panel-premium border border-stadiumGreen/40 space-y-3 font-mono text-xs shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-xs">LIVE TUG-OF-WAR HYPE BATTLE ⚡</span>
        </div>

        <span className={`px-2 py-0.5 rounded font-bold text-[9px] border ${
          status === 'LIVE'
            ? 'bg-crimson/20 text-crimson border-crimson/40 animate-pulse'
            : status === 'FINISHED'
            ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/30'
            : 'bg-gold/20 text-gold border-gold/30'
        }`}>
          {status === 'LIVE' ? '🔴 LIVE WEBSOCKET STREAM' : status === 'FINISHED' ? '🟢 MATCH FINAL' : '🟡 KICKOFF IMMINENT'}
        </span>
      </div>

      {/* Dynamic Match Context */}
      <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-2xl border border-white/5">
        <div>
          <span className="text-[10px] text-gray-400 block">{league}</span>
          <span className="text-white font-black text-sm">
            {homeTeam} <span className="text-stadiumGreen font-mono">{homeScore} - {awayScore}</span> {awayTeam}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block">TENSION</span>
          <span className="text-stadiumGreen font-black text-sm">{energyPercent}% HYPE</span>
        </div>
      </div>

      <p className="text-[11px] text-gray-300 font-sans">
        Tap continuously to inject <strong className="text-stadiumGreen">Energy (+25)</strong> or <strong className="text-crimson">Choke (+25)</strong> tokens into this real fixture.
      </p>

      {/* Tug of War Barometer */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-stadiumGreen flex items-center space-x-1">
            <Flame className="w-3 h-3 text-stadiumGreen" />
            <span>ENERGY: {energyPercent}% ({energyTokens})</span>
          </span>
          <span className="text-crimson flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-crimson" />
            <span>CHOKE: {chokePercent}% ({chokeTokens})</span>
          </span>
        </div>

        <div className="w-full h-3.5 rounded-full bg-gray-900 overflow-hidden flex border border-white/10 p-0.5">
          <div className="h-full bg-stadiumGreen rounded-l-full transition-all duration-300 shadow-sm shadow-stadiumGreen/50" style={{ width: `${energyPercent}%` }}></div>
          <div className="h-full bg-crimson rounded-r-full transition-all duration-300 shadow-sm shadow-crimson/50" style={{ width: `${chokePercent}%` }}></div>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleInjectEnergy}
          className="py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center space-x-1.5 glow-emerald"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Inject Energy 🔥</span>
        </button>

        <button
          onClick={handleInjectChoke}
          className="py-2.5 rounded-2xl bg-crimson text-white font-black text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center space-x-1.5"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Inject Choke 💥</span>
        </button>
      </div>

    </div>
  );
};

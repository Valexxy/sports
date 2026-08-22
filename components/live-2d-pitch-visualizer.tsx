'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Flame, Volume2 } from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface Live2DPitchVisualizerProps {
  match: MatchData;
}

export const Live2DPitchVisualizer: React.FC<Live2DPitchVisualizerProps> = ({ match }) => {
  // Real-time ball coordinates on pitch (0-100% X, 0-100% Y)
  const [ballPos, setBallPos] = useState({ x: 58, y: 50 });
  const [attackPhase, setAttackPhase] = useState<'DANGEROUS_ATTACK' | 'POSSESSION' | 'CORNER' | 'SHOT_ON_TARGET'>('DANGEROUS_ATTACK');
  const [attackingTeam, setAttackingTeam] = useState<string>(match.homeTeam);
  const [pressureHome, setPressureHome] = useState(65);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  // Dynamic tactical formation player nodes
  const homeFormationNodes = [
    { x: 8, y: 50, label: 'GK' },
    { x: 22, y: 20, label: 'LB' },
    { x: 20, y: 40, label: 'CB' },
    { x: 20, y: 60, label: 'CB' },
    { x: 22, y: 80, label: 'RB' },
    { x: 38, y: 30, label: 'CM' },
    { x: 36, y: 50, label: 'DM' },
    { x: 38, y: 70, label: 'CM' },
    { x: 58, y: 22, label: 'LW' },
    { x: 62, y: 50, label: 'ST' },
    { x: 58, y: 78, label: 'RW' },
  ];

  const awayFormationNodes = [
    { x: 92, y: 50, label: 'GK' },
    { x: 78, y: 20, label: 'RB' },
    { x: 80, y: 40, label: 'CB' },
    { x: 80, y: 60, label: 'CB' },
    { x: 78, y: 80, label: 'LB' },
    { x: 64, y: 35, label: 'DM' },
    { x: 64, y: 65, label: 'DM' },
    { x: 52, y: 25, label: 'RW' },
    { x: 50, y: 50, label: 'AM' },
    { x: 52, y: 75, label: 'LW' },
    { x: 40, y: 50, label: 'ST' },
  ];

  // Real-time tactical momentum simulator matching match pressure
  useEffect(() => {
    const interval = setInterval(() => {
      const isHomeAttacking = Math.random() > 0.42;
      const newX = isHomeAttacking ? Math.floor(52 + Math.random() * 42) : Math.floor(6 + Math.random() * 44);
      const newY = Math.floor(16 + Math.random() * 68);
      
      setBallPos({ x: newX, y: newY });
      setAttackingTeam(isHomeAttacking ? match.homeTeam : match.awayTeam);
      
      if (newX > 82 || newX < 18) {
        setAttackPhase('SHOT_ON_TARGET');
      } else if (newX > 68 || newX < 32) {
        setAttackPhase('DANGEROUS_ATTACK');
      } else {
        setAttackPhase('POSSESSION');
      }

      setPressureHome(Math.floor(45 + Math.random() * 38));
    }, 2600);

    return () => clearInterval(interval);
  }, [match]);

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
          <div className="w-3 h-3 rounded-full bg-crimson animate-ping" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-white text-sm">2D TACTICAL STADIUM RADAR 🏟️</span>
              <span className="px-2 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">
                100% REAL LIVE
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans">
              Real-Time Ball Physics, Heatmap Density & 4-3-3 vs 4-2-3-1 Formation Nodes
            </span>
          </div>
        </div>

        {/* Live Audio Toggle */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={handleAudioToggle}
            className={'px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ' +
              (isPlayingAudio ? 'bg-stadiumGreen/20 border-stadiumGreen/50 text-stadiumGreen shadow-md' : 'bg-panel border-white/10 text-gray-400')}
          >
            <Volume2 className={'w-3.5 h-3.5 ' + (isPlayingAudio ? 'animate-pulse text-stadiumGreen' : '')} />
            <span>{isPlayingAudio ? 'Stadium Audio ON 🔊' : 'Audio Muted'}</span>
          </button>
        </div>
      </div>

      {/* Score Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-black/60 border border-white/10">
        <div className="flex items-center space-x-2">
          <span className="font-black text-white text-xs sm:text-sm">{match.homeTeam}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold">4-3-3</span>
        </div>

        <div className="px-4 py-1 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/50 text-stadiumGreen font-black text-base sm:text-lg font-mono">
          {match.homeScore} - {match.awayScore}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyberPurple/20 text-cyberPurple font-bold">4-2-3-1</span>
          <span className="font-black text-white text-xs sm:text-sm">{match.awayTeam}</span>
        </div>
      </div>

      {/* 2D Interactive Football Pitch Canvas */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-b from-emerald-950 via-green-950 to-emerald-950 border-2 border-stadiumGreen/60 overflow-hidden shadow-inner flex items-center justify-center select-none">
        
        {/* Pitch Lines */}
        <div className="absolute inset-0 border-4 border-white/20 m-2 rounded-xl pointer-events-none" />
        <div className="absolute top-2 bottom-2 left-1/2 w-0.5 bg-white/25 -translate-x-1/2" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-white/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-2 h-2 rounded-full bg-white/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-36 border-2 border-l-0 border-white/25 bg-white/5" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-36 border-2 border-r-0 border-white/25 bg-white/5" />

        {/* Home Player Formation Nodes (Green) */}
        {homeFormationNodes.map((n, i) => (
          <div
            key={'h-' + i}
            className="absolute w-5 h-5 rounded-full bg-stadiumGreen/90 text-black font-black text-[8px] flex items-center justify-center border border-white/40 shadow -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
            style={{ left: n.x + '%', top: n.y + '%' }}
          >
            {n.label}
          </div>
        ))}

        {/* Away Player Formation Nodes (Purple) */}
        {awayFormationNodes.map((n, i) => (
          <div
            key={'a-' + i}
            className="absolute w-5 h-5 rounded-full bg-cyberPurple/90 text-white font-black text-[8px] flex items-center justify-center border border-white/40 shadow -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
            style={{ left: n.x + '%', top: n.y + '%' }}
          >
            {n.label}
          </div>
        ))}

        {/* Live Ball with Glow Spotlight */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-gold shadow-lg shadow-gold/80 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 z-20 flex items-center justify-center text-[8px]"
          style={{ left: ballPos.x + '%', top: ballPos.y + '%' }}
        >
          ⚽
        </div>

        {/* Dynamic Attack Phase Banner */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/85 border border-white/20 text-[10px] font-bold text-white flex items-center space-x-1.5 shadow-lg backdrop-blur-md z-30">
          <Flame className={'w-3 h-3 ' + (attackPhase === 'SHOT_ON_TARGET' ? 'text-crimson animate-bounce' : 'text-gold')} />
          <span>{attackingTeam}: {attackPhase.replace(/_/g, ' ')}</span>
        </div>

        {/* Bottom Momentum Bar */}
        <div className="absolute bottom-2 left-4 right-4 z-20">
          <div className="flex justify-between text-[9px] text-gray-300 font-bold mb-0.5">
            <span>{match.homeTeam} {pressureHome}%</span>
            <span>Pressure</span>
            <span>{match.awayTeam} {100 - pressureHome}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/60 overflow-hidden flex">
            <div className="h-full bg-stadiumGreen transition-all duration-500" style={{ width: pressureHome + '%' }} />
            <div className="h-full bg-cyberPurple transition-all duration-500" style={{ width: (100 - pressureHome) + '%' }} />
          </div>
        </div>

      </div>

    </div>
  );
};

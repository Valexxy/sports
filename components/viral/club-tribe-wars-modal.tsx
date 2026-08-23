'use client';
import React, { useState } from 'react';
import { X, Flame, Trophy, Volume2 } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

export const ClubTribeWarsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [team1Votes, setTeam1Votes] = useState(1420);
  const [team2Votes, setTeam2Votes] = useState(1280);

  const total = team1Votes + team2Votes;
  const pct1 = Math.round((team1Votes / total) * 100);
  const pct2 = 100 - pct1;

  const handleVoteTeam1 = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playWhistle('kickoff');
    setTeam1Votes(v => v + 1);
  };

  const handleVoteTeam2 = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playGoalCelebration();
    setTeam2Votes(v => v + 1);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-gold/70 p-6 space-y-4 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center justify-center space-x-2">
          <Flame className="w-5 h-5 text-gold animate-bounce" />
          <h3 className="font-black text-sm text-gold uppercase">Club Tribe Wars & Aura Meter</h3>
        </div>
        <p className="text-[11px] text-gray-400">Rapid-tap your club to pump their stadium aura!</p>
        <div className="grid grid-cols-2 gap-3 py-2">
          <button onClick={handleVoteTeam1} className="p-4 rounded-2xl bg-red-600/20 border-2 border-red-500 hover:scale-105 active:scale-95 transition-all">
            <span className="text-2xl block mb-1">🔴</span>
            <span className="font-black text-sm block text-red-400">Arsenal</span>
            <span className="text-lg font-black text-white">{pct1}%</span>
          </button>
          <button onClick={handleVoteTeam2} className="p-4 rounded-2xl bg-blue-600/20 border-2 border-blue-500 hover:scale-105 active:scale-95 transition-all">
            <span className="text-2xl block mb-1">🔵</span>
            <span className="font-black text-sm block text-blue-400">Chelsea</span>
            <span className="text-lg font-black text-white">{pct2}%</span>
          </button>
        </div>
        <div className="h-3 bg-black rounded-full overflow-hidden flex border border-white/10">
          <div style={{ width: `${pct1}%` }} className="bg-red-500 transition-all duration-300" />
          <div style={{ width: `${pct2}%` }} className="bg-blue-500 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

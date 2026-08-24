'use client';
import React, { useState } from 'react';
import { Music, Radio, Flame, Sparkles, Volume2 } from 'lucide-react';
import { playSynthesizedStadiumRoar } from '../lib/stadium-audio';

interface LockerRoomVibesProps {
  teamName: string;
  formStreak?: '5_WIN_STREAK' | '3_LOSS_STREAK' | 'BALANCED' | 'FINISHED_SETTLED';
}

export const LockerRoomVibes: React.FC<LockerRoomVibesProps> = ({ teamName, formStreak }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playlist = formStreak === '5_WIN_STREAK' ? {
    genre: 'High-Tempo Trap & Afrobeat Hype ⚡',
    trackName: 'Arsenal Victory Anthem (Prod. Burna Boy x Travis Scott)',
    bpm: '142 BPM',
    vibeScore: '98% EXCITEMENT',
  } : {
    genre: 'Melancholic Lofi & Ambient Chill 🌧️',
    trackName: 'Rainy Night In ABA (Lofi Chill Beats)',
    bpm: '78 BPM',
    vibeScore: '42% EXCITEMENT',
  };

  const handlePlayVibe = () => {
    setIsPlayingAudio(!isPlayingAudio);
    playSynthesizedStadiumRoar();
  };

  return (
    <div className="p-4 rounded-3xl glass-panel border border-cyberPurple/40 space-y-3 font-mono text-xs shadow-xl">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyberPurple/20 text-cyberPurple border border-cyberPurple/40">
            <Music className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-xs">LOCKER ROOM VIBES 🎧</span>
        </div>

        <span className="px-2 py-0.5 rounded bg-cyberPurple/20 text-cyberPurple font-bold text-[9px] border border-cyberPurple/30">
          SPOTIFY VIBE Engine
        </span>
      </div>

      <div className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-2">
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span>TEAM FORM VIBE: <strong className="text-white">{teamName}</strong></span>
          <span className="text-gold font-bold">{playlist.bpm}</span>
        </div>

        <h4 className="font-extrabold text-white text-xs flex items-center space-x-1.5">
          <Radio className="w-3.5 h-3.5 text-stadiumGreen animate-pulse" />
          <span>{playlist.trackName}</span>
        </h4>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-stadiumGreen font-bold">{playlist.genre}</span>
          <button
            onClick={handlePlayVibe}
            className="px-3 py-1 rounded-xl bg-stadiumGreen text-black font-extrabold text-[10px] flex items-center space-x-1 hover:scale-105 transition-all"
          >
            <Volume2 className="w-3 h-3" />
            <span>{isPlayingAudio ? 'Pause Vibe' : 'Play Vibe 🎵'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

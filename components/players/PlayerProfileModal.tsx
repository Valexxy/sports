'use client';

import React from 'react';
import { X, Calendar, Flag, Activity, TrendingUp, Trophy, ArrowRight, Cake, Sparkles, Shield, Footprints } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { DeepPlayerEntity } from '../../lib/club-squad-database';

interface PlayerProfileModalProps {
  player: DeepPlayerEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBirthdays?: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  player,
  isOpen,
  onClose,
  onOpenBirthdays,
}) => {
  if (!isOpen || !player) return null;

  const handleBirthdayClick = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onClose();
    if (onOpenBirthdays) onOpenBirthdays();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d111a] rounded-3xl border-2 border-stadiumGreen/60 shadow-2xl p-4 sm:p-6 space-y-4 my-6 max-h-[92vh] overflow-y-auto text-white glow-emerald">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-xl bg-stadiumGreen text-black font-black text-sm flex items-center justify-center shadow">
              #{player.number}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-1.5">
                <span>{player.name}</span>
                <span>{player.natFlag}</span>
              </h2>
              <span className="text-[10px] text-gray-400 block">{player.specificRole} &bull; {player.currentClub}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Birthday Center Direct Banner */}
        <div
          onClick={handleBirthdayClick}
          className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-stadiumGreen/20 border border-pink-500/40 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-all shadow-lg group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-pink-500 text-white shadow">
              <Cake className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-white block group-hover:text-pink-300 transition-colors">
                🎂 Born {player.birthDate} (Age {player.age})
              </span>
              <span className="text-[10px] text-gray-300 font-sans">Tap to celebrate in Star Birthday Center 🎉</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Biodata Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400">Market Value</span>
            <strong className="block text-stadiumGreen text-xs">{player.marketValue}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400">Height / Weight</span>
            <strong className="block text-white text-xs">{player.height} / {player.weight}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400">Preferred Foot</span>
            <strong className="block text-white text-xs">{player.preferredFoot} Foot</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-gray-400">Nationality</span>
            <strong className="block text-white text-xs flex items-center space-x-1">
              <span>{player.natFlag}</span>
              <span>{player.nationality}</span>
            </strong>
          </div>
        </div>

        {/* Season Performance Metrics */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-gray-300 flex items-center space-x-1.5 border-b border-white/5 pb-1">
            <Activity className="w-3.5 h-3.5 text-stadiumGreen" />
            <span>2025/26 SEASON TELEMETRY</span>
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-400 block">Matches</span>
              <strong className="text-white text-sm">{player.seasonStats.appearances}</strong>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-400 block">Goals</span>
              <strong className="text-stadiumGreen text-sm">{player.seasonStats.goals}</strong>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-400 block">Assists</span>
              <strong className="text-gold text-sm">{player.seasonStats.assists}</strong>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-400 block">xG / xA</span>
              <strong className="text-white text-xs">{player.seasonStats.xG} / {player.seasonStats.xA}</strong>
            </div>
          </div>
        </div>

        {/* Match Footprints */}
        {player.matchFootprints && player.matchFootprints.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-black text-gray-300 flex items-center space-x-1.5 border-b border-white/5 pb-1">
              <Footprints className="w-3.5 h-3.5 text-stadiumGreen" />
              <span>MATCH FOOTPRINTS (LAST 5 GAMES)</span>
            </h3>
            <div className="space-y-1.5">
              {player.matchFootprints.map((fp, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img src={fp.opponentLogo} alt={fp.opponent} className="w-5 h-5 object-contain bg-black/50 p-0.5 rounded" onError={(e) => { (e.target as HTMLImageElement).src = 'https://crests.football-data.org/PL.png'; }} />
                    <div>
                      <span className="font-bold text-white block">vs {fp.opponent}</span>
                      <span className="text-[10px] text-gray-400 font-sans">{fp.date} &bull; {fp.minutes} mins</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-gray-300">{fp.goals}G, {fp.assists}A</span>
                    <span className="px-2 py-0.5 rounded-lg bg-stadiumGreen/20 text-stadiumGreen font-black text-xs border border-stadiumGreen/40">
                      ★ {fp.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Clubs */}
        {player.pastClubs && (
          <div className="space-y-2">
            <h3 className="text-xs font-black text-gray-300 flex items-center space-x-1.5 border-b border-white/5 pb-1">
              <Trophy className="w-3.5 h-3.5 text-gold" />
              <span>CAREER CLUB HISTORY</span>
            </h3>
            <div className="space-y-1.5">
              {player.pastClubs.map((c, i) => (
                <div key={i} className="p-2 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs text-gray-300">
                  <span>{c.club} ({c.years})</span>
                  <span className="text-[11px] text-gray-400">{c.apps} Apps &bull; {c.goals} Goals</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

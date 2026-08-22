'use client';

import React from 'react';
import { X, Trophy, Star } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface Talent {
  name: string;
  age: number;
  club: string;
  state: string;
  position: string;
  scoutRating: string;
  speed: string;
  goals: number;
  highlight: string;
}

const TALENTS: Talent[] = [
  {
    name: 'Chukwuemeka Okonkwo',
    age: 18,
    club: 'Beyond Limits FA',
    state: 'Ogun State, NG',
    position: 'Right Winger / Speedster',
    scoutRating: '9.4 / 10',
    speed: '34.8 km/h',
    goals: 14,
    highlight: 'Top Scorer NPFL Youth Championship 2024. Elite 1v1 dribble rate.',
  },
  {
    name: 'Abubakar Danladi',
    age: 19,
    club: 'Kano Pillars Academy',
    state: 'Kano State, NG',
    position: 'Central Midfielder / Anchor',
    scoutRating: '9.1 / 10',
    speed: '31.2 km/h',
    goals: 7,
    highlight: '92% pass completion. Exceptional spatial awareness under high press.',
  },
  {
    name: 'Godswill Ebuka',
    age: 17,
    club: 'Sporting Lagos Youth',
    state: 'Lagos State, NG',
    position: 'Centre Forward',
    scoutRating: '9.6 / 10',
    speed: '35.1 km/h',
    goals: 19,
    highlight: 'Lagos State Gold Cup MVP. Compared to Victor Osimhen for aerial power.',
  },
];

export const GrassrootsScoutingModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-3xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-2xl bg-stadiumGreen text-black font-black">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-white text-base flex items-center space-x-2">
              <span>NAIJA GRASSROOTS SCOUTING & NPFL RADAR 🇳🇬⚽</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-sans">
              Discovering the next Osimhen & Kanu across Nigeria. Backed by community sports funding.
            </p>
          </div>
        </div>

        {/* Stats Grid for VCs & Government Funders */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-gray-400 text-[10px] block uppercase">Scouted Talents</span>
            <span className="text-stadiumGreen font-black text-lg">1,240+ Kids</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-gray-400 text-[10px] block uppercase">Pitches Funded</span>
            <span className="text-gold font-black text-lg">36 States</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-gray-400 text-[10px] block uppercase">Offline USSD SMS</span>
            <span className="text-cyberPurple font-black text-lg">*384*99#</span>
          </div>
        </div>

        {/* Talents List */}
        <div className="space-y-2.5">
          <span className="text-[10px] text-stadiumGreen font-bold uppercase tracking-wider block">
            ⭐ Top Rated Nigerian Prospects (Live Radar)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TALENTS.map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold">
                    Age {t.age}
                  </span>
                  <span className="text-[10px] font-black text-gold">⭐ {t.scoutRating}</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-xs">{t.name}</h3>
                  <p className="text-[10px] text-gray-400">{t.position}</p>
                  <p className="text-[9px] text-stadiumGreen">{t.club} • {t.state}</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-[10px] space-y-1 text-gray-300">
                  <div className="flex justify-between">
                    <span>Sprint Speed:</span>
                    <strong className="text-white">{t.speed}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Goals:</span>
                    <strong className="text-gold">{t.goals}</strong>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-sans italic">{t.highlight}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

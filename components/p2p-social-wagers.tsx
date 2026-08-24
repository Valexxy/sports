'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { Swords, Trophy, Share2, Check, Flame, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface P2PWagersProps {
  matches: MatchData[];
}

export const P2PSocialWagers: React.FC<P2PWagersProps> = ({ matches }) => {
  const [selectedMatch, setSelectedMatch] = useState<string>('Arsenal vs Chelsea');
  const [pickedSide, setPickedSide] = useState<'HOME' | 'AWAY'>('HOME');
  const [auraStake, setAuraStake] = useState<number>(500);
  const [challengeCreated, setChallengeCreated] = useState<boolean>(false);
  const [challengeLink, setChallengeLink] = useState<string>('');

  const handleCreateChallenge = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdRoar();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    const link = `https://mivaj.com?challenge=${encodeURIComponent(selectedMatch)}&side=${pickedSide}&stake=${auraStake}`;
    setChallengeLink(link);
    setChallengeCreated(true);
  };

  const handleShareChallenge = () => {
    const text = `⚔️ *MIVAJ 1v1 P2P LOCK-IN CHALLENGE!* ⚔️\n\nI just locked in ${auraStake} Aura Points on *${selectedMatch}*!\n\nDo you dare to accept my challenge? 👉 ${challengeLink}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-cyan-400/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl glow-emerald">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-black font-black text-xl shadow-lg">
            ⚔️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                "LOCK-IN" P2P 1v1 SOCIAL WAGERS (AURA POINTS) 🤝
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black font-black text-[9px]">
                FREE-TO-PLAY BRAGGING RIGHTS
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Challenge friends on WhatsApp to 1-on-1 virtual bets & climb the Certified Ball Knower leaderboard.
            </p>
          </div>
        </div>
      </div>

      {/* Challenge Builder Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10">
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 font-bold">SELECT MATCH</label>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-panel border border-white/10 text-white font-mono text-xs focus:outline-none"
          >
            <option value="Arsenal vs Chelsea">Arsenal vs Chelsea</option>
            <option value="Real Madrid vs Barcelona">Real Madrid vs Barcelona</option>
            <option value="Man City vs Liverpool">Man City vs Liverpool</option>
            <option value="Enyimba vs Rangers">Enyimba vs Rangers</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 block mb-1 font-bold">YOUR PICK</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPickedSide('HOME')}
              className={`py-2 rounded-xl text-xs font-black ${
                pickedSide === 'HOME' ? 'bg-stadiumGreen text-black' : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              Home Win
            </button>
            <button
              onClick={() => setPickedSide('AWAY')}
              className={`py-2 rounded-xl text-xs font-black ${
                pickedSide === 'AWAY' ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              Away Win
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 block mb-1 font-bold">AURA STAKE</label>
          <div className="flex gap-2">
            {[200, 500, 1000].map((pts) => (
              <button
                key={pts}
                onClick={() => setAuraStake(pts)}
                className={`flex-1 py-2 rounded-xl text-xs font-black ${
                  auraStake === pts ? 'bg-gold text-black' : 'bg-white/5 text-gray-400 border border-white/10'
                }`}
              >
                {pts} pts
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-1">
        {challengeCreated ? (
          <button
            onClick={handleShareChallenge}
            className="px-6 py-3 rounded-2xl bg-[#25D366] text-black font-black text-xs flex items-center space-x-2 hover:scale-105 transition-all shadow-lg animate-bounce"
          >
            <Share2 className="w-4 h-4 text-black" />
            <span>Send Challenge to Friend on WhatsApp ➔</span>
          </button>
        ) : (
          <button
            onClick={handleCreateChallenge}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs flex items-center space-x-2 hover:scale-105 transition-all shadow-lg"
          >
            <Swords className="w-4 h-4" />
            <span>Lock In 1v1 Challenge ➔</span>
          </button>
        )}
      </div>

    </section>
  );
};

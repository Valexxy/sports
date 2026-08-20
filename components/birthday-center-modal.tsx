'use client';

import React, { useState } from 'react';
import { X, Cake, Sparkles, Share2, Heart, Download, MessageSquare, ExternalLink, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

export interface BirthdayPlayer {
  id: string;
  name: string;
  club: string;
  country: string;
  countryFlag: string;
  birthDate: string;
  age: number;
  position: string;
  photoUrl: string;
  trophies: string;
  quote: string;
  wishesCount: number;
}

const STAR_BIRTHDAYS: BirthdayPlayer[] = [
  {
    id: 'bday-1',
    name: 'Robert Lewandowski',
    club: 'FC Barcelona 🇪🇸',
    country: 'Poland',
    countryFlag: '🇵🇱',
    birthDate: 'August 21 (Tomorrow 🎂)',
    age: 36,
    position: 'Striker / Goal Machine',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/132145.png&w=350&h=254',
    trophies: '1x Champions League, 10x Bundesliga, 1x La Liga, Golden Shoe',
    quote: 'Hard work beats talent when talent doesn’t work hard.',
    wishesCount: 1420,
  },
  {
    id: 'bday-2',
    name: 'Bernardo Silva',
    club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    birthDate: 'August 10 (Celebrated 🌟)',
    age: 30,
    position: 'Attacking Midfielder',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/196602.png&w=350&h=254',
    trophies: '1x Champions League, 6x Premier League, UEFA Nations League',
    quote: 'Magician on the ball with relentless tactical pressing.',
    wishesCount: 980,
  },
  {
    id: 'bday-3',
    name: 'Thierry Henry',
    club: 'Arsenal Invincibles 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'France',
    countryFlag: '🇫🇷',
    birthDate: 'August 17 (Legend 👑)',
    age: 47,
    position: 'Striker / King of Highbury',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/352.png&w=350&h=254',
    trophies: '1x World Cup, 1x Euro, 2x Premier League (Invincible), 1x UCL',
    quote: 'Sometimes in football you have to score goals before you can think about style.',
    wishesCount: 3450,
  },
];

interface BirthdayCenterProps {
  onClose: () => void;
}

export const BirthdayCenterModal: React.FC<BirthdayCenterProps> = ({ onClose }) => {
  const [players, setPlayers] = useState(STAR_BIRTHDAYS);
  const [wishedPlayers, setWishedPlayers] = useState<Record<string, boolean>>({});
  const [activeSharePlayer, setActiveSharePlayer] = useState<BirthdayPlayer | null>(null);

  const handleWish = (player: BirthdayPlayer) => {
    if (wishedPlayers[player.id]) return;

    setWishedPlayers((prev) => ({ ...prev, [player.id]: true }));
    setPlayers((prev) =>
      prev.map((p) => (p.id === player.id ? { ...p, wishesCount: p.wishesCount + 1 } : p))
    );

    // Audio & Confetti Celebration
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#ec4899', '#a855f7'],
      });
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    }
  };

  const generateShareUrl = (player: BirthdayPlayer, platform: 'WHATSAPP' | 'TWITTER' | 'TELEGRAM') => {
    const text = encodeURIComponent(
      `🎂 Happy Birthday to football superstar ${player.name} (${player.age} yrs)! Wishing the star player many more trophies! 🌟 Celebrated on AuraScore Stadium 2.0 ⚡`
    );
    const url = encodeURIComponent('http://localhost:3000');

    if (platform === 'WHATSAPP') return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (platform === 'TWITTER') return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    return `https://t.me/share/url?url=${url}&text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-pink-500/40 p-6 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-lg text-white flex items-center space-x-2">
              <span>STAR BIRTHDAY LOUNGE 🎂</span>
              <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                AUGUST SPOTLIGHT
              </span>
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Celebrate your football heroes, send live fan wishes, and share viral birthday flex cards!
            </p>
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-4">
          {players.map((p) => {
            const hasWished = wishedPlayers[p.id];

            return (
              <div
                key={p.id}
                className="glass-panel-premium rounded-2xl p-4 border border-white/10 hover:border-pink-500/40 transition-all space-y-3 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  
                  {/* Player Info & Photo */}
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/10 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-base text-white">{p.name}</h3>
                        <span className="text-sm">{p.countryFlag}</span>
                      </div>
                      <span className="text-[11px] text-pink-400 font-bold block">{p.birthDate} • Turns {p.age}</span>
                      <span className="text-[10px] text-gray-400 font-sans block">{p.club} • {p.position}</span>
                    </div>
                  </div>

                  {/* Wishes Counter */}
                  <div className="text-right flex items-center sm:flex-col justify-between sm:justify-center w-full sm:w-auto">
                    <span className="text-gray-400 text-[10px] font-bold">FAN WISHES</span>
                    <span className="text-base font-black text-gold">{p.wishesCount.toLocaleString()} 🎉</span>
                  </div>

                </div>

                {/* Trophies & Quote */}
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-[11px]">
                  <div className="flex items-center space-x-1 text-stadiumGreen font-bold">
                    <Trophy className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="truncate">{p.trophies}</span>
                  </div>
                  <p className="text-gray-300 italic font-sans text-[10px]">"{p.quote}"</p>
                </div>

                {/* Actions: Wish Button & Gen-Z Card Share */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleWish(p)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      hasWished
                        ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50'
                        : 'bg-pink-500 hover:bg-pink-400 text-black shadow-md hover:scale-105 glow-emerald'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasWished ? 'fill-current' : ''}`} />
                    <span>{hasWished ? 'Wished! Happy Birthday 💖' : 'Wish Happy Birthday 🎉'}</span>
                  </button>

                  <button
                    onClick={() => setActiveSharePlayer(p)}
                    className="px-3.5 py-2.5 rounded-xl bg-panel hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all flex items-center space-x-1 hover:scale-105"
                    title="Generate Social Birthday Card"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gold" />
                    <span>Card</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Gen-Z Birthday Flex Card Modal */}
        {activeSharePlayer && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm glass-panel-premium rounded-3xl border border-pink-500/60 p-5 space-y-4 shadow-2xl text-center font-mono">
              
              <button
                onClick={() => setActiveSharePlayer(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Card Canvas */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-pink-950/70 via-black to-emerald-950/70 border border-pink-500/40 space-y-3 shadow-inner">
                <span className="text-[10px] text-gold font-black uppercase tracking-widest block">
                  🌟 OFFICIAL STADIUM BIRTHDAY TRIBUTE 🌟
                </span>

                <div className="w-20 h-20 mx-auto rounded-full bg-void border-2 border-pink-400 p-1 shadow-lg">
                  <img
                    src={activeSharePlayer.photoUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{activeSharePlayer.name}</h3>
                  <span className="text-xs text-pink-400 font-bold block">{activeSharePlayer.club}</span>
                  <span className="text-[11px] text-gray-300 font-sans block mt-1">Celebrating {activeSharePlayer.age} Years of Greatness! 🎂</span>
                </div>

                <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-[10px] text-gray-300">
                  <span className="text-stadiumGreen font-bold block">Celebrated by @CyberStriker_99</span>
                  <span>AuraScore Stadium 2.0 Community</span>
                </div>
              </div>

              {/* 1-Click Social Sharing Links */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] text-gray-400 font-bold block">SHARE WITH FRIENDS ON:</span>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={generateShareUrl(activeSharePlayer, 'WHATSAPP')}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] transition-all"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={generateShareUrl(activeSharePlayer, 'TWITTER')}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-[11px] transition-all"
                  >
                    Twitter / X
                  </a>
                  <a
                    href={generateShareUrl(activeSharePlayer, 'TELEGRAM')}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] transition-all"
                  >
                    Telegram
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

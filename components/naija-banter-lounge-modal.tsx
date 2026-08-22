'use client';

import React, { useState } from 'react';
import { X, Flame, Sparkles, Share2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface BanterModalProps {
  onClose: () => void;
}

interface RoastItem {
  id: string;
  club: string;
  roaster: string;
  roast: string;
  tag: string;
  hype: number;
}

const ROAST_FEED: RoastItem[] = [
  {
    id: 'r-1',
    club: 'Manchester United 🔴',
    roaster: '@Eze_Baller',
    roast: 'Man United fans don start their weekly CPR and emergency prayer session. Defender pass ball go own net say na tactical buildup! 😭💀',
    tag: 'Hospital FC',
    hype: 1420,
  },
  {
    id: 'r-2',
    club: 'Chelsea 🔵',
    roaster: '@Tunde_Strikr',
    roast: 'Boehly don sign 85 players with 9-year contracts, but match still end 1-1 with team wey just promote from Championship! Asylum FC 😂',
    tag: 'Contract Asylum',
    hype: 1890,
  },
  {
    id: 'r-3',
    club: 'Arsenal 🔴⚪',
    roaster: '@NaijaGunner_99',
    roast: 'December: "Trust the process, we are winning the quadruple!" May: "At least we scored the most corners in North London" 🍼',
    tag: 'Corner Trophy',
    hype: 2150,
  },
  {
    id: 'r-4',
    club: 'Real Madrid ⚪',
    roaster: '@Chidi_Madrid',
    roast: 'Real Madrid down 0-1 at 88th minute. Ref look watch, see say na Champions League, add 12 minutes extra time. Vini Jr score at 99th min. Pure Juju! 🧙‍♂️',
    tag: 'Juju FC',
    hype: 3200,
  },
  {
    id: 'r-5',
    club: 'Victor Osimhen & Galatasaray 🇹🇷',
    roaster: '@SuperEagle_Lover',
    roast: 'Osimhen wear mask land Istanbul, Turkish defenders start dey call their herbalist and orthopedic surgeon before kickoff! Ball no go rest! 🚀🇳🇬',
    tag: 'Masked Assassin',
    hype: 4500,
  },
  {
    id: 'r-6',
    club: 'Barcelona 🔵🔴',
    roaster: '@Kalu_Catalan',
    roast: 'Laporta don activate 18th economic lever to register ball boy and water bottle supplier. La Masia kids carry the whole defense on their shoulders! 👶',
    tag: 'Economic Lever FC',
    hype: 1980,
  },
];

export const NaijaBanterLoungeModal: React.FC<BanterModalProps> = ({ onClose }) => {
  const [feed, setFeed] = useState<RoastItem[]>(ROAST_FEED);
  const [selectedClub, setSelectedClub] = useState('Man United');
  const [userRoast, setUserRoast] = useState('');
  const [hypes, setHypes] = useState<Record<string, boolean>>({});

  const handleHype = (id: string) => {
    if (hypes[id]) return;
    setHypes((prev) => ({ ...prev, [id]: true }));
    setFeed((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hype: item.hype + 1 } : item))
    );
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handlePostRoast = () => {
    if (!userRoast.trim()) return;
    const newRoast: RoastItem = {
      id: 'r-' + Date.now(),
      club: selectedClub,
      roaster: '@CyberStriker_99',
      roast: userRoast.trim(),
      tag: 'Fresh Naija Burn 🔥',
      hype: 1,
    };
    setFeed([newRoast, ...feed]);
    setUserRoast('');
    stadiumAudio.playCrowdRoar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-crimson/50 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-crimson transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-2xl bg-crimson/20 border border-crimson/40 text-crimson">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h2 className="font-black text-white text-base flex items-center space-x-2">
              <span>NAIJA GEN-Z ROAST & BANTER LOUNGE 🎙️🔥</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-sans">
              No dulling! Real Nigerian club banter, hot takes, and viral locker room drama.
            </p>
          </div>
        </div>

        {/* Post Roast Box */}
        <div className="p-4 rounded-2xl bg-crimson/10 border border-crimson/30 space-y-2.5">
          <span className="text-[10px] text-crimson font-black uppercase tracking-wider block">
            🔥 Drop Your Hot Club Roast
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {['Man United', 'Arsenal', 'Chelsea', 'Real Madrid', 'Barcelona', 'Man City', 'Osimhen 🇳🇬'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClub(c)}
                className={'px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ' +
                  (selectedClub === c
                    ? 'bg-crimson text-white border-crimson shadow-md'
                    : 'bg-black/50 text-gray-400 border-white/10 hover:text-white')}
              >
                {c}
              </button>
            ))}
          </div>
          <textarea
            value={userRoast}
            onChange={(e) => setUserRoast(e.target.value)}
            placeholder={'Drop savage pidgin roast for ' + selectedClub + '...'}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 font-mono text-xs focus:border-crimson focus:outline-none"
          />
          <button
            onClick={handlePostRoast}
            disabled={!userRoast.trim()}
            className="w-full py-2.5 rounded-xl bg-crimson hover:bg-red-500 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Roast to Live Stadium Wire 🚀</span>
          </button>
        </div>

        {/* Live Feed */}
        <div className="space-y-3">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            ⚡ Trending Stadium Roasts
          </span>
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {feed.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-crimson/40 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-xs text-white">{item.club}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-crimson/20 text-crimson border border-crimson/30 font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-[9px] text-stadiumGreen font-bold">{item.roaster}</span>
                </div>
                <p className="text-gray-200 font-sans text-xs leading-relaxed font-medium">
                  "{item.roast}"
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <button
                    onClick={() => handleHype(item.id)}
                    className={'px-3 py-1 rounded-xl text-[10px] font-black flex items-center space-x-1 border transition-all ' +
                      (hypes[item.id]
                        ? 'bg-crimson text-white border-crimson'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:text-white')}
                  >
                    <Flame className="w-3 h-3 fill-current text-crimson" />
                    <span>{item.hype} Hypes</span>
                  </button>
                  <a
                    href={'https://api.whatsapp.com/send?text=' + encodeURIComponent('🔥 Naija Football Banter (' + item.club + '): "' + item.roast + '" - Bantered on AuraScore Stadium ⚡')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

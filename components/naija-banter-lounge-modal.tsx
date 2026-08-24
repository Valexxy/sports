'use client';
import React, { useState } from 'react';
import { X, Flame, Share2, Send, Shuffle, Bot } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface BanterModalProps {
  onClose: () => void;
}

export interface RoastItem {
  id: string;
  club: string;
  roaster: string;
  roast: string;
  tag: string;
  hype: number;
}

const AI_ROAST_VAULT: RoastItem[] = [
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
  {
    id: 'r-7',
    club: 'Man City 🩵',
    roaster: '@PepTactics_Naija',
    roast: 'Haaland touch ball 3 times in 90 minutes and score 4 goals. Man is literally a robotic cheat code plugged into Etihad electricity grid! 🤖⚡',
    tag: 'Robotic Cheat',
    hype: 2800,
  },
  {
    id: 'r-8',
    club: 'Tottenham ⚪',
    roaster: '@LondonBanter',
    roast: 'Tottenham trophy cabinet is currently being rented out as a 2-bedroom self-contain apartment in Lekki Phase 1 for 4 million Naira! 🏠💀',
    tag: 'Dusty Cabinet',
    hype: 3100,
  },
  {
    id: 'r-9',
    club: 'Liverpool 🔴',
    roaster: '@KloppVibes',
    roast: 'Arne Slot come Anfield with glossy bald head, pass ball like prime Barca. Defense say no panic, na high line heavy metal rock and roll! 🎸',
    tag: 'Gegenpress Heavy',
    hype: 2450,
  },
  {
    id: 'r-10',
    club: 'Enyimba & NPFL 🇳🇬',
    roaster: '@AbaBoy_NPFL',
    roast: 'Aba stadium grass so green even cows want scholarship to graze there! Away team keeper dey catch cold because defense tight pass iron gate! 🛡️⚽',
    tag: 'Peoples Elephant',
    hype: 2900,
  },
];

export const NaijaBanterLoungeModal: React.FC<BanterModalProps> = ({ onClose }) => {
  const [feed, setFeed] = useState<RoastItem[]>(AI_ROAST_VAULT);
  const [selectedClub, setSelectedClub] = useState('Man United');
  const [userRoast, setUserRoast] = useState('');
  const [hypes, setHypes] = useState<Record<string, boolean>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiRoast = () => {
    setIsGeneratingAi(true);
    stadiumAudio.playCrowdRoar();

    setTimeout(() => {
      const randomRoast = AI_ROAST_VAULT[Math.floor(Math.random() * AI_ROAST_VAULT.length)];
      const freshAiRoast: RoastItem = {
        id: 'ai-' + Date.now(),
        club: randomRoast.club,
        roaster: '🤖 AuraAI Roaster',
        roast: randomRoast.roast,
        tag: '⚡ AI LIVE DROP',
        hype: Math.floor(500 + Math.random() * 2500),
      };

      setFeed([freshAiRoast, ...feed]);
      setIsGeneratingAi(false);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.4 } });
    }, 600);
  };

  const handleHype = (id: string) => {
    if (hypes[id]) return;
    setHypes((prev) => ({ ...prev, [id]: true }));
    setFeed((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hype: item.hype + 1 } : item))
    );
    stadiumAudio.playCrowdRoar();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handlePostRoast = () => {
    if (!userRoast.trim()) return;
    const newRoast: RoastItem = {
      id: 'r-' + Date.now(),
      club: selectedClub,
      roaster: typeof window !== 'undefined' && localStorage.getItem('aurascore_user_name') ? '@' + localStorage.getItem('aurascore_user_name') : '@James_Baller',
      roast: userRoast.trim(),
      tag: 'Fresh Naija Burn 🔥',
      hype: 1,
    };
    setFeed([newRoast, ...feed]);
    setUserRoast('');
    stadiumAudio.playCrowdRoar();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-crimson/50 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-crimson transition-all hover:rotate-90 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-crimson/20 border border-crimson/40 text-crimson">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-white text-base flex items-center space-x-2">
                <span>NAIJA GEN-Z ROAST & BANTER LOUNGE 🎙️🔥</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                Live Nigerian club banter, viral football slander, and locker room drama.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAiRoast}
            disabled={isGeneratingAi}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-crimson to-amber-600 hover:from-crimson hover:to-amber-500 text-white font-black text-[11px] shadow-lg shadow-crimson/30 transition-all flex items-center space-x-1.5 self-start sm:self-auto disabled:opacity-50"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span>{isGeneratingAi ? 'Synthesizing Roast...' : '🤖 AI Random Roast Drop'}</span>
          </button>
        </div>

        {/* Post Roast Box */}
        <div className="p-4 rounded-2xl bg-crimson/10 border border-crimson/30 space-y-2.5">
          <span className="text-[10px] text-crimson font-black uppercase tracking-wider block">
            🔥 Drop Your Hot Club Roast
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {['Man United', 'Arsenal', 'Chelsea', 'Real Madrid', 'Barcelona', 'Man City', 'Liverpool', 'Tottenham', 'Osimhen 🇳🇬'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClub(c)}
                className={'px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all flex-shrink-0 ' +
                  (selectedClub === c
                    ? 'bg-crimson text-white border-crimson shadow-md'
                    : 'bg-black/50 text-gray-400 border-white/10 hover:text-white')}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userRoast}
              onChange={(e) => setUserRoast(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostRoast()}
              placeholder={`Drop spicy ${selectedClub} slander or banter here...`}
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-crimson font-mono"
            />
            <button
              onClick={handlePostRoast}
              className="px-4 py-2 rounded-xl bg-crimson hover:bg-rose-600 text-white font-black text-xs transition-all flex items-center space-x-1 shadow-md shadow-crimson/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Roast</span>
            </button>
          </div>
        </div>

        {/* Roast Stream Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              🔥 LIVE BANTER FEED ({feed.length} Roasts)
            </span>
            <button
              onClick={handleGenerateAiRoast}
              className="text-[10px] text-gold hover:text-amber-300 font-bold flex items-center space-x-1"
            >
              <Shuffle className="w-3 h-3" />
              <span>Shuffle AI Roasts</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {feed.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-crimson/40 space-y-2 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-crimson text-xs">{item.club}</span>
                    <span className="text-[10px] text-gray-400 font-sans">{item.roaster}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-crimson/20 text-crimson font-bold text-[9px]">
                    {item.tag}
                  </span>
                </div>

                <p className="text-white text-xs font-sans leading-relaxed">{item.roast}</p>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  <button
                    onClick={() => handleHype(item.id)}
                    className={'flex items-center space-x-1 px-2.5 py-1 rounded-xl transition-all ' +
                      (hypes[item.id]
                        ? 'bg-crimson text-white font-black shadow-md'
                        : 'bg-white/5 hover:bg-crimson/20 text-gray-400 hover:text-white')}
                  >
                    <Flame className={'w-3.5 h-3.5 ' + (hypes[item.id] ? 'fill-current' : '')} />
                    <span>{item.hype.toLocaleString()} Hypes</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: item.club, text: item.roast, url: window.location.href });
                      }
                    }}
                    className="text-gray-400 hover:text-white flex items-center space-x-1 p-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

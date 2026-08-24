'use client';
import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Zap
} from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface CollapsibleHubProps {
  onOpenGrassroots: () => void;
  onOpenBanter: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenLedger: () => void;
  onOpenBankroll: () => void;
  onOpenReceipt: () => void;
}

export const CollapsibleStadiumHub: React.FC<CollapsibleHubProps> = ({
  onOpenGrassroots,
  onOpenBanter,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenLedger,
  onOpenBankroll,
  onOpenReceipt,
}) => {
  const { t } = useTranslation();
  const [showAllSuites, setShowAllSuites] = useState(false);

  const allHubFeatures = [
    {
      id: 'grassroots',
      title: 'Grassroots Scouting 🇳🇬⚽',
      tag: 'PRO RADAR',
      tagColor: 'bg-stadiumGreen text-black',
      desc: 'Discover next Osimhen & Kanu. Watch scouting reels, vote wonderkids, and submit talent.',
      icon: '⭐',
      action: onOpenGrassroots,
      btnLabel: 'Scouting Radar ➔',
    },
    {
      id: 'banter',
      title: 'Gen-Z Banter Lounge 🔥',
      tag: 'VIRAL MEMES',
      tagColor: 'bg-crimson text-white',
      desc: 'Nigerian football banter, spicy locker-room burns, club memes, and viral roasts.',
      icon: '🎙️',
      action: onOpenBanter,
      btnLabel: 'Banter Lounge ➔',
    },
    {
      id: 'birthdays',
      title: 'Star Birthdays & Wishes 🎂',
      tag: 'CELEBRATIONS',
      tagColor: 'bg-pink-500 text-white',
      desc: 'Football star birthdays this week. Send wishes, cheer with crowd audio, and share on WhatsApp.',
      icon: '🎂',
      action: onOpenBirthdays,
      btnLabel: 'Send Wishes 🎉 ➔',
    },
    {
      id: 'leaderboard',
      title: 'Golden Boy Leaderboard 🏆',
      tag: 'TOP PUNTERS',
      tagColor: 'bg-gold text-black',
      desc: 'Official ranking of top Nigerian punters, highest win streaks, and wonderkid voting charts.',
      icon: '🏆',
      action: onOpenLeaderboard,
      btnLabel: 'Leaderboard ➔',
    },
    {
      id: 'ledger',
      title: 'Settlement Ledger 📜',
      tag: '100% AUDITED',
      tagColor: 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40',
      desc: 'Full transparent calendar of settled picks, verified match outcomes, and banker audits.',
      icon: '📜',
      action: onOpenLedger,
      btnLabel: 'Audit Ledger ➔',
    },
    {
      id: 'bankroll',
      title: 'Bankroll & Staking Lab 💰',
      tag: 'PRO STAKING',
      tagColor: 'bg-cyberPurple text-white',
      desc: 'Mathematical position-sizing and bankroll risk management based on live Poisson probabilities.',
      icon: '💰',
      action: onOpenBankroll,
      btnLabel: 'Bankroll Lab ➔',
    },
  ];

  const displayedFeatures = showAllSuites ? allHubFeatures : allHubFeatures.slice(0, 3);

  return (
    <section className="font-mono text-xs space-y-3">
      {/* Header Banner */}
      <div className="glass-panel-premium p-3 sm:p-4 rounded-3xl border-2 border-stadiumGreen/50 flex items-center justify-between shadow-xl glow-emerald select-none">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-stadiumGreen animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-white text-xs sm:text-base">
                STADIUM & VIRAL HUB ⚡🇳🇬
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                {allHubFeatures.length} SUITES
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5 hidden sm:block">
              Top 3 featured suites &bull; Tap &quot;Load More Suites&quot; to reveal the full ecosystem.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowAllSuites(!showAllSuites)}
          className="px-3 py-1.5 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen transition-all flex items-center space-x-1 flex-shrink-0 text-[10px] font-black"
        >
          <span>{showAllSuites ? 'Show Top 3' : 'Load More Suites (3 More)'}</span>
          {showAllSuites ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Grid: 3 Items by Default, 6 when Expanded */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 animate-fadeIn">
        {displayedFeatures.map((feat) => (
          <div
            key={feat.id}
            onClick={feat.action}
            className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-stadiumGreen/60 space-y-2 sm:space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xl sm:text-2xl">{feat.icon}</span>
                <span className={'px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full font-black text-[8px] sm:text-[9px] ' + feat.tagColor}>
                  {feat.tag}
                </span>
              </div>

              <h3 className="font-black text-white text-xs sm:text-sm group-hover:text-stadiumGreen transition-colors line-clamp-1">
                {feat.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-sans mt-0.5 sm:mt-1 leading-relaxed line-clamp-2">
                {feat.desc}
              </p>
            </div>

            <div className="pt-1.5 sm:pt-2 border-t border-white/10 flex items-center justify-between text-stadiumGreen text-[9px] sm:text-[10px] font-black group-hover:translate-x-1 transition-transform">
              <span className="truncate">{feat.btnLabel}</span>
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Load More Pill for Easy Mobile Access */}
      {!showAllSuites && (
        <div className="text-center pt-1">
          <button
            onClick={() => setShowAllSuites(true)}
            className="px-4 py-2 rounded-2xl bg-panel hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-mono text-[11px] font-bold inline-flex items-center space-x-1.5 transition-all"
          >
            <span>Load Remaining 3 Suites (Leaderboard, Ledger, Bankroll)</span>
            <ChevronDown className="w-3.5 h-3.5 text-stadiumGreen" />
          </button>
        </div>
      )}
    </section>
  );
};

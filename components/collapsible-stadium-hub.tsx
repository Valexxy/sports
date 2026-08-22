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
  const [isExpanded, setIsExpanded] = useState(true);

  const hubFeatures = [
    {
      id: 'grassroots',
      title: 'Naija Grassroots Scouting 🇳🇬⚽',
      tag: 'NEW PRO RADAR',
      tagColor: 'bg-stadiumGreen text-black',
      desc: 'Discover next Osimhen & Kanu. Watch scouting videos, vote wonderkids, and submit talent.',
      icon: '⭐',
      action: onOpenGrassroots,
      btnLabel: 'Open Scouting Radar ➔',
    },
    {
      id: 'banter',
      title: 'Gen-Z Roast & Banter Lounge 🔥',
      tag: 'AI POWERED',
      tagColor: 'bg-crimson text-white',
      desc: 'Dynamic AI Nigerian football slander, spicy locker-room burns, club memes, and viral roasts.',
      icon: '🎙️',
      action: onOpenBanter,
      btnLabel: 'Enter Banter Lounge ➔',
    },
    {
      id: 'birthdays',
      title: 'Star Birthdays & Fan Wishes 🎂',
      tag: 'CELEBRATIONS',
      tagColor: 'bg-pink-500 text-white',
      desc: 'Football star birthdays this week. Send wishes, cheer with crowd audio, and share on WhatsApp.',
      icon: '🎂',
      action: onOpenBirthdays,
      btnLabel: 'Send Wishes 🎉 ➔',
    },
    {
      id: 'leaderboard',
      title: 'Community Golden Boy Leaderboard 🏆',
      tag: 'TOP PUNTERS',
      tagColor: 'bg-gold text-black',
      desc: 'Official ranking of top Nigerian punters, highest streaks, and wonderkid voting charts.',
      icon: '🏆',
      action: onOpenLeaderboard,
      btnLabel: 'View Leaderboard ➔',
    },
    {
      id: 'ledger',
      title: 'Settlement Ledger & Banker Records 📜',
      tag: '100% AUDITED',
      tagColor: 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40',
      desc: 'Full transparent calendar of settled picks, verified match outcomes, and banker audits.',
      icon: '📜',
      action: onOpenLedger,
      btnLabel: 'Audit Record Ledger ➔',
    },
    {
      id: 'bankroll',
      title: 'Kelly Criterion Bankroll Calculator 💰',
      tag: 'PRO STAKING',
      tagColor: 'bg-cyberPurple text-white',
      desc: 'Mathematical position-sizing and bankroll risk management based on live Poisson probabilities.',
      icon: '💰',
      action: onOpenBankroll,
      btnLabel: 'Open Bankroll Lab ➔',
    },
  ];

  return (
    <section className="font-mono text-xs space-y-3">
      {/* Collapsible Header Banner */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-panel-premium p-3.5 sm:p-4 rounded-3xl border-2 border-stadiumGreen/50 cursor-pointer flex items-center justify-between shadow-xl hover:border-stadiumGreen transition-all glow-emerald group select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple p-0.5 shadow-lg group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-stadiumGreen animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-white text-sm sm:text-base">
                STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                {hubFeatures.length} SUITES
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5 hidden sm:block">
              Everything in the Stadium Hub brought out live: Scouting, AI Roasts, Birthdays, Leaderboard & Bankroll.
            </p>
          </div>
        </div>

        <button className="p-2 rounded-2xl bg-black/60 border border-white/10 text-stadiumGreen group-hover:text-white transition-all flex items-center space-x-1">
          <span className="text-[10px] font-black hidden sm:inline">
            {isExpanded ? 'Collapse' : 'Expand All'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Interactive Suite Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
          {hubFeatures.map((feat) => (
            <div
              key={feat.id}
              onClick={feat.action}
              className="p-4 rounded-3xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-stadiumGreen/60 space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{feat.icon}</span>
                  <span className={'px-2 py-0.5 rounded-full font-black text-[9px] ' + feat.tagColor}>
                    {feat.tag}
                  </span>
                </div>

                <h3 className="font-black text-white text-sm group-hover:text-stadiumGreen transition-colors">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-gray-400 font-sans mt-1 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-stadiumGreen text-[10px] font-black group-hover:translate-x-1 transition-transform">
                <span>{feat.btnLabel}</span>
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

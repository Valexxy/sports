'use client';

import React from 'react';
import { Mic, Cake, FileText, Search, Trophy, PieChart, Sparkles, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface StadiumViralHubProps {
  onOpenGrassroots: () => void;
  onOpenBanter: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenLedger: () => void;
  onOpenBankroll: () => void;
}

export const StadiumAndViralHub: React.FC<StadiumViralHubProps> = ({
  onOpenGrassroots,
  onOpenBanter,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenLedger,
  onOpenBankroll,
}) => {
  const suites = [
    {
      id: "banter",
      title: "Gen-Z Banter Lounge 🔥",
      tag: "VIRAL MEMES",
      desc: "Nigerian football banter, locker-room burns, club memes, and viral roasts.",
      icon: Mic,
      color: "from-orange-500/20 to-red-500/20",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      action: onOpenBanter,
    },
    {
      id: "birthdays",
      title: "Star Birthdays & Wishes 🎂",
      tag: "CELEBRATIONS",
      desc: "Star birthdays for this week. Send wishes, play stadium cheers & share on WhatsApp.",
      icon: Cake,
      color: "from-pink-500/20 to-purple-500/20",
      badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      action: onOpenBirthdays,
    },
    {
      id: "ledger",
      title: "Settlement Ledger 📜",
      tag: "100% AUDITED",
      desc: "Clear calendar of settled picks, true referee match results & winning streaks.",
      icon: FileText,
      color: "from-emerald-500/20 to-teal-500/20",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      action: onOpenLedger,
    },
    {
      id: "scouting",
      title: "Grassroots Scouting 🔍",
      tag: "AFRICAN TALENT",
      desc: "Discover local NPFL, street football, and academy wonderkids before they blow up.",
      icon: Search,
      color: "from-cyan-500/20 to-blue-500/20",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      action: onOpenGrassroots,
    },
    {
      id: "leaderboard",
      title: "Tipster Leaderboard 🏆",
      tag: "TOP PREDICTORS",
      desc: "Follow the top verified community predictors ranked by accuracy and yield.",
      icon: Trophy,
      color: "from-yellow-500/20 to-amber-500/20",
      badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      action: onOpenLeaderboard,
    },
    {
      id: "bankroll",
      title: "Bankroll & Staking 📊",
      tag: "KELLY FORMULA",
      desc: "Institutional staking plans, risk curves, and bankroll discipline calculator.",
      icon: PieChart,
      color: "from-purple-500/20 to-indigo-500/20",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      action: onOpenBankroll,
    },
  ];

  return (
    <section className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 rounded-full bg-stadiumGreen" />
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-stadiumGreen" />
            <span>STADIUM &amp; VIRAL COMMUNITY HUB 🇳🇬</span>
          </h2>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold">
          6 Active Suites
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {suites.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              onClick={() => {
                phoneHardware.triggerHaptic("SELECTION");
                stadiumAudio.playAddPickSound();
                s.action();
              }}
              className="p-4 rounded-2xl bg-[#0d111a] border border-white/[0.08] hover:border-stadiumGreen/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)] group cursor-pointer flex flex-col justify-between space-y-3 glow-emerald"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 group-hover:border-stadiumGreen/40 transition-colors">
                    <Icon className="w-5 h-5 text-stadiumGreen group-hover:scale-110 transition-transform" />
                  </div>
                  <span className={"px-2.5 py-0.5 rounded-full text-[9px] font-black border " + s.badgeColor}>
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-stadiumGreen transition-colors">
                  {s.title}
                </h3>

                <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2">
                  {s.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stadiumGreen font-bold">
                <span>Explore Suite</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
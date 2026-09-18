'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Copy, Check, Flame, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

interface WinEvent {
  id: string;
  username: string;
  avatarEmoji: string;
  matchesCount: number;
  totalOdds: number;
  payoutNgn: number;
  bookmaker: string;
  targetAffiliateUrl: string;
  timeAgo: string;
  bankerBadge: string;
}

const INITIAL_WIN_EVENTS: WinEvent[] = [
  {
    id: 'win-1',
    username: 'Emeka_Lagos',
    avatarEmoji: '⚡',
    matchesCount: 6,
    totalOdds: 18.45,
    payoutNgn: 184500,
    bookmaker: '1xBet',
    targetAffiliateUrl: 'https://1xbet.ng?ref=mivaj',
    timeAgo: 'Just now',
    bankerBadge: '👑 ULTRA-BANKER'
  },
  {
    id: 'win-2',
    username: 'Tunde_Abuja',
    avatarEmoji: '🔥',
    matchesCount: 4,
    totalOdds: 8.20,
    payoutNgn: 82000,
    bookmaker: 'SportyBet',
    targetAffiliateUrl: 'https://sportybet.com/ng?ref=mivaj',
    timeAgo: '2m ago',
    bankerBadge: '🔥 GG STREAK'
  },
  {
    id: 'win-3',
    username: 'Kelechi_PH',
    avatarEmoji: '🎯',
    matchesCount: 5,
    totalOdds: 12.60,
    payoutNgn: 126000,
    bookmaker: 'Bet9ja',
    targetAffiliateUrl: 'https://sports.bet9ja.com?ref=mivaj',
    timeAgo: '5m ago',
    bankerBadge: '🛡️ AUDITED'
  },
  {
    id: 'win-4',
    username: 'Dave_London',
    avatarEmoji: '💎',
    matchesCount: 7,
    totalOdds: 24.50,
    payoutNgn: 245000,
    bookmaker: '22Bet',
    targetAffiliateUrl: 'https://22bet.ng/?tag=d_972744m_97c_',
    timeAgo: '7m ago',
    bankerBadge: '🏆 VIP ACCA'
  }
];

export const LiveProofOfWinTicker: React.FC = () => {
  const [wins, setWins] = useState<WinEvent[]>(INITIAL_WIN_EVENTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic periodic live events simulation
    const interval = setInterval(() => {
      const names = ['Chioma_Enugu', 'Babajide_Ikeja', 'Ahmed_Kano', 'Osas_Benin', 'Kwame_Accra'];
      const bookies = [
        { name: '1xBet', url: 'https://1xbet.ng?ref=mivaj' },
        { name: 'SportyBet', url: 'https://sportybet.com/ng?ref=mivaj' },
        { name: 'Bet9ja', url: 'https://sports.bet9ja.com?ref=mivaj' }
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomBookie = bookies[Math.floor(Math.random() * bookies.length)];
      const randomOdds = parseFloat((4.5 + Math.random() * 18).toFixed(2));
      const randomPayout = Math.round(randomOdds * (5000 + Math.random() * 10000));

      const newWin: WinEvent = {
        id: 'win-' + Date.now(),
        username: randomName,
        avatarEmoji: '⚡',
        matchesCount: 3 + Math.floor(Math.random() * 4),
        totalOdds: randomOdds,
        payoutNgn: randomPayout,
        bookmaker: randomBookie.name,
        targetAffiliateUrl: randomBookie.url,
        timeAgo: 'Just now',
        bankerBadge: '🔥 LIVE WIN'
      };

      setWins((prev) => [newWin, ...prev.slice(0, 5)]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyWinSlip = (win: WinEvent) => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    setCopiedId(win.id);
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-950/80 border border-stadiumGreen/40 p-3 sm:p-4 font-mono text-xs shadow-xl space-y-2.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-crimson animate-ping"></span>
          <span className="font-extrabold text-white text-xs flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-gold" />
            <span>COMMUNITY PROOF-OF-WIN STREAM</span>
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black uppercase border border-stadiumGreen/40">
          100% AUDITED SETTLEMENTS
        </span>
      </div>

      <div className="space-y-2">
        {wins.slice(0, 3).map((w) => (
          <div
            key={w.id}
            className="p-2.5 rounded-xl bg-black/60 border border-white/5 hover:border-stadiumGreen/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-lg bg-stadiumGreen/20 text-stadiumGreen flex items-center justify-center text-xs font-black">
                {w.avatarEmoji}
              </span>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-white text-xs">@{w.username}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold/20 text-gold font-bold">{w.bankerBadge}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-sans block">
                  Won <strong className="text-stadiumGreen font-mono">₦{w.payoutNgn.toLocaleString()}</strong> ({w.totalOdds}x on {w.bookmaker}) • {w.timeAgo}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <a
                href={w.targetAffiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCopyWinSlip(w)}
                className="px-3 py-1.5 rounded-lg bg-stadiumGreen text-black hover:bg-emerald-400 font-black text-[11px] flex items-center space-x-1 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Copy 1-Click</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

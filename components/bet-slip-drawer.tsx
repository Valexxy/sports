'use client';
import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ExternalLink, Zap, ShieldCheck, Check, Copy, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export interface BetItem {
  matchId: string;
  matchTitle: string;
  selection: string;
  odds: number;
}

interface BetSlipProps {
  items: BetItem[];
  onRemoveItem: (index: number) => void;
  onClearAll: () => void;
  isOpenControlled?: boolean;
  onToggleControlled?: () => void;
}

export const BetSlipDrawer: React.FC<BetSlipProps> = ({ 
  items, 
  onRemoveItem, 
  onClearAll,
  isOpenControlled,
  onToggleControlled,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpenControlled !== undefined ? isOpenControlled : internalOpen;
  const toggleOpen = onToggleControlled || (() => setInternalOpen(!internalOpen));
  const [stake, setStake] = useState(1000);
  const [copiedBookmaker, setCopiedBookmaker] = useState<string | null>(null);

  if (items.length === 0) return null;

  const totalOdds = items.reduce((acc, curr) => acc * (curr.odds || 1.25), 1);
  const potentialPayout = Math.round(stake * totalOdds);
  const averageOdd = Math.pow(totalOdds, 1 / Math.max(1, items.length));
  const cut1Payout = Math.round((potentialPayout / averageOdd) * 0.85);

  // Deterministic realistic booking codes
  const seed = items.reduce((acc, it) => acc + it.matchTitle.length + (it.odds * 10), 0);
  const sportyCode = `SB${(Math.abs(seed * 37) % 89999 + 10000).toString()}`;
  const bet9jaCode = `B9-${(Math.abs(seed * 73) % 8999 + 1000).toString(36).toUpperCase()}`;
  const onexCode = `1X-${(Math.abs(seed * 19) % 899999 + 100000).toString()}`;

  const AFFILIATE_BOOKMAKERS = [
    {
      id: '22bet',
      name: '22Bet (₦250,000 Bonus)',
      url: process.env.NEXT_PUBLIC_22BET_AFFILIATE_URL || 'https://22bet.com.ng/?tag=972744',
      badge: 'TOP BONUS 🎁',
      bgClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      borderClass: 'border-emerald-400',
      code: 'AUTO-LOADED',
    },
    {
      id: 'stake',
      name: 'Stake.com (VIP Club)',
      url: process.env.NEXT_PUBLIC_STAKE_AFFILIATE_URL || 'https://stake.com/?c=bPn8D0iA',
      badge: 'CRYPTO & FIAT ⚡',
      bgClass: 'bg-blue-600 hover:bg-blue-500 text-white',
      borderClass: 'border-blue-400',
      code: 'VIP-SLIP',
    },
    {
      id: 'sportybet',
      name: `SportyBet (${sportyCode})`,
      url: 'https://www.sportybet.com/ng/',
      badge: 'FASTEST PAYOUT 🟢',
      bgClass: 'bg-red-600 hover:bg-red-500 text-white',
      borderClass: 'border-red-400',
      code: sportyCode,
    },
    {
      id: 'bet9ja',
      name: `Bet9ja (${bet9jaCode})`,
      url: 'https://sports.bet9ja.com/',
      badge: 'NAIJA #1 🔴',
      bgClass: 'bg-green-700 hover:bg-green-600 text-white',
      borderClass: 'border-green-400',
      code: bet9jaCode,
    },
  ];

  const handleOpenAffiliate = (bm: typeof AFFILIATE_BOOKMAKERS[0]) => {
    // Copy booking code / slip text to clipboard
    const text = 
      '🔥 MIVAJ SPORTS MULTI-SPORT SLIP (' + items.length + ' LEGS) 🔥\n\n' +
      items.map((it, idx) => (idx + 1) + '. ' + it.matchTitle + ' ➔ ' + it.selection + ' @ ' + it.odds).join('\n') +
      '\n\nTotal Odds: @' + totalOdds.toFixed(2) +
      '\nBooking Code: ' + bm.code +
      '\nPlace Live on: ' + bm.url;

    navigator.clipboard.writeText(bm.code !== 'AUTO-LOADED' && bm.code !== 'VIP-SLIP' ? bm.code : text);
    setCopiedBookmaker(bm.id);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCoinCashout();

    // Directly open the affiliate website in new tab
    window.open(bm.url, '_blank', 'noopener,noreferrer');

    setTimeout(() => setCopiedBookmaker(null), 3000);
  };

  const handleCopyFullSlipText = () => {
    const text = 
      '🔥 MIVAJ SPORTS MULTI-SPORT SLIP (' + items.length + ' LEGS) 🔥\n\n' +
      items.map((it, idx) => (idx + 1) + '. ' + it.matchTitle + ' ➔ ' + it.selection + ' @ ' + it.odds).join('\n') +
      '\n\nTotal Odds: @' + totalOdds.toFixed(2) +
      '\nStake: ₦' + stake.toLocaleString() + ' ➔ Est. Return: ₦' + potentialPayout.toLocaleString() +
      '\nSportyBet: ' + sportyCode + ' | Bet9ja: ' + bet9jaCode +
      '\nPlace Live on https://mivaj.com';

    navigator.clipboard.writeText(text);
    setCopiedBookmaker('ALL');
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCoinCashout();
    setTimeout(() => setCopiedBookmaker(null), 2500);
  };

  return (
    <>
      {/* Floating Bottom Control Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-[#070c18] rounded-2xl p-3 border-2 border-stadiumGreen shadow-2xl shadow-black flex items-center justify-between animate-fadeIn font-mono">
        <button
          onClick={toggleOpen}
          className="flex items-center space-x-3 text-left hover:opacity-90 transition-all flex-1"
        >
          <div className="relative p-2.5 rounded-xl bg-stadiumGreen text-black font-black">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-stadiumGreen text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border border-stadiumGreen">
              {items.length}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-white font-mono">BET SLIP ({items.length} LEGS)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-black border border-stadiumGreen/30">
                ACTIVE
              </span>
            </div>
            <span className="text-xs font-mono text-gold font-black">Total Odds: @{totalOdds.toFixed(2)}</span>
          </div>
        </button>

        <button
          onClick={toggleOpen}
          className="px-4 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-all font-mono active:scale-95"
        >
          {open ? 'Hide Slip' : 'View Slip ➔'}
        </button>
      </div>

      {/* Expanded Modal / Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-mono">
          <div className="glass-panel-premium w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl border-2 border-stadiumGreen p-4 sm:p-5 space-y-4 shadow-2xl flex flex-col text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
                  ⚽
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">ACTIVE BET SLIP ({items.length} LEGS)</h3>
                  <span className="text-[10px] text-stadiumGreen font-bold font-mono">Total Combined Odds: @{totalOdds.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onClearAll}
                  className="p-1.5 rounded-xl bg-crimson/20 text-crimson hover:bg-crimson hover:text-white transition-colors text-xs font-bold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Clear</span>
                </button>
                <button
                  onClick={toggleOpen}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Selections List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[25vh]">
              {items.map((it, idx) => (
                <div
                  key={it.matchId + '-' + idx}
                  className="p-2.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between hover:border-stadiumGreen/40 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                    <span className="text-[9px] text-gray-400 font-bold block">LEG {idx + 1}</span>
                    <h4 className="font-bold text-xs text-white truncate">{it.matchTitle}</h4>
                    <span className="text-[10px] text-stadiumGreen font-black block truncate">{it.selection}</span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-xs font-black text-gold font-mono">@{it.odds}</span>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-gray-500 hover:text-crimson transition-colors p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stake Selector & Return Calculation */}
            <div className="p-3 rounded-2xl bg-black/80 border border-white/10 space-y-2 flex-shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold">STAKE (₦):</span>
                <div className="flex gap-1.5">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setStake(amt)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                        stake === amt ? 'bg-gold text-black shadow' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                <div>
                  <span className="text-[9px] text-gray-400 block font-bold">POTENTIAL WIN:</span>
                  <span className="text-sm font-black text-stadiumGreen font-mono">₦{potentialPayout.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-amber-400 block font-bold">CUT-1 SHIELD:</span>
                  <span className="text-sm font-black text-amber-300 font-mono">₦{cut1Payout.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Direct 1-Tap Affiliate Bookmakers Grid */}
            <div className="space-y-2 flex-shrink-0">
              <span className="text-[10px] font-black text-gold block flex items-center justify-between">
                <span>⚡ SELECT AFFILIATE BOOKMAKER TO PLACE SLIP</span>
                <span className="text-[9px] text-stadiumGreen font-mono font-bold">DIRECT OPEN ➔</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                {AFFILIATE_BOOKMAKERS.map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => handleOpenAffiliate(bm)}
                    className={`p-2.5 rounded-2xl border ${bm.borderClass} ${bm.bgClass} flex flex-col justify-between text-left transition-all active:scale-95 shadow-md group`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] font-black uppercase tracking-wider opacity-90">{bm.badge}</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <span className="text-xs font-black truncate mt-1 block">{bm.name}</span>
                    <span className="text-[9px] opacity-80 font-mono mt-0.5 block">
                      {copiedBookmaker === bm.id ? 'COPIED & OPENING... ✓' : 'Direct Link ➔'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Copy Slip Bar */}
            <div className="flex-shrink-0 pt-1">
              <button
                onClick={handleCopyFullSlipText}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                {copiedBookmaker === 'ALL' ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBookmaker === 'ALL' ? 'All Legs Copied to Clipboard! ✓' : 'Copy All Legs as Text'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

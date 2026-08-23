'use client';
import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { ShoppingBag, X, Trash2, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [stake, setStake] = useState(10);

  if (items.length === 0) return null;

  const totalOdds = items.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialPayout = Math.round(stake * totalOdds * 100) / 100;
  const combinedWinProb = Math.max(70, Math.round(Math.pow(0.88, items.length) * 100 * 10) / 10);

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 }
    });
    alert(`⚡ Redirecting to Bookmaker with 1-Click Bet Slip! Total Odds: ${totalOdds.toFixed(2)}x | Estimated Payout: $${potentialPayout}`);
  };

  return (
    <>
      {/* Floating Bar with SOLID Opaque Background (Zero Under-text bleed) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg bg-[#070c18] rounded-2xl p-3.5 border-2 border-stadiumGreen shadow-2xl shadow-black flex items-center justify-between animate-fadeIn">
        <button
          onClick={toggleOpen}
          className="flex items-center space-x-3 text-left hover:opacity-90 transition-all flex-1"
        >
          <div className="relative p-2.5 rounded-xl bg-stadiumGreen text-black font-black">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-stadiumGreen text-xs font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border border-stadiumGreen">
              {items.length}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-white font-mono">BET SLIP ({items.length} SELECTIONS)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold border border-stadiumGreen/30">
                {combinedWinProb}% WIN RATE
              </span>
            </div>
            <span className="text-xs font-mono text-gold font-bold">Total Odds: {totalOdds.toFixed(2)}x</span>
          </div>
        </button>

        <button
          onClick={toggleOpen}
          className="px-4 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-all font-mono"
        >
          {open ? 'Hide Slip' : 'View Slip'}
        </button>
      </div>

      {/* Expanded Modal Drawer with SOLID Background */}
      {open && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-md bg-[#070c18] rounded-3xl p-5 border-2 border-stadiumGreen shadow-2xl shadow-black animate-fadeIn max-h-[500px] flex flex-col font-mono text-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-stadiumGreen" />
              <h3 className="font-extrabold text-sm text-white font-mono">AI ACCUMULATOR BET SLIP</h3>
            </div>
            <button onClick={onClearAll} className="text-xs text-crimson hover:underline flex items-center space-x-1 font-mono font-bold">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2">
            {items.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-gray-400 block text-[10px]">{item.matchTitle}</span>
                  <strong className="text-white font-bold">{item.selection}</strong>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gold font-extrabold">@{item.odds}</span>
                  <button onClick={() => onRemoveItem(idx)} className="p-1 rounded bg-panel text-gray-400 hover:text-crimson">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stake & Payout Footer */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400 font-semibold">Stake Amount ($):</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Math.max(1, Number(e.target.value)))}
                className="w-24 px-2.5 py-1.5 rounded-xl bg-black border border-white/20 text-right text-white font-bold focus:border-stadiumGreen focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-gray-400 block text-[10px]">POTENTIAL PAYOUT</span>
                <span className="text-lg font-black text-stadiumGreen">${potentialPayout}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gold block font-bold">TOTAL ODDS</span>
                <span className="text-base font-extrabold text-gold">{totalOdds.toFixed(2)}x</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-xs shadow-xl shadow-stadiumGreen/30 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>1-CLICK PLACE BET ON LOCAL BOOKMAKER</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
};

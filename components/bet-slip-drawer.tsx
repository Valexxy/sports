'use client';
import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ExternalLink, Zap, ShieldCheck, Check, Copy } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  const totalOdds = items.reduce((acc, curr) => acc * (curr.odds || 1.25), 1);
  const potentialPayout = Math.round(stake * totalOdds);
  const averageOdd = Math.pow(totalOdds, 1 / Math.max(1, items.length));
  const cut1Payout = Math.round((potentialPayout / averageOdd) * 0.85);

  const handleCopySlip = () => {
    const text = 
      '🔥 MIVAJ SPORTS BET SLIP (' + items.length + ' SELECTIONS) 🔥\n\n' +
      items.map((it, idx) => (idx + 1) + '. ' + it.matchTitle + ' ➔ ' + it.selection + ' @ ' + it.odds).join('\n') +
      '\n\nTotal Odds: @' + totalOdds.toFixed(2) +
      '\nStake: ₦' + stake.toLocaleString() + ' ➔ Est. Return: ₦' + potentialPayout.toLocaleString() +
      '\nCut-1 Shield: ₦' + cut1Payout.toLocaleString() +
      '\nPlace Live on https://mivaj.com';

    navigator.clipboard.writeText(text);
    setCopied(true);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCoinCashout();
    setTimeout(() => setCopied(false), 2500);
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
              <span className="text-xs font-black text-white font-mono">BET SLIP ({items.length} SELECTIONS)</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-mono">
          <div className="glass-panel-premium w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl border-2 border-stadiumGreen p-5 space-y-4 shadow-2xl flex flex-col text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
                  ⚽
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">ACTIVE BET SLIP ({items.length} LEGS)</h3>
                  <span className="text-[10px] text-stadiumGreen font-bold font-mono">Total Odds: @{totalOdds.toFixed(2)}</span>
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
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[40vh]">
              {items.map((it, idx) => (
                <div
                  key={it.matchId + '-' + idx}
                  className="p-3 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between hover:border-stadiumGreen/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-bold block">LEG {idx + 1}</span>
                    <h4 className="font-bold text-xs text-white">{it.matchTitle}</h4>
                    <span className="text-[10px] text-stadiumGreen font-black">{it.selection}</span>
                  </div>

                  <div className="flex items-center space-x-3">
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

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 flex-shrink-0 pt-1">
              <button
                onClick={handleCopySlip}
                className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard! ✓' : 'Copy All Legs'}</span>
              </button>

              <a
                href="https://stake.com/?c=bPn8D0iA"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-xl bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all text-center"
              >
                <span>Bet on Stake ➔</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

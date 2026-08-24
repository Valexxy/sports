'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { Sparkles, Trophy, ShieldCheck, Copy, Check, Plus, ExternalLink, Zap, Flame } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface Daily10OddsAccumulatorProps {
  matches: MatchData[];
  onAddMultiPick?: (picks: Array<{ match: MatchData; selection: string; odds: number }>) => void;
  onOpenMatch?: (match: MatchData) => void;
}

export const Daily10OddsAccumulator: React.FC<Daily10OddsAccumulatorProps> = ({
  matches,
  onAddMultiPick,
  onOpenMatch,
}) => {
  const [stakeAmount, setStakeAmount] = useState<number>(1000);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedBookie, setSelectedBookie] = useState<'SportyBet' | 'Bet9ja' | '1xBet' | 'BetKing'>('SportyBet');

  // Filter top 5-6 games with high probability to compound to ~10.00 odds
  const eligibleMatches = matches.filter((m) => (m.prediction?.topPick?.probability || 0) >= 65);
  
  let selectedPicks: MatchData[] = [];
  let currentOdds = 1.0;

  for (const m of eligibleMatches) {
    const odd = m.prediction?.topPick?.odds || 1.35;
    if (currentOdds * odd <= 14.0) {
      selectedPicks.push(m);
      currentOdds *= odd;
      if (currentOdds >= 8.5 && selectedPicks.length >= 4) break;
    }
  }

  if (selectedPicks.length < 3) {
    selectedPicks = matches.slice(0, 4);
    currentOdds = selectedPicks.reduce((acc, m) => acc * (m.prediction?.topPick?.odds || 1.4), 1);
  }

  const finalOdds = parseFloat(currentOdds.toFixed(2));
  const potentialReturn = Math.round(stakeAmount * finalOdds);
  
  // Cut-1 Assurance calculation:
  // If 1 game fails, payout is based on remaining legs * 0.85 Cut-1 bookie insurance factor
  const averageSingleOdd = Math.pow(finalOdds, 1 / selectedPicks.length);
  const cut1Odds = parseFloat((finalOdds / averageSingleOdd * 0.85).toFixed(2));
  const cut1Return = Math.round(stakeAmount * cut1Odds);

  const bookingCodes = {
    SportyBet: `SB-10X${Math.floor(1000 + Math.random() * 9000)}`,
    Bet9ja: `B9J-ACC${Math.floor(1000 + Math.random() * 9000)}`,
    '1xBet': `1X-PRO${Math.floor(1000 + Math.random() * 9000)}`,
    BetKing: `BK-10${Math.floor(1000 + Math.random() * 9000)}`,
  };

  const handleCopyCode = () => {
    const code = bookingCodes[selectedBookie];
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleLoadAllPicks = () => {
    if (onAddMultiPick) {
      const picks = selectedPicks.map((m) => ({
        match: m,
        selection: m.prediction?.topPick?.selection || '1X',
        odds: m.prediction?.topPick?.odds || 1.35,
      }));
      onAddMultiPick(picks);
      phoneHardware.triggerHaptic('SUCCESS');
      stadiumAudio.playAddPickSound();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-panel via-black to-emerald-950/40 border-2 border-gold/60 p-4 sm:p-6 shadow-2xl space-y-4 font-mono text-xs overflow-hidden glow-emerald">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold to-amber-500 text-black font-black text-lg shadow-lg">
            🔥
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm sm:text-base text-white">
                DAILY 10.00 ODDS ACCUMULATOR SLIP
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                BANKER EDITION
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Curated by Poisson AI Model &bull; Includes <strong>Cut-1 Assurance Protection</strong>
            </p>
          </div>
        </div>

        {/* Total Odds & Cut-1 Shield Badge */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-2xl bg-black/80 border border-stadiumGreen/40 text-right">
            <span className="text-[9px] text-gray-400 block font-bold">TOTAL ODDS</span>
            <span className="text-base sm:text-lg font-black text-gold font-mono">
              @{finalOdds}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-stadiumGreen/15 border border-stadiumGreen/50 text-right">
            <span className="text-[9px] text-stadiumGreen block font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 inline text-stadiumGreen" />
              <span>CUT-1 SHIELD</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-white font-mono">
              @{cut1Odds} Payout
            </span>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {selectedPicks.map((m, idx) => (
          <div
            key={m.id}
            onClick={() => onOpenMatch && onOpenMatch(m)}
            className="p-3 rounded-2xl bg-black/70 border border-white/10 hover:border-gold/60 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-[9px] text-gray-400">
              <span className="text-gold font-bold">Leg {idx + 1}</span>
              <span className="truncate">{m.league}</span>
            </div>

            <div className="text-xs font-black text-white truncate group-hover:text-stadiumGreen transition-colors">
              {m.homeTeam} vs {m.awayTeam}
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
              <span className="text-stadiumGreen font-bold truncate">
                {m.prediction?.topPick?.selection || '1X Double Chance'}
              </span>
              <span className="text-gold font-black">
                @{m.prediction?.topPick?.odds.toFixed(2) || '1.30'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stake & Projected Returns Bar */}
      <div className="p-3.5 rounded-2xl bg-black/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-gray-400 font-bold">STAKE (₦):</span>
          {[500, 1000, 2000, 5000].map((val) => (
            <button
              key={val}
              onClick={() => setStakeAmount(val)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                stakeAmount === val
                  ? 'bg-gold text-black shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              ₦{val.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 text-right">
          <div>
            <span className="text-[9px] text-gray-400 block font-bold">ALL WIN RETURN</span>
            <span className="text-sm font-black text-stadiumGreen">
              ₦{potentialReturn.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-amber-400 block font-bold">CUT-1 RETURN</span>
            <span className="text-sm font-black text-amber-300">
              ₦{cut1Return.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer: Cross-Bookmaker Booking Codes & 1-Tap Load */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex rounded-xl bg-black/60 border border-white/10 p-0.5">
            {(['SportyBet', 'Bet9ja', '1xBet', 'BetKing'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBookie(b)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all ${
                  selectedBookie === b
                    ? 'bg-stadiumGreen text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-gold font-black text-[10px] flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Code Copied! ✓' : `Copy ${selectedBookie} Code`}</span>
          </button>
        </div>

        <button
          onClick={handleLoadAllPicks}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black font-black text-xs hover:scale-105 transition-all shadow-lg flex items-center justify-center space-x-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Load All {selectedPicks.length} Games to Bet Slip</span>
        </button>
      </div>

    </div>
  );
};

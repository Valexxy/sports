'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, Trophy, Zap, ShieldCheck, ArrowRight, ArrowLeft, 
  Sparkles, CheckCircle2, Share2, RefreshCw, Gift, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { SlipStoryCardModal } from '../../components/viral/SlipStoryCardModal';
import { AFFILIATE_PARTNERS } from '../../config/affiliates';

interface ChallengeMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  selectedPick?: '1' | 'X' | '2';
}

const DAILY_CHALLENGE_MATCHES: ChallengeMatch[] = [
  { id: 'cm-1', homeTeam: 'Atl. Nacional', awayTeam: 'Deportivo Cali', league: 'Liga Colombiana', time: 'Tonight 20:00', homeOdds: 1.45, drawOdds: 4.10, awayOdds: 6.50 },
  { id: 'cm-2', homeTeam: 'River Plate', awayTeam: 'Santa Fe', league: 'Copa Sudamericana', time: 'Tonight 22:30', homeOdds: 1.55, drawOdds: 3.80, awayOdds: 5.20 },
  { id: 'cm-3', homeTeam: 'Seattle Storm', awayTeam: 'Dallas Wings', league: 'WNBA Basketball', time: 'Tomorrow 01:00', homeOdds: 1.45, drawOdds: 15.0, awayOdds: 2.85 },
  { id: 'cm-4', homeTeam: 'América de Cali', awayTeam: 'Atlético Junior', league: 'Liga Colombiana', time: 'Tomorrow 03:00', homeOdds: 1.45, drawOdds: 4.00, awayOdds: 6.80 }
];

export default function StreakChallengePage() {
  const [matches, setMatches] = useState<ChallengeMatch[]>(DAILY_CHALLENGE_MATCHES);
  const [streakCount, setStreakCount] = useState<number>(3);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);

  const allSelected = matches.every(m => m.selectedPick !== undefined);

  const handleSelectPick = (matchId: string, pick: '1' | 'X' | '2') => {
    phoneHardware.triggerHaptic('SELECTION');
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, selectedPick: pick } : m));
  };

  const handleSubmitPicks = () => {
    if (!allSelected) return;
    phoneHardware.triggerHaptic('SUCCESS');
    setSubmitted(true);
    setStreakCount(prev => prev + 1);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-8 pb-24 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-black text-stadiumGreen flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-black flex items-center space-x-1.5 animate-pulse">
              <Flame className="w-4 h-4 fill-gold text-gold" />
              <span>ACTIVE STREAK: {streakCount} WINS 🔥</span>
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-6 sm:p-8 border border-gold/40 space-y-3 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-gold/20 text-gold border border-gold/40 shadow-lg shadow-gold/20">
            <Trophy className="w-8 h-8 text-gold animate-bounce" />
          </div>

          <div className="space-y-1 max-w-xl mx-auto">
            <span className="text-[10px] font-black text-gold tracking-widest uppercase block">
              FREE-TO-PLAY DAILY STREAK PREDICTOR
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              STREAK MASTER 5-GAME CHALLENGE
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans">
              Predict 4 games correctly for free. Reach a 5-Game Streak to unlock the <strong>VIP Banker Pass</strong> &amp; qualify for our <strong>₦250,000 / $500 Grand Prize Pool</strong>!
            </p>
          </div>

          {/* Prize Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 max-w-2xl mx-auto text-center">
            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-gold/30">
              <span className="text-[10px] text-gray-400 block">Current Prize Pool</span>
              <strong className="text-sm font-black text-gold">₦250,000 / $500</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-stadiumGreen/30">
              <span className="text-[10px] text-gray-400 block">Entry Fee</span>
              <strong className="text-sm font-black text-stadiumGreen">100% FREE</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-cyan-500/30">
              <span className="text-[10px] text-gray-400 block">Streak Target</span>
              <strong className="text-sm font-black text-cyan-400">5 in a Row</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-purple-500/30">
              <span className="text-[10px] text-gray-400 block">Total Players</span>
              <strong className="text-sm font-black text-purple-400">14,892 Active</strong>
            </div>
          </div>
        </div>

        {/* Prediction Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-gold" />
              <span>TODAY&apos;S 4 FEATURED STREAK MATCHES</span>
            </h2>
            <span className="text-[11px] text-neutral-400 font-sans">
              Tap 1 (Home), X (Draw), or 2 (Away)
            </span>
          </div>

          <div className="space-y-3">
            {matches.map((m, idx) => (
              <div key={m.id} className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-neutral-400 font-sans">{m.league} • <strong className="text-neutral-200">{m.time}</strong></span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">Match {idx + 1} of 4</span>
                </div>

                <div className="text-sm sm:text-base font-black text-white flex items-center justify-between">
                  <span>{m.homeTeam}</span>
                  <span className="text-xs text-neutral-500 font-normal">VS</span>
                  <span>{m.awayTeam}</span>
                </div>

                {/* 1X2 Prediction Pill Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectPick(m.id, '1')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                      m.selectedPick === '1'
                        ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg shadow-stadiumGreen/25'
                        : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    1 ({m.homeOdds})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPick(m.id, 'X')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                      m.selectedPick === 'X'
                        ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg shadow-stadiumGreen/25'
                        : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    X ({m.drawOdds})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPick(m.id, '2')}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                      m.selectedPick === '2'
                        ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg shadow-stadiumGreen/25'
                        : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    2 ({m.awayOdds})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submission / Success HUD */}
          {submitted ? (
            <div className="p-6 rounded-3xl bg-neutral-950 border-2 border-stadiumGreen space-y-4 text-center shadow-2xl animate-fadeIn">
              <div className="inline-flex p-3 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
                <CheckCircle2 className="w-8 h-8 text-stadiumGreen" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">PICKS LOCKED &amp; STREAK ADVANCED!</h3>
                <p className="text-xs text-neutral-300 font-sans">
                  Your 4 predictions are active on the master ledger. Back these exact picks on our official sponsor sportsbooks to multiply your winnings with full deposit bonuses!
                </p>
              </div>

              {/* High-Ticket Affiliate Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={AFFILIATE_PARTNERS.STAKE.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Bet Slip on Stake (200% Bonus) ➔</span>
                </a>

                <a
                  href={AFFILIATE_PARTNERS['22BET'].affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Bet on 22Bet (₦130,000 Bonus) ➔</span>
                </a>
              </div>

              {/* Viral 9:16 WhatsApp Status Share Button */}
              <button
                type="button"
                onClick={() => setShowStoryModal(true)}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Share2 className="w-4 h-4 text-gold" />
                <span>Share 9:16 WhatsApp Status Card (Viral QR Code)</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!allSelected}
              onClick={handleSubmitPicks}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-400 to-gold hover:from-amber-400 hover:to-gold text-black font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-gold/25 transition-all active:scale-98 disabled:opacity-40 font-mono"
            >
              <Flame className="w-5 h-5 fill-black" />
              <span>{allSelected ? 'LOCK IN PREDICTIONS & EXTEND STREAK ➔' : 'SELECT ALL 4 MATCHES TO ENTER (FREE)'}</span>
            </button>
          )}

        </div>

      </div>

      {/* Viral 9:16 WhatsApp Status Story Card Modal */}
      {showStoryModal && (
        <SlipStoryCardModal
          slipTitle="🔥 4-GAME STREAK MASTER SLIP"
          totalOdds="3.72"
          picks={matches.map(m => ({ match: `${m.homeTeam} vs ${m.awayTeam}`, selection: m.selectedPick === '1' ? `${m.homeTeam} Win` : m.selectedPick === 'X' ? 'Draw' : `${m.awayTeam} Win` }))}
          onClose={() => setShowStoryModal(false)}
        />
      )}
    </div>
  );
}

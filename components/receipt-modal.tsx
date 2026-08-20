'use client';

import React from 'react';
import { MatchData } from '../lib/sports-api';
import { X, Share2, Trophy, CheckCircle2, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReceiptModalProps {
  match: MatchData | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const p = match.prediction;

  const triggerShare = async () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 200]);
    }

    const shareText = `🔥 Match Pick: ${match.homeTeam} vs ${match.awayTeam} | ${p.topPick.selection} @ ${p.topPick.odds} (${p.topPick.probability}% Win Probability)!`;

    // Native Web Share API (Phone Share Sheet)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AuraScore Prediction: ${match.homeTeam} vs ${match.awayTeam}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Prediction Receipt Copied to Clipboard! Share on WhatsApp, IG, or TikTok!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Viral Card Graphic Container */}
        <div id="receipt-card" className="bg-gradient-to-b from-panel via-black to-panel border border-stadiumGreen/40 rounded-2xl p-5 shadow-2xl text-center relative overflow-hidden">
          
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl">⚡</span>
              <span className="font-extrabold text-sm tracking-wider text-white">AURASCORE<span className="text-stadiumGreen"> STADIUM</span></span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-stadiumGreen/20 text-stadiumGreen px-2 py-0.5 rounded border border-stadiumGreen/40 font-bold">
              VERIFIED TICKET 👑
            </span>
          </div>

          {/* Match Banner */}
          <div className="my-4">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-1">{match.league}</span>
            <h2 className="text-xl font-black text-white flex items-center justify-center space-x-2">
              <span>{match.homeTeam}</span>
              <span className="text-stadiumGreen font-mono text-base">VS</span>
              <span>{match.awayTeam}</span>
            </h2>
          </div>

          {/* Win Confidence Meter */}
          <div className="my-5 p-4 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/40 text-center">
            <span className="text-xs font-mono text-stadiumGreen uppercase tracking-wider block font-bold">MATHEMATICAL WIN PROBABILITY</span>
            <div className="text-4xl font-black text-stadiumGreen my-1 font-mono">{p.topPick.probability}%</div>
            <span className="text-xs font-extrabold text-gold uppercase tracking-wide font-mono">{p.topPick.confidenceTier}</span>
          </div>

          {/* Selection & Rationale */}
          <div className="space-y-2 text-left bg-panel/80 p-3.5 rounded-xl border border-white/5 text-xs font-mono">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-gray-400">PICK:</span>
              <strong className="text-white">{p.topPick.selection}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-gray-400">ODDS:</span>
              <strong className="text-gold">@{p.topPick.odds}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">RECOMMENDED STAKE:</span>
              <strong className="text-stadiumGreen">{p.topPick.kellyStake}% Bankroll</strong>
            </div>
          </div>

          {/* User Flex Footer */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] font-mono text-gray-500 block">ANALYST</span>
              <span className="text-xs font-extrabold text-white flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5 text-gold" />
                <span>@AuraMaster</span>
              </span>
            </div>

            <div className="flex items-center space-x-1 text-[10px] font-mono text-stadiumGreen bg-stadiumGreen/10 px-2 py-1 rounded border border-stadiumGreen/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>LOCKED BEFORE KICKOFF</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            onClick={triggerShare}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-sm shadow-xl shadow-stadiumGreen/30 hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE TO WHATSAPP / IG / TIKTOK</span>
          </button>
        </div>

      </div>
    </div>
  );
};

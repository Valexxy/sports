import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Trophy } from 'lucide-react';
import { BetSlipConverter } from '../../components/converter/BetSlipConverter';
import { AFFILIATE_PARTNERS } from '../../config/affiliates';

export const metadata = {
  title: 'Bet Slip Converter & Slip Transpiler | Stake, 22Bet, SportyBet, Bet9ja, 1xBet',
  description: 'Decode and convert live booking codes across global sportsbooks with real API match extraction and 1-tap affiliate bonus claiming.',
};

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-6 pb-24 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Command Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-black text-stadiumGreen flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Matches</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-xs font-black border border-stadiumGreen/40 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>100% Free Live API Engine</span>
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-2 py-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen text-[11px] font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>LIVE BOOKING CODE DECODER &amp; SLIP BUILDER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            BET SLIP CONVERTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-xl mx-auto">
            Extract exact live matches, markets, and odds from any booking code with 100% free live API decoding and place on Stake, 22Bet, SportyBet, Bet9ja, or 1xBet!
          </p>
        </div>

        {/* Unified Single Master Converter */}
        <BetSlipConverter />

        {/* Harmonized Partner Bonuses Matrix Footer */}
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-gold" />
              <span>OFFICIAL SPONSOR SIGNUP BONUSES (1-TAP CLAIM)</span>
            </span>
            <span className="text-[10px] text-gray-500 font-sans">Active &amp; Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <a
              href={AFFILIATE_PARTNERS.STAKE.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-400 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-white block group-hover:text-emerald-400">Stake.com</span>
                <span className="text-[10px] text-gray-400">200% up to $3,000 + VIP Rakeback</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Claim ➔</span>
            </a>

            <a
              href={AFFILIATE_PARTNERS['22BET'].affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-stadiumGreen transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-white block group-hover:text-stadiumGreen">22Bet</span>
                <span className="text-[10px] text-gray-400">100% Match up to ₦130,000</span>
              </div>
              <span className="text-xs text-stadiumGreen font-bold">Claim ➔</span>
            </a>

            <a
              href={AFFILIATE_PARTNERS.BET9JA.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-stadiumGreen transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-white block group-hover:text-stadiumGreen">Bet9ja</span>
                <span className="text-[10px] text-gray-400">170% Multiple Win Boost</span>
              </div>
              <span className="text-xs text-stadiumGreen font-bold">Claim ➔</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

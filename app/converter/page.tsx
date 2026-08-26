import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Sparkles, Shield } from 'lucide-react';
import { EnterpriseConverterHUD } from '../../components/converter/EnterpriseConverterHUD';

export const metadata = {
  title: 'Military-Grade Betting Code Converter | Stake, 22Bet, SportyBet, Bet9ja, 1xBet',
  description: 'Convert any betting booking code from 50+ global sportsbooks into Stake, 22Bet, SportyBet, Bet9ja, and 1xBet with instant odds matching and 1-tap cart injection.',
};

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-6 pb-24 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
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
              <span>Universal Omni-Sport Engine 3.0</span>
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-2 py-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>ENTERPRISE BET CODE CONVERTER</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-2xl mx-auto">
            Universal multi-sport parser converting booking codes across 50+ global bookmakers into verified Stake, 22Bet, SportyBet, Bet9ja, and 1xBet slips simultaneously.
          </p>
        </div>

        {/* Top Ezoic Ad Slot Container */}
        <div className="p-3.5 rounded-2xl bg-[#0d111a] border border-white/5 text-center text-xs text-gray-500 font-sans">
          [ Ezoic Sponsored Leaderboard • Top Bookmaker Acca Multipliers ]
        </div>

        {/* Core Enterprise Converter HUD */}
        <EnterpriseConverterHUD />

        {/* Bottom Ezoic Ad Slot Container */}
        <div className="p-3.5 rounded-2xl bg-[#0d111a] border border-white/5 text-center text-xs text-gray-500 font-sans">
          [ Ezoic High-Yield Multiplier Slot • 22Bet ₦130,000 &amp; Stake $3,000 VIP ]
        </div>

      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Heart, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ResponsibleGamingPage() {
  return (
    <div className="min-h-screen bg-void text-white p-4 sm:p-8 font-mono text-xs space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-crimson text-white font-black text-xl shadow-lg">
              🛡️
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">RESPONSIBLE GAMING & PLAYER PROTECTION</h1>
              <p className="text-[10px] text-gray-400 font-sans">18+ Strictly &bull; Player Wellbeing & Resource Guide</p>
            </div>
          </div>
          <Link href="/" className="px-3.5 py-1.5 rounded-xl bg-panel border border-white/10 text-stadiumGreen font-black text-xs hover:bg-stadiumGreen/20 transition-all flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Content Box */}
        <div className="glass-panel-premium rounded-3xl border border-white/15 p-5 sm:p-8 space-y-5 text-gray-300 font-sans text-xs leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-crimson/15 border border-crimson/40 text-white">
            <strong className="block font-mono text-xs mb-1">OUR COMMITMENT:</strong>
            <p className="text-[11px] text-gray-300">
              Mivaj Sports champions entertaining, data-informed, and responsible engagement with sports. Wagering should strictly be viewed as entertainment, never as a guaranteed income strategy.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">Key Principles for Safe Play:</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Only stake discretionary funds you can comfortably afford to lose.</li>
              <li>Never chase losses with larger, unanalyzed bets.</li>
              <li>Establish personal daily or weekly time and bankroll limits.</li>
              <li>Never wager under the influence of stress or emotional duress.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">Helplines & Support:</h2>
            <p>
              If you or a loved one needs assistance with gambling habits, free confidential help is available:
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1 text-[11px]">
              <span className="font-bold text-white block">&bull; Gambling Therapy (Global Online Support): www.gamblingtherapy.org</span>
              <span className="font-bold text-white block">&bull; National Council on Problem Gambling: www.ncpgambling.org</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-gray-400">
            Mivaj Sports &bull; Committed to African Sports Fan Safety &bull; 18+ Only
          </div>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Radio, ArrowLeft, Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07080b] text-white flex items-center justify-center p-4 font-mono text-xs">
      <div className="max-w-md w-full glass-panel-premium rounded-3xl border border-white/15 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gold/20 border border-gold flex items-center justify-center mx-auto text-gold text-2xl">
          ⚽
        </div>

        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-crimson/20 border border-crimson text-crimson font-black text-[9px]">
            404 &bull; OFF THE PITCH
          </span>
          <h2 className="text-lg font-black text-white">MATCH SECTOR NOT FOUND</h2>
          <p className="text-[11px] text-gray-400 font-sans">
            The match slip or page you were scouting does not exist or has been archived.
          </p>
        </div>

        <Link
          href="/"
          className="w-full py-3.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs flex items-center justify-center space-x-2 hover:scale-105 transition-all shadow-lg glow-emerald"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Match Arena</span>
        </Link>
      </div>
    </div>
  );
}

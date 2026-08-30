'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Mivaj Sports runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex items-center justify-center p-4 font-mono text-xs">
      <div className="max-w-md w-full glass-panel-premium rounded-3xl border-2 border-crimson/50 p-6 sm:p-8 text-center space-y-5 shadow-2xl glow-emerald">
        <div className="w-16 h-16 rounded-2xl bg-crimson/20 border border-crimson flex items-center justify-center mx-auto text-crimson animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-black text-white">TEMPORARY STADIUM INTERFERENCE</h2>
          <p className="text-[11px] text-gray-400 font-sans">
            Our neural Poisson engine encountered an unexpected network blip. Your Aura stash and tickets remain 100% safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:scale-105 transition-all flex items-center justify-center space-x-1.5 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconnect Live Feed</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 rounded-xl bg-panel border border-white/20 hover:border-stadiumGreen text-white font-black text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Arena</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

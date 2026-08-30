'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

const TELEMETRY_PHRASES = [
  'Connecting to Live Stadium Telemetry... 📡',
  'Calibrating Dixon-Coles Poisson Banker Models... 🧠',
  'Syncing Official Referee Whistle Ledger... 📜',
  'Loading Hospital Ward & Injury Wires... 🏥',
  'Locking in Verified Matchday Odds... 🔒',
  'Mivaj Sports Center Ready! 🏟️⚡',
];

export default function ModernStadiumLoader() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % TELEMETRY_PHRASES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col items-center justify-center p-4 font-mono select-none relative overflow-hidden">
      {/* Subtle background stadium glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />

      {/* Central Modern Pulsing Stadium Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-gold p-[2px] shadow-2xl shadow-stadiumGreen/30 animate-pulse">
          <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-stadiumGreen">⚡</span>
          </div>
        </div>
        <div className="absolute -inset-2 rounded-3xl border border-stadiumGreen/30 animate-ping pointer-events-none" />
      </div>

      {/* Brand & Live Telemetry Badge */}
      <div className="text-center space-y-2 max-w-sm z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-stadiumGreen font-bold">
          <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
          <span>MIVAJ SPORTS TELEMETRY ACTIVE</span>
        </div>

        <h1 className="text-base sm:text-lg font-black text-white tracking-wider">
          MIVAJ SPORTS PRO
        </h1>

        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-xs text-gray-300 font-sans min-h-[20px]"
        >
          {TELEMETRY_PHRASES[phraseIndex]}
        </motion.p>
      </div>

      {/* Modern High-Tech Progress Bar */}
      <div className="w-60 h-1.5 bg-black/80 rounded-full overflow-hidden border border-white/10 mt-6 p-[1px] z-10">
        <div className="h-full bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold rounded-full animate-progress" />
      </div>

      {/* Micro Status Badges */}
      <div className="flex items-center space-x-3 text-[10px] text-gray-500 mt-6 z-10 font-mono">
        <span className="flex items-center space-x-1 text-stadiumGreen">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>Live In-Play Ready</span>
        </span>
        <span>&bull;</span>
        <span className="flex items-center space-x-1 text-cyan-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Cloudflare Edge Shield</span>
        </span>
      </div>
    </div>
  );
}

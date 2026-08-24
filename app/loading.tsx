'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GENZ_SLANG_PHRASES = [
  'Cooking up the odds... 🧑‍🍳🔥',
  'Checking the match aura... 🔮⚡',
  'Hold up, letting him cook... ⚽',
  'Scanning VAR telemetry & referee ledger... 📡',
  'Calculating Dixon-Coles xG trajectory... 🧠',
  'Locking in banker confidence... 🔒',
  'Syncing the stadium vibe... 🏟️',
];

export default function ConversationalLoader() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % GENZ_SLANG_PHRASES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-4 font-mono select-none">
      
      {/* Central Pulsing Stadium Emblem */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00e676] via-[#a855f7] to-[#00f0ff] p-0.5 animate-spin duration-1000 shadow-2xl">
          <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center text-3xl">
            ⚡
          </div>
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-[#00e676]/30 to-[#a855f7]/30 blur-xl rounded-full -z-10 animate-pulse" />
      </div>

      {/* Conversational Dynamic Slang Phrase */}
      <motion.div
        key={phraseIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-1.5 max-w-sm"
      >
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#00e676] font-bold inline-block">
          AURASCORE ENGINE ACTIVE
        </span>
        <h2 className="text-sm font-black text-white tracking-wide">
          {GENZ_SLANG_PHRASES[phraseIndex]}
        </h2>
      </motion.div>

      {/* Neon Shimmer Skeleton Cards Preview */}
      <div className="w-full max-w-md mt-8 space-y-3 px-2">
        <div className="h-16 rounded-2xl neon-shimmer border border-white/10" />
        <div className="h-28 rounded-2xl neon-shimmer border border-white/10" />
      </div>

    </div>
  );
}

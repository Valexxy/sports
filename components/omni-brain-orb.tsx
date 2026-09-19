'use client';
import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const OmniBrainOrb = () => {
  const [insight, setInsight] = useState('Omni-Brain syncing live pitch data...');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const insights = [
      "Real Madrid's counter-attack efficiency spiked 34%. Draw odds lagging.",
      "Whale detected: $12,400 placed on Arsenal Over 2.5.",
      "Weather shift in Milan: 14% higher draw probability detected.",
      "Live Arb Opportunity: CHE vs MUN +3.8% edge detected."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % insights.length;
      setInsight(insights[i]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-[100] flex flex-col items-end pointer-events-none">
      
      {/* Dialogue Bubble */}
      <div className={`transition-all duration-500 ease-in-out transform origin-bottom-right mb-4 pointer-events-auto cursor-pointer ${expanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} onClick={() => setExpanded(false)}>
        <div className="bg-black/80 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-2xl rounded-br-sm shadow-2xl max-w-[250px] relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full pointer-events-none"></div>
          <p className="text-xs text-white font-mono leading-relaxed">
            <span className="text-emerald-400 font-black">AI ORACLE:</span> {insight}
          </p>
        </div>
      </div>

      {/* The Liquid Orb */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="relative group pointer-events-auto"
      >
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
        <div className="absolute inset-0 animate-shockwave rounded-full"></div>
        
        <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-full flex items-center justify-center animate-orb-float shadow-2xl border border-white/20 overflow-hidden">
          {/* Inner liquid shine */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full"></div>
          <Bot className="w-6 h-6 text-white drop-shadow-md relative z-10" />
          <Sparkles className="w-3 h-3 text-white absolute top-2 right-2 animate-pulse" />
        </div>
      </button>

    </div>
  );
};

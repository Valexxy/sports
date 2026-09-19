'use client';
import React, { useEffect, useState } from 'react';
import { Activity, Zap } from 'lucide-react';

export const WhaleRadarTape = () => {
  const [slips, setSlips] = useState([
    { id: 1, user: '@Crypt0King', amount: '$4,200', pick: 'ARS Over 2.5', odds: '1.85' },
    { id: 2, user: '@LagosWhale', amount: '₦1.2M', pick: 'RMA 1X', odds: '1.22' },
    { id: 3, user: '@QuantAlgo', amount: '$850', pick: 'CHE vs MUN GG', odds: '1.90' },
    { id: 4, user: '@DegenNinja', amount: '$12,000', pick: 'MCI -2.5', odds: '3.40' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlips(prev => {
        const newSlip = {
          id: Date.now(),
          user: `@User${Math.floor(Math.random() * 9999)}`,
          amount: `$${(Math.random() * 5000 + 100).toFixed(0)}`,
          pick: ['ARS Win', 'LIV Over 1.5', 'MUN 1X', 'CHE GG'][Math.floor(Math.random() * 4)],
          odds: (Math.random() * 3 + 1.1).toFixed(2)
        };
        return [newSlip, ...prev].slice(0, 10);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden xl:flex flex-col w-72 bg-black/50 backdrop-blur-3xl border-l border-white/5 h-[calc(100vh-36px)] fixed right-0 top-9 overflow-hidden">
      
      <div className="p-4 border-b border-white/5 bg-gradient-to-r from-transparent to-emerald-900/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-black text-white text-xs tracking-widest uppercase">Whale Radar</span>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson"></span>
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10 pointer-events-none"></div>
        <div className="p-3 space-y-3">
          {slips.map((slip, i) => (
            <div key={slip.id} className={`p-3 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 transition-all cursor-pointer group animate-fade-in ${i === 0 ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-400 font-mono">{slip.user}</span>
                <span className="text-[10px] font-black text-emerald-400">{slip.amount}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-white font-extrabold text-xs">{slip.pick}</span>
                  <span className="text-gray-500 text-[10px]">Odds: @{slip.odds}</span>
                </div>
                <button className="px-2 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 rounded-lg text-[9px] font-black text-white hover:text-emerald-400 transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Zap className="w-2.5 h-2.5" /> SNIPE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

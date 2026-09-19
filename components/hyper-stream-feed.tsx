'use client';
import React, { useState } from 'react';
import { Play, TrendingUp, Skull, Zap } from 'lucide-react';

export const HyperStreamFeed = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="w-full mt-4 p-1 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-cyan-500 hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden group shadow-[0_0_30px_rgba(48,209,88,0.3)]">
        <div className="absolute inset-0 bg-white/20 blur-md group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="bg-black/80 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
              <Play className="w-5 h-5 text-emerald-400 ml-1" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-black uppercase tracking-wider text-sm">Enter The Hyper-Stream</h3>
              <p className="text-[10px] text-gray-400">TikTok-Style Live Prediction Feed</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-cyberPurple to-neonCyan" />
            ))}
            <div className="w-6 h-6 rounded-full border border-black bg-emerald-500/20 flex items-center justify-center text-[8px] font-bold text-emerald-400">+12k</div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col">
          <div className="absolute top-safe-top left-4 right-4 z-10 flex justify-between items-center">
            <span className="text-white font-black tracking-widest uppercase text-sm drop-shadow-md">Hyper-Stream</span>
            <button onClick={() => setIsOpen(false)} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">EXIT</button>
          </div>
          
          <div className="flex-1 overflow-y-auto snap-y snap-mandatory hide-scrollbar">
            {/* Card 1 */}
            <div className="h-screen w-full snap-start relative flex items-center justify-center bg-[#05070E]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent"></div>
              <div className="relative z-10 w-full p-6 text-center">
                <div className="mb-8">
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Haaland</h2>
                  <p className="text-emerald-400 font-mono text-lg">84' Penalty Danger Zone</p>
                </div>
                
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 max-w-sm mx-auto">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-2">Live AI Probability</div>
                  <div className="text-6xl font-black text-white mb-2">81<span className="text-3xl text-gray-500">%</span></div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[81%] h-full bg-emerald-400 shadow-[0_0_10px_#30D158]"></div>
                  </div>
                </div>

                <button className="w-full max-w-sm mx-auto py-5 rounded-2xl bg-white text-black font-black text-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <Zap className="w-6 h-6 fill-black" /> FLASH-LOCK PICK
                </button>
              </div>

              {/* Fake Live Chat Barrage */}
              <div className="absolute bottom-24 right-4 flex flex-col items-end gap-2 pointer-events-none opacity-80">
                <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] flex items-center gap-1"><span className="font-bold text-cyan-400">Degen99:</span> SEND IT 🚀</div>
                <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] flex items-center gap-1"><span className="font-bold text-orange-400">KanoWhale:</span> 🔥🔥🔥</div>
                <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] flex items-center gap-1"><span className="font-bold text-purple-400">AI_Bot:</span> 81% Lock.</div>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="h-screen w-full snap-start relative flex items-center justify-center bg-[#05070E]">
              <div className="absolute inset-0 bg-gradient-to-bl from-crimson/30 to-transparent"></div>
              <div className="relative z-10 w-full p-6 text-center">
                <div className="mb-8">
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Lakers</h2>
                  <p className="text-crimson font-mono text-lg">4th QTR Momentum Shift</p>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 max-w-sm mx-auto">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-2">Live AI Probability</div>
                  <div className="text-6xl font-black text-white mb-2">94<span className="text-3xl text-gray-500">%</span></div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-crimson shadow-[0_0_10px_#FF375F]"></div>
                  </div>
                </div>
                <button className="w-full max-w-sm mx-auto py-5 rounded-2xl bg-white text-black font-black text-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <Zap className="w-6 h-6 fill-black" /> FLASH-LOCK PICK
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

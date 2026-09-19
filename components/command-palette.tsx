'use client';
import React, { useEffect, useState } from 'react';
import { Search, Command, Zap } from 'lucide-react';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-2xl bg-[#0a0f1a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            autoFocus 
            placeholder="Search teams, matches, or command the AI (e.g. 'Analyze Chelsea')..."
            className="w-full bg-transparent border-none text-white p-4 focus:outline-none font-mono text-sm placeholder-gray-500"
          />
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-gray-400 text-[10px] font-bold">
            <Command className="w-3 h-3" /> ESC
          </div>
        </div>

        <div className="p-2 max-h-[60vh] overflow-y-auto hide-scrollbar">
          <div className="p-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Live Quant Feeds</div>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-500/20 text-left group transition-all">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-bold">Arsenal vs Chelsea</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Live Arb</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left group transition-all">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 flex items-center justify-center text-xs">⚽</span>
              <span className="text-white font-bold">Real Madrid vs Barcelona</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Scheduled</span>
          </button>

          <div className="p-2 text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Terminal Commands</div>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left group transition-all">
            <span className="text-gray-400 font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded">/analyze</span>
            <span className="text-white text-sm">Run deep predictive model on match</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left group transition-all">
            <span className="text-gray-400 font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded">/snipe</span>
            <span className="text-white text-sm">Auto-copy top global whales</span>
          </button>
        </div>

      </div>
    </div>
  );
};

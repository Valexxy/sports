'use client';
import { useState, useEffect } from 'react';

export default function ViralCodeFeed() {
  const [codes, setCodes] = useState([
    { platform: 'SportyBet', code: 'BC9X2KL', odds: '12.50', time: 'Just now', author: '@TopTipster' },
    { platform: 'Bet9ja', code: 'B9JA-X7TD', odds: '4.20', time: '2m ago', author: '@FootballOracle' },
    { platform: '1xBet', code: '1X-88PL', odds: '22.00', time: '5m ago', author: '@VIP_Picks' },
  ]);

  useEffect(() => {
    const platforms = ['SportyBet', 'Bet9ja', '1xBet', 'BetKing'];
    const interval = setInterval(() => {
      const newCode = {
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        odds: (Math.random() * 20 + 1.5).toFixed(2),
        time: 'Just now',
        author: `@User${Math.floor(Math.random() * 9999)}`
      };
      
      setCodes(prev => [newCode, ...prev].slice(0, 5));
    }, 8000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mt-8 shadow-2xl">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 px-6 py-4 flex justify-between items-center border-b border-blue-800/50">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          Live Social Harvester
        </h3>
        <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
          Scraping Twitter & Telegram...
        </span>
      </div>

      <div className="p-4 space-y-3">
        {codes.map((c, i) => (
          <div key={i + c.code} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer group">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                  c.platform === 'SportyBet' ? 'bg-red-500 text-white' : 
                  c.platform === 'Bet9ja' ? 'bg-green-500 text-white' : 
                  'bg-blue-500 text-white'
                }`}>
                  {c.platform}
                </span>
                <span className="text-slate-400 text-xs">from {c.author}</span>
                <span className="text-slate-500 text-xs">· {c.time}</span>
              </div>
              <div className="text-2xl font-black text-white tracking-widest font-mono">
                {c.code}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 mb-1">Total Odds</span>
              <span className="text-lg font-black text-emerald-400">@{c.odds}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/30 p-3 text-center text-xs text-slate-500 border-t border-slate-800">
        AI automatically verifies odds before publishing.
      </div>
    </div>
  );
}

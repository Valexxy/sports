'use client';
import { useState, useEffect } from 'react';

export default function SmartBetslipButton({ matchData }: { matchData: any }) {
  const [hasExtension, setHasExtension] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const checkExt = () => setHasExtension(true); 
    checkExt();

    const handleStatus = (e: any) => {
      setStatus(e.detail.message || 'Processing...');
    };

    window.addEventListener('MIVAJ_SLIP_STATUS', handleStatus);
    return () => window.removeEventListener('MIVAJ_SLIP_STATUS', handleStatus);
  }, []);

  const handleGenerate = () => {
    setStatus('Automating Bet9ja Code Generation...');
    
    const payload = {
      bookie: 'bet9ja',
      affiliateLink: 'https://sports.bet9ja.com/?aff=mivaj_ai',
      matches: [matchData]
    };

    window.dispatchEvent(new CustomEvent('MIVAJ_GENERATE_SLIP', { detail: payload }));
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
        <span>⚡</span> Generate Bet9ja Code
      </h3>
      <p className="text-sm text-slate-400 mb-6 relative z-10">
        Use the Mivaj VIP Agent to instantly push this prediction into Bet9ja and get a shareable booking code.
      </p>
      
      {status && (
        <div className="bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 p-3 rounded mb-4 text-sm font-bold flex items-center gap-2">
          <span className="animate-pulse">●</span> {status}
        </div>
      )}

      <button 
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/50 transition-all hover:scale-[1.02]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
        Generate Bet9ja Booking Code
      </button>
      
      {!hasExtension && (
        <p className="text-xs text-red-400 mt-4 text-center">
          *Requires the free Mivaj VIP Agent Extension.
        </p>
      )}
    </div>
  );
}

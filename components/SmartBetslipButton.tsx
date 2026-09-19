'use client';
import { useState, useEffect } from 'react';

export default function SmartBetslipButton({ matchData }: { matchData: any }) {
  const [hasExtension, setHasExtension] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const checkExt = () => {
      setHasExtension(true); 
    };
    checkExt();

    const handleStatus = (e: any) => {
      setStatus(e.detail.message || 'Processing...');
    };

    window.addEventListener('MIVAJ_SLIP_STATUS', handleStatus);
    return () => window.removeEventListener('MIVAJ_SLIP_STATUS', handleStatus);
  }, []);

  const handleGenerate = (bookie: string) => {
    setStatus(`Generating ${bookie} Code...`);
    
    const affiliates: Record<string, string> = {
      '1xbet': 'https://1xbet.com/?tag=mivaj_vip',
      'bet9ja': 'https://bet9ja.com/?aff=mivaj_ai'
    };

    const payload = {
      bookie,
      affiliateLink: affiliates[bookie],
      matches: [matchData]
    };

    window.dispatchEvent(new CustomEvent('MIVAJ_GENERATE_SLIP', { detail: payload }));
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl mt-8">
      <h3 className="text-xl font-black text-white mb-2">⚡ Generate Native Betslip</h3>
      <p className="text-sm text-slate-400 mb-6">Use the Mivaj AI VIP Agent to instantly push this prediction into your bookmaker.</p>
      
      {status && (
        <div className="bg-emerald-900/40 text-emerald-400 p-3 rounded mb-4 text-sm font-bold animate-pulse">
          {status}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => handleGenerate('1xbet')}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          Generate 1xBet
        </button>
        <button 
          onClick={() => handleGenerate('bet9ja')}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          Generate Bet9ja
        </button>
      </div>
    </div>
  );
}

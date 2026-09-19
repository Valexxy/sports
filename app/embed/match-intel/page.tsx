import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';

export default async function EmbedMatchIntel({ searchParams }: { searchParams: { match?: string } }) {
  const matches = await getRealLiveAndPlayedMatches();
  // For the widget, just grab the best upcoming/live match if none specified
  const match = matches[0]; 

  if (!match) {
    return <div className="p-4 text-center text-slate-400 font-sans bg-slate-950 min-h-screen">No matches available right now.</div>;
  }

  const pick = match.prediction?.topPick?.selection || 'Home/Draw';
  const odds = match.prediction?.topPick?.odds || '1.80';

  return (
    <div className="bg-slate-900 text-white p-6 font-sans h-full flex flex-col justify-center border-t-4 border-emerald-500">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{match.league}</span>
        <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-1 rounded animate-pulse">LIVE INTEL</span>
      </div>
      
      <h2 className="text-2xl font-black text-center mb-6">
        {match.homeTeam} <span className="text-slate-500 font-normal mx-2">vs</span> {match.awayTeam}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-bold mb-1">AI ALGORITHMIC PICK</p>
          <p className="text-lg font-bold text-white">{pick}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-lg border border-emerald-500/30 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <p className="text-[10px] text-slate-400 font-bold mb-1">VALUE ODDS</p>
          <p className="text-xl font-black text-emerald-400">@ {odds}</p>
        </div>
      </div>
      
      <a href="https://mivaj.com" target="_blank" rel="noopener" className="mt-6 block w-full bg-emerald-600 hover:bg-emerald-500 text-center text-white font-bold py-3 rounded-lg transition-colors text-sm">
        View Full Tactical Breakdown
      </a>
    </div>
  );
}

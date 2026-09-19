'use client';
import { useState, useEffect } from 'react';

export default function LiveMatchTracker({ homeTeam, awayTeam }: { homeTeam: string, awayTeam: string }) {
  const [minute, setMinute] = useState(68);
  const [homeMomentum, setHomeMomentum] = useState(65);
  const [events, setEvents] = useState<{time: string, text: string, type: 'danger'|'safe'|'goal'}[]>([
    { time: "68'", text: `${homeTeam} dangerous attack down the left wing.`, type: 'danger' },
    { time: "66'", text: `${awayTeam} clears the ball from the penalty area.`, type: 'safe' },
    { time: "64'", text: `Corner kick for ${homeTeam}.`, type: 'danger' }
  ]);

  // Simulate live match data
  useEffect(() => {
    const interval = setInterval(() => {
      setMinute(m => m >= 90 ? 90 : m + 1);
      
      const newMomentum = Math.floor(Math.random() * 100);
      setHomeMomentum(newMomentum);

      if (Math.random() > 0.7) {
        const isHome = newMomentum > 50;
        const team = isHome ? homeTeam : awayTeam;
        const action = newMomentum > 80 ? "shot on target saved by keeper!" : "maintaining heavy possession in the final third.";
        const type = newMomentum > 80 ? 'danger' : 'safe';
        
        setEvents(prev => [{ time: `${minute}'`, text: `${team} ${action}`, type }, ...prev].slice(0, 4));
      }
    }, 4500); // Update every 4.5s for demo

    return () => clearInterval(interval);
  }, [minute, homeTeam, awayTeam]);

  return (
    <div className="bg-[#0a0e17] border border-slate-800 rounded-2xl overflow-hidden mt-8 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-red-500 font-black text-sm tracking-widest uppercase">Live Radar</span>
        </div>
        <div className="text-white font-mono font-bold">{minute}:00</div>
      </div>

      <div className="grid md:grid-cols-2">
        {/* The Pitch */}
        <div className="p-4 flex flex-col items-center justify-center border-r border-slate-800/50 bg-[#0d131f]">
          <div className="relative w-full max-w-[280px] h-[400px] bg-gradient-to-b from-[#1a3d24] to-[#122e19] rounded-lg border-2 border-white/20 overflow-hidden shadow-inner">
            {/* Pitch Markings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/20 border-t-0"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/20 border-b-0"></div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/20 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Live Heat Overlay */}
            <div 
              className="absolute w-full bg-red-500/20 blur-xl transition-all duration-1000 ease-in-out"
              style={{
                height: '40%',
                top: homeMomentum > 50 ? '10%' : '50%',
                opacity: Math.abs(homeMomentum - 50) / 50
              }}
            ></div>
            
            {/* Ball */}
            <div 
              className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-1000 ease-in-out"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${10 + Math.random() * 80}%`
              }}
            ></div>
          </div>
        </div>

        {/* Analytics & Events */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Live Momentum Engine</h4>
            
            {/* Momentum Bar */}
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={homeMomentum > 50 ? 'text-white' : 'text-slate-500'}>{homeTeam}</span>
              <span className={homeMomentum <= 50 ? 'text-white' : 'text-slate-500'}>{awayTeam}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-blue-500 transition-all duration-700" 
                style={{ width: `${homeMomentum}%` }}
              ></div>
              <div 
                className="h-full bg-red-500 transition-all duration-700" 
                style={{ width: `${100 - homeMomentum}%` }}
              ></div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Home xG</p>
                <p className="text-xl font-black text-white">{(minute * 0.018).toFixed(2)}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Away xG</p>
                <p className="text-xl font-black text-white">{(minute * 0.012).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Play by Play */}
          <div className="mt-8">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Tactical Wire</h4>
            <div className="space-y-3">
              {events.map((ev, i) => (
                <div key={i} className="flex gap-3 text-sm animate-fade-in-up">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">{ev.time}</span>
                  <span className={ev.type === 'danger' ? 'text-white font-semibold' : 'text-slate-400'}>
                    {ev.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

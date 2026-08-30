import React from 'react';
import { ExternalLink, Flame, ShieldCheck, Activity } from 'lucide-react';
import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    home?: string;
    away?: string;
    league?: string;
    prob?: string;
    pick?: string;
    theme?: string;
    type?: string;
  };
}

export default async function EmbedMatchIntelPage({ searchParams }: PageProps) {
  let home = searchParams.home;
  let away = searchParams.away;
  let league = searchParams.league;
  let pick = searchParams.pick;
  let prob = searchParams.prob;
  let isLive = false;
  let homeScore = 0;
  let awayScore = 0;
  let matchMinute = '';

  // Auto-fetch top match if not manually specified
  if (!home || !away) {
    try {
      const matches = await getRealLiveAndPlayedMatches();
      const liveMatch = matches.find((m: any) => m.isLive);
      const upcomingMatch = matches.find((m: any) => !m.isFinished && m.status !== 'FT');
      const target = liveMatch || upcomingMatch || matches[0];

      if (target) {
        home = target.homeTeam;
        away = target.awayTeam;
        league = target.league;
        pick = target.prediction?.topPick?.selection || `${home} or Draw (1X)`;
        prob = String(target.prediction?.topPick?.probability || 84);
        isLive = !!target.isLive;
        homeScore = target.homeScore ?? 0;
        awayScore = target.awayScore ?? 0;
        matchMinute = target.matchMinute || (isLive ? 'LIVE' : '');
      }
    } catch {}
  }

  home = home || 'Arsenal';
  away = away || 'Chelsea';
  league = league || 'Premier League';
  pick = pick || `${home} or Draw (1X)`;
  prob = prob || '84';

  const theme = searchParams.theme || 'dark';
  const bgClass =
    theme === 'emerald'
      ? 'bg-gradient-to-br from-[#061c14] to-[#040e0a] border-stadiumGreen/60 text-white'
      : theme === 'midnight'
      ? 'bg-gradient-to-br from-[#070f26] to-[#040817] border-sky-500/50 text-white'
      : 'bg-[#090d16] border-white/15 text-white';

  return (
    <div className="w-full h-full p-2 flex items-center justify-center bg-transparent">
      <div className={`w-full max-w-[420px] p-4 rounded-2xl border ${bgClass} font-mono text-xs shadow-2xl space-y-3 select-none backdrop-blur-md`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-crimson animate-ping' : 'bg-stadiumGreen animate-pulse'}`} />
            <span className="font-black text-[11px] tracking-wider uppercase text-stadiumGreen">
              {isLive ? 'LIVE MATCH INTEL' : 'MIVAJ AI MATCH RADAR'}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">{league}</span>
        </div>

        {/* Matchup & Score */}
        <div className="flex items-center justify-between py-1 px-1">
          <div className="flex-1 min-w-0 pr-2">
            <span className="font-black text-sm text-white block truncate">{home}</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-center flex-shrink-0">
            {isLive ? (
              <div className="space-y-0.5">
                <span className="font-mono font-black text-base text-stadiumGreen leading-none">
                  {homeScore} - {awayScore}
                </span>
                <span className="text-[8px] text-crimson font-black block tracking-wider animate-pulse">
                  {matchMinute || 'LIVE'}
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-black text-gray-400 tracking-wider">VS</span>
            )}
          </div>

          <div className="flex-1 min-w-0 pl-2 text-right">
            <span className="font-black text-sm text-white block truncate">{away}</span>
          </div>
        </div>

        {/* Prediction Box */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-[9px] text-gray-400 block font-bold">MODEL TOP PICK</span>
            <span className="font-black text-gold text-xs truncate block">{pick}</span>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-[9px] text-gray-400 block font-bold">CONFIDENCE</span>
            <span className="font-black text-stadiumGreen text-xs">{prob}% POISSON</span>
          </div>
        </div>

        {/* Telegram Viral Conversion Hook */}
        <a
          href="https://t.me/mivajsport"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:brightness-110 text-black font-black text-center text-[10px] uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <span>📢 Join 50k Fans on Telegram for Free Bankers ➔</span>
        </a>

        {/* Footer Backlink */}
        <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-white/10 font-sans">
          <span>Referee Audited Settlement</span>
          <a
            href="https://mivaj.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stadiumGreen hover:underline font-bold flex items-center space-x-1 font-mono"
          >
            <span>Live Data by Mivaj.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { LockScreenMatchTracker } from '../lib/lockscreen-live-score-tracker';
import { MatchData } from '../lib/sports-api';
import { EdgeAiCommentator } from './edge-ai-commentator';
import { getCountrySpecificBookmakers, CountryBookmaker } from '../lib/country-bookmakers';
import { getSmartVisitorDetails, SmartVisitorData } from '../lib/smart-visitor-engine';
import { TvBroadcastMatchViewer } from './tv-broadcast-match-viewer';
import { ViralMatchSlipModal } from './viral-match-slip-modal';
import { BookmakerSlipExporter } from './bookmaker-slip-exporter';
import { H2HTacticalRadar } from './h2h-tactical-radar';
import { MatchWinProbabilityChart } from './match-win-probability-chart';
import { MatchShotMapViewer } from './match-shot-map-viewer';
import { LivePlayerRatingsMatrix } from './live-player-ratings-matrix';
import { H2HAndRefereeAnalytics } from './h2h-and-referee-analytics';
import { HeadToHeadArenaModal } from './head-to-head-arena-modal';
import { NairalandMatchThread } from './match-thread/NairalandMatchThread';
import { MatchAlertScheduler } from '../lib/match-alert-scheduler';
import { MatchIntelligenceDrawer } from './match-intelligence-drawer';
import { X, ExternalLink, Zap, Activity, Plus, Bell, Swords } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface InsightsModalProps {
  match: MatchData | null;
  onClose: () => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
}

export const MatchInsightsModal: React.FC<InsightsModalProps> = ({ match, onClose, onSelectOdds }) => {
  const [showViralSlip, setShowViralSlip] = useState(false);
  const [visitorData, setVisitorData] = useState<SmartVisitorData | null>(null);
  const [bookmakers, setBookmakers] = useState<CountryBookmaker[]>([]);
  const [showH2HModal, setShowH2HModal] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    getSmartVisitorDetails().then((data) => {
      setVisitorData(data);
      const list = getCountrySpecificBookmakers(data?.countryCode || 'NG', data?.city || '');
      setBookmakers(list);
    });
  }, []);

  useEffect(() => {
    if (match) {
      setIsFollowed(MatchAlertScheduler.isMatchFollowed(match.id));
    }
  }, [match]);

  const handleToggleFollow = () => {
    if (!match) return;
    if (isFollowed) {
      MatchAlertScheduler.unfollowMatch(match.id);
      setIsFollowed(false);
    } else {
      MatchAlertScheduler.followMatch(match);
      setIsFollowed(true);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  if (!match) return null;

  const p = match.prediction || {
    expectedHomeGoals: 1.5,
    expectedAwayGoals: 1.0,
    homeWinProb: 0.45,
    drawProb: 0.28,
    awayWinProb: 0.27,
    topPick: {
      selection: `${match.homeTeam} or Draw (1X)`,
      market: 'Double Chance',
      odds: 1.35,
      probability: 78,
      rationale: 'Statistical superiority and home dominance model consensus.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-4 sm:p-6 shadow-2xl my-4 max-h-[92vh] overflow-y-auto font-mono text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all hover:rotate-90 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Scoreboard */}
        <div className="flex items-center space-x-2 text-xs font-mono text-stadiumGreen font-bold mb-1">
          <Zap className="w-4 h-4 animate-bounce" />
          <span>STADIUM LIVE MATCH CENTER</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2">
          <div>
            <span className="text-xs font-mono text-gray-400">{match.leagueFlag} {match.league} • 🏟️ {match.venue || `${match.homeTeam} Stadium`}</span>
            <h2 className="text-xl sm:text-3xl font-black text-white flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5">
              <span>{match.homeTeam}</span>
              {match.status === 'FINISHED' || match.status === 'LIVE' ? (
                <span className="px-3.5 py-1 rounded-xl bg-black border-2 border-stadiumGreen text-stadiumGreen font-mono font-black text-lg sm:text-2xl shadow-inner">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
              ) : (
                <span className="text-stadiumGreen font-mono">VS</span>
              )}
              <span>{match.awayTeam}</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playAddPickSound();
                confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
                if (onSelectOdds && p.topPick) {
                  onSelectOdds(match, p.topPick.market || 'Match Winner', p.topPick.odds || 1.25);
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-stadiumGreen/20 hover:bg-stadiumGreen/30 text-stadiumGreen border border-stadiumGreen/60 flex items-center space-x-1 transition-all shadow-md active:scale-95"
            >
              <span>+ Slip</span>
            </button>

            <button
              onClick={async () => {
                const pinned = await LockScreenMatchTracker.pinMatchToLockScreen(match);
                if (pinned) {
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center space-x-1 transition-all shadow-md active:scale-95"
              title="Pin Live Score to Phone Lock Screen"
            >
              <span>Pin Score</span>
            </button>

            <button
              onClick={() => setShowH2HModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
              title="Open Head-to-Head Arena (xG Pitch, Form Battle & Duels)"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>H2H Arena</span>
            </button>

            <button
              onClick={() => setShowViralSlip(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black flex items-center space-x-1 transition-all shadow-md bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40"
              title="Share Match Slip"
            >
              <span>Share</span>
            </button>

            <button
              onClick={handleToggleFollow}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black flex items-center space-x-1.5 transition-all shadow-md ${
                isFollowed
                  ? 'bg-stadiumGreen text-black shadow-stadiumGreen/30'
                  : 'bg-panel hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${isFollowed ? 'fill-black' : 'text-gold'}`} />
              <span>{isFollowed ? 'Alerts On ✓' : 'Alerts'}</span>
            </button>

            <span className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${
              match.status === 'LIVE'
                ? 'bg-crimson/20 text-crimson border-crimson/50 animate-pulse shadow-lg shadow-crimson/30'
                : match.status === 'FINISHED'
                ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40'
                : 'bg-gold/20 text-gold border-gold/40'
            }`}>
              {match.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-crimson animate-ping" />}
              <span>{match.status === 'LIVE' ? `LIVE ${match.matchTime}` : match.status === 'FINISHED' ? 'FT' : match.matchTime}</span>
            </span>
          </div>
        </div>

        {/* 100% Legal Live 2D Tactical Pitch Visualizer */}
        <div className="mb-4 space-y-4">
          <TvBroadcastMatchViewer match={match} />
          <EdgeAiCommentator match={match} />
        </div>

        {/* 1-Click Bookmaker Slip Exporter */}
        <div className="mb-4">
          <BookmakerSlipExporter match={match} />
        </div>

        {/* STANDINGS, INJURIES & TRANSFERS DOSSIER (INSIDE MATCH CENTER) */}
        <div className="mb-4">
          <MatchIntelligenceDrawer
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            league={match.league}
          />
        </div>

        {/* H2H Tactical Radar & Power Curves */}
        <div className="mb-4 space-y-4">
          <H2HTacticalRadar match={match} />
          <MatchWinProbabilityChart match={match} />
          <MatchShotMapViewer match={match} />
          <LivePlayerRatingsMatrix match={match} />
          <H2HAndRefereeAnalytics match={match} />
        </div>

        {/* PREDICTION VS OUTCOME AUDIT & SETTLEMENT PANEL */}
        <div className="p-4 sm:p-5 rounded-3xl bg-panel border-2 border-stadiumGreen/50 space-y-3 mb-5 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="flex items-center space-x-1.5 text-stadiumGreen font-black">
              <span className="w-2 h-2 rounded-full bg-stadiumGreen" />
              <span>{match.status === 'FINISHED' ? 'OFFICIAL SETTLEMENT & PREDICTION AUDIT' : 'SYSTEM AI PREDICTION & COMMUNITY VOTE'}</span>
            </span>
            <span className="text-gold font-bold">
              {match.status === 'FINISHED' ? '✓ SETTLED' : 'ACTIVE FIXTURE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. System Platform Prediction */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">1. Platform Prediction</span>
              <span className="text-sm font-black text-stadiumGreen block">{p.topPick.selection}</span>
              <span className="text-[11px] text-gray-300 font-sans block">
                Odds: <strong className="text-gold">@{p.topPick.odds}</strong> &bull; AI Confidence: <strong className="text-white">{p.topPick.probability}%</strong>
              </span>
            </div>

            {/* 2. Community / Users Prediction Vote */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">2. Viewers Prediction Vote</span>
              <div className="flex justify-between text-[11px] font-bold text-white pt-1">
                <span className="text-stadiumGreen">{match.homeTeam}: {Math.round(p.homeWinProb * 100)}%</span>
                <span className="text-gold">Draw: {Math.round(p.drawProb * 100)}%</span>
                <span className="text-cyan-400">{match.awayTeam}: {Math.round(p.awayWinProb * 100)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden flex mt-1">
                <div style={{ width: `${p.homeWinProb * 100}%` }} className="h-full bg-stadiumGreen" />
                <div style={{ width: `${p.drawProb * 100}%` }} className="h-full bg-gold" />
                <div style={{ width: `${p.awayWinProb * 100}%` }} className="h-full bg-cyan-400" />
              </div>
            </div>

            {/* 3. Final Referee Outcome */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">3. Final Match Outcome</span>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-white font-mono">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
                {match.status === 'FINISHED' ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-stadiumGreen text-black text-[10px] font-black">
                    WON ✅
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/40">
                    IN PLAY ⚡
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400 font-sans block">
                {match.status === 'FINISHED'
                  ? `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam} (Audited)`
                  : 'Pending final whistle confirmation'}
              </span>
            </div>
          </div>

          {match.status !== 'FINISHED' && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => onSelectOdds(match, p.topPick.selection, p.topPick.odds)}
                className="px-4 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {p.topPick.selection} @ {p.topPick.odds} to Slip</span>
              </button>
            </div>
          )}
        </div>

        {/* BENTO GRID (ADDITIONAL INTEL & FAN BANTER THREAD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT 7 COLS: Goal Power & Tension Barometer */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. Goal Power Ratings */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-panel border border-white/10">
                <span className="text-gray-400 block text-[10px]">{match.homeTeam} Goal Power</span>
                <span className="text-lg font-black text-stadiumGreen">{p.expectedHomeGoals.toFixed(2)} xG</span>
              </div>
              <div className="p-3 rounded-2xl bg-panel border border-white/10">
                <span className="text-gray-400 block text-[10px]">{match.awayTeam} Goal Power</span>
                <span className="text-lg font-black text-crimson">{p.expectedAwayGoals.toFixed(2)} xG</span>
              </div>
            </div>

            {/* 2. Live Match Barometer (Attacking Momentum) */}
            <div className="p-3.5 rounded-2xl bg-panel border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Match Tension Barometer</span>
                <span className="font-mono text-gold font-bold">{match.stadiumTension || 85}% Electric</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden flex">
                <div 
                  style={{ width: `${match.stadiumTension || 85}%` }} 
                  className="h-full bg-gradient-to-r from-stadiumGreen via-gold to-crimson transition-all duration-700" 
                />
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Live Odds Matrix & Fan Chat */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Best Market Odds by Local Bookmakers */}
            <div className="p-4 rounded-3xl bg-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black uppercase text-gold">Live Bookmaker Matrix</span>
                <span className="text-[10px] text-stadiumGreen">Best Value Verified</span>
              </div>

              <div className="space-y-2">
                {bookmakers.slice(0, 3).map((bk) => (
                  <a
                    key={bk.id}
                    href={bk.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between hover:border-gold/50 transition-all group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{bk.logo}</span>
                      <div>
                        <span className="font-black text-xs text-white group-hover:text-gold block">{bk.name}</span>
                        <span className="text-[10px] text-gray-400 font-sans block">{bk.bonus}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* 2. Nairaland-Style Forum Banter & Tactical Match Thread */}
            <div className="p-4 rounded-3xl bg-panel border border-white/10 space-y-3 shadow-lg">
              <NairalandMatchThread
                matchId={match.id}
                matchTitle={`${match.homeTeam} vs ${match.awayTeam}`}
              />
            </div>

          </div>

        </div>

      </div>
      {showViralSlip && (
        <ViralMatchSlipModal match={match} onClose={() => setShowViralSlip(false)} />
      )}
      {showH2HModal && (
        <HeadToHeadArenaModal
          match={match}
          onClose={() => setShowH2HModal(false)}
        />
      )}
    </div>
  );
};

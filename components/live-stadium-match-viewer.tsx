'use client';
import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Radio, 
  Tv, 
  Flame, 
  Zap, 
  Trophy, 
  Shield, 
  Activity, 
  Clock, 
  Users, 
  Share2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface LiveStadiumMatchViewerProps {
  match: MatchData;
  onClose?: () => void;
}

export const LiveStadiumMatchViewer: React.FC<LiveStadiumMatchViewerProps> = ({ match }) => {
  const { t } = useTranslation();
  const [activeViewerTab, setActiveViewerTab] = useState<'RADAR' | 'STREAM' | 'TIMELINE' | 'STATS' | 'LINEUPS'>('RADAR');
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] = useState(false);
  const [currentEventText, setCurrentEventText] = useState('Dangerous attack building up on the left wing!');

  // Real-time animated ball coordinates on pitch (0-100% X, 0-100% Y)
  const [ballPos, setBallPos] = useState({ x: 55, y: 48 });
  const [attackPhase, setAttackPhase] = useState<'POSSESSION' | 'DANGEROUS_ATTACK' | 'CORNER' | 'SHOT_ON_TARGET' | 'GOAL_EVENT'>('DANGEROUS_ATTACK');
  const [attackingTeam, setAttackingTeam] = useState<string>(match.homeTeam);
  const [homePossession, setHomePossession] = useState(56);
  const [activeReactionHype, setActiveReactionHype] = useState<number>(1240);

  // 11 Home & Away Tactical Formation Nodes
  const homeFormation = [
    { x: 8, y: 50, label: 'GK', name: 'Alisson' },
    { x: 22, y: 18, label: 'LB', name: 'Robertson' },
    { x: 20, y: 38, label: 'CB', name: 'Van Dijk' },
    { x: 20, y: 62, label: 'CB', name: 'Konate' },
    { x: 22, y: 82, label: 'RB', name: 'Alexander-Arnold' },
    { x: 38, y: 30, label: 'CM', name: 'Mac Allister' },
    { x: 36, y: 50, label: 'DM', name: 'Szoboszlai' },
    { x: 38, y: 70, label: 'CM', name: 'Gravenberch' },
    { x: 58, y: 20, label: 'LW', name: 'Diaz' },
    { x: 62, y: 50, label: 'ST', name: 'Nunez' },
    { x: 58, y: 80, label: 'RW', name: 'Salah' },
  ];

  const awayFormation = [
    { x: 92, y: 50, label: 'GK', name: 'Ederson' },
    { x: 78, y: 18, label: 'RB', name: 'Walker' },
    { x: 80, y: 38, label: 'CB', name: 'Dias' },
    { x: 80, y: 62, label: 'CB', name: 'Akanji' },
    { x: 78, y: 82, label: 'LB', name: 'Gvardiol' },
    { x: 64, y: 35, label: 'DM', name: 'Rodri' },
    { x: 64, y: 65, label: 'DM', name: 'Kovacic' },
    { x: 52, y: 22, label: 'RW', name: 'Bernardo' },
    { x: 50, y: 50, label: 'AM', name: 'De Bruyne' },
    { x: 52, y: 78, label: 'LW', name: 'Foden' },
    { x: 40, y: 50, label: 'ST', name: 'Haaland' },
  ];

  // Dynamic Live Play-by-Play Event Log
  const matchEvents = [
    { minute: "88'", type: 'SUB', title: 'Tactical Substitution', desc: `${match.homeTeam} brings on fresh energy to secure the midfield.`, icon: '🔄' },
    { minute: "72'", type: 'SHOT', title: 'Thunderous Shot on Target', desc: `Close effort saved by goalkeeper! Corner kick awarded.`, icon: '🎯' },
    { minute: "64'", type: 'GOAL', title: '⚽ GOAL! Ball hit top corner!', desc: `Breakthrough goal! Stadium erupts into celebration!`, icon: '⚽' },
    { minute: "45+2'", type: 'HT', title: 'Half Time Whistle', desc: 'Teams head into tunnel for tactical reset.', icon: '⏸️' },
    { minute: "38'", type: 'CARD', title: '🟨 Yellow Card Caution', desc: 'Tactical foul breaking up counter attack.', icon: '🟨' },
    { minute: "1'", type: 'START', title: '🚦 Kickoff Whistle Blows', desc: `Match underway at ${match.venue || 'Stadium'} in ${match.league}.`, icon: '🚦' },
  ];

  // Real-time Tactical Radar Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const isHomeAttacking = Math.random() > 0.44;
      const newX = isHomeAttacking ? Math.floor(50 + Math.random() * 44) : Math.floor(6 + Math.random() * 44);
      const newY = Math.floor(15 + Math.random() * 70);
      
      setBallPos({ x: newX, y: newY });
      setAttackingTeam(isHomeAttacking ? match.homeTeam : match.awayTeam);
      
      if (newX > 84 || newX < 16) {
        setAttackPhase('SHOT_ON_TARGET');
        setCurrentEventText(`🎯 Critical shot on goal by ${isHomeAttacking ? match.homeTeam : match.awayTeam}! Dangerous in the box!`);
      } else if (newX > 68 || newX < 32) {
        setAttackPhase('DANGEROUS_ATTACK');
        setCurrentEventText(`⚡ Fast wing attack by ${isHomeAttacking ? match.homeTeam : match.awayTeam}! Penetrating the final third!`);
      } else {
        setAttackPhase('POSSESSION');
        setCurrentEventText(`Tactical buildup in midfield between ${match.homeTeam} and ${match.awayTeam}.`);
      }

      setHomePossession(Math.floor(48 + Math.random() * 20));
    }, 2400);

    return () => clearInterval(interval);
  }, [match]);

  const handlePlayCommentary = () => {
    phoneHardware.triggerHaptic('SELECTION');
    if (!isAudioCommentaryPlaying) {
      setIsAudioCommentaryPlaying(true);
      stadiumAudio.enableOnUserClick();
      stadiumAudio.speakNigerian(`Live commentary: ${match.homeTeam} ${match.homeScore ?? 0}, ${match.awayTeam} ${match.awayScore ?? 0}. ${currentEventText}`);
    } else {
      setIsAudioCommentaryPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleReactHype = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SELECTION');
    setActiveReactionHype((prev) => prev + 1);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    stadiumAudio.playAddPickSound();
  };

  return (
    <div className="glass-panel-premium rounded-3xl p-4 sm:p-6 border-2 border-stadiumGreen/60 shadow-2xl space-y-4 font-mono text-xs">
      
      {/* Top Banner: Scoreboard & Live Stream Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-crimson p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center text-lg">
              🏟️
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm sm:text-base text-white">LIVE STADIUM MATCH CENTER</span>
              <span className="px-2 py-0.5 rounded-full bg-crimson text-white font-black text-[9px] animate-pulse flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>{match.status === 'LIVE' ? `LIVE ${match.matchTime}` : match.status}</span>
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans mt-0.5 block">
              {match.league} • 🏟️ {match.venue || `${match.homeTeam} Stadium`} • HD Pitch Tracking
            </span>
          </div>
        </div>

        {/* Listen Live Commentary Button (Click to play only) */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={handlePlayCommentary}
            className={`px-3.5 py-2 rounded-2xl font-black text-xs transition-all flex items-center space-x-1.5 shadow-md active:scale-95 ${
              isAudioCommentaryPlaying
                ? 'bg-gold text-black shadow-gold/30'
                : 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 hover:bg-stadiumGreen/30'
            }`}
          >
            {isAudioCommentaryPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-stadiumGreen animate-pulse" />}
            <span>{isAudioCommentaryPlaying ? 'Pause Commentary ⏸️' : 'Listen Live Commentary 🎙️'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {[
          { key: 'RADAR', label: '2D Pitch Radar 🏟️' },
          { key: 'STREAM', label: 'Match Highlights & Stream 🎬' },
          { key: 'TIMELINE', label: 'Timeline & Events ⏱️' },
          { key: 'STATS', label: 'Live Mivaj Match AI Stats 📊' },
          { key: 'LINEUPS', label: 'Formations & Lineups 👥' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveViewerTab(tab.key as any);
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playTabClickSound();
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeViewerTab === tab.key
                ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/20 ring-1 ring-stadiumGreen'
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* VIEW 1: 2D PITCH RADAR */}
      {activeViewerTab === 'RADAR' && (
        <div className="space-y-3 animate-fadeIn">
          
          {/* Status ticker bar */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <span className={`px-2 py-0.5 rounded-full font-black text-[9px] ${
                attackPhase === 'SHOT_ON_TARGET' ? 'bg-crimson text-white animate-bounce' :
                attackPhase === 'DANGEROUS_ATTACK' ? 'bg-gold text-black' : 'bg-stadiumGreen/20 text-stadiumGreen'
              }`}>
                {attackPhase.replace('_', ' ')}
              </span>
              <span className="text-gray-200 text-xs truncate">{currentEventText}</span>
            </div>
            <span className="text-gold font-bold text-[10px] hidden sm:block flex-shrink-0">
              ⚡ Ball: {ballPos.x}% X, {ballPos.y}% Y
            </span>
          </div>

          {/* 2D Synthetic Turf Pitch */}
          <div className="relative w-full h-64 sm:h-80 bg-gradient-to-b from-[#0e3b22] via-[#092917] to-[#0e3b22] rounded-3xl border-2 border-stadiumGreen/50 overflow-hidden shadow-2xl p-2 select-none">
            
            {/* Pitch Markings */}
            <div className="absolute inset-2 border border-white/30 rounded-2xl pointer-events-none" />
            <div className="absolute left-1/2 top-2 bottom-2 w-px bg-white/30 -translate-x-1/2" />
            <div className="absolute left-1/2 top-1/2 w-20 h-20 rounded-full border border-white/30 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />

            {/* Left Penalty Box (Home) */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-24 h-40 border border-white/30 border-l-0 rounded-r-xl" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-20 border border-white/30 border-l-0" />

            {/* Right Penalty Box (Away) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-24 h-40 border border-white/30 border-r-0 rounded-l-xl" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-20 border border-white/30 border-r-0" />

            {/* Home Team Formation Nodes */}
            {homeFormation.map((node, i) => (
              <div
                key={`home-${i}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-stadiumGreen text-black font-black text-[8px] flex items-center justify-center shadow-lg border border-white/40 group-hover:scale-125 transition-transform">
                  {node.label}
                </div>
                <span className="text-[7px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  {node.name}
                </span>
              </div>
            ))}

            {/* Away Team Formation Nodes */}
            {awayFormation.map((node, i) => (
              <div
                key={`away-${i}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-crimson text-white font-black text-[8px] flex items-center justify-center shadow-lg border border-white/40 group-hover:scale-125 transition-transform">
                  {node.label}
                </div>
                <span className="text-[7px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  {node.name}
                </span>
              </div>
            ))}

            {/* Animated Ball Tracker with Pulse Ring */}
            <div
              style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
            >
              <div className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center shadow-2xl ring-4 ring-gold/60 animate-pulse">
                ⚽
              </div>
            </div>
          </div>

          {/* Possession Barometer */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-stadiumGreen">{match.homeTeam}: {homePossession}%</span>
              <span className="text-gray-400">Territorial Momentum</span>
              <span className="text-crimson">{match.awayTeam}: {100 - homePossession}%</span>
            </div>
            <div className="h-2 w-full bg-black/80 rounded-full overflow-hidden flex">
              <div style={{ width: `${homePossession}%` }} className="bg-stadiumGreen h-full transition-all duration-500" />
              <div style={{ width: `${100 - homePossession}%` }} className="bg-crimson h-full transition-all duration-500" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STREAM & HIGHLIGHTS */}
      {activeViewerTab === 'STREAM' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="relative w-full aspect-video rounded-3xl bg-black/90 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-stadiumGreen/20 border-2 border-stadiumGreen flex items-center justify-center text-stadiumGreen text-2xl shadow-xl">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">OFFICIAL MATCH HIGHLIGHTS & LIVE STREAM</h3>
              <p className="text-xs text-gray-400 font-sans max-w-md mt-1">
                Verified official broadcast stream feed via licensed sports partner syndication for {match.league}.
              </p>
            </div>
            <button
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playWonTicketSound();
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(match.homeTeam + ' vs ' + match.awayTeam + ' match highlights')}`, '_blank');
              }}
              className="px-5 py-2.5 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-2 shadow-lg glow-emerald active:scale-95 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Open Official HD Highlights 🎬</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: TIMELINE & EVENTS */}
      {activeViewerTab === 'TIMELINE' && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin animate-fadeIn">
          {matchEvents.map((ev, i) => (
            <div key={i} className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-start space-x-3 hover:border-stadiumGreen/40 transition-colors">
              <span className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-xs flex-shrink-0">
                {ev.minute}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{ev.icon}</span>
                  <span className="font-black text-white text-xs">{ev.title}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-sans mt-0.5">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: LIVE STATS */}
      {activeViewerTab === 'STATS' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 animate-fadeIn">
          {[
            { label: 'Expected Goals (xG)', home: '2.14', away: '0.88' },
            { label: 'Total Shots', home: '14', away: '6' },
            { label: 'Shots on Target', home: '7', away: '2' },
            { label: 'Corner Kicks', home: '8', away: '3' },
            { label: 'Big Chances Created', home: '4', away: '1' },
            { label: 'Fouls Committed', home: '9', away: '12' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[9px] text-gray-400 uppercase font-bold block">{stat.label}</span>
              <div className="flex items-center justify-between font-mono font-black text-sm">
                <span className="text-stadiumGreen">{stat.home}</span>
                <span className="text-gray-500 font-normal">vs</span>
                <span className="text-crimson">{stat.away}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 5: LINEUPS */}
      {activeViewerTab === 'LINEUPS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
          <div className="p-3.5 rounded-2xl bg-black/60 border border-stadiumGreen/30 space-y-2">
            <span className="font-black text-stadiumGreen text-xs block">{match.homeTeam} (4-3-3 Attacking)</span>
            <div className="space-y-1 text-gray-300 text-[11px]">
              {homeFormation.map((p, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-500 font-bold">{p.label}</span>
                  <span className="font-bold text-white">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/60 border border-crimson/30 space-y-2">
            <span className="font-black text-crimson text-xs block">{match.awayTeam} (4-2-3-1 Counter)</span>
            <div className="space-y-1 text-gray-300 text-[11px]">
              {awayFormation.map((p, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-500 font-bold">{p.label}</span>
                  <span className="font-bold text-white">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Live Match Hype Reactions Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-gray-400 font-sans">Live Stadium Hype:</span>
          <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold font-bold text-[10px]">
            🔥 {activeReactionHype} reactions
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {['⚽ GOAL', '🔥 AURA', '👑 BANKER'].map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => handleReactHype(e, emoji)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-bold text-white transition-all active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

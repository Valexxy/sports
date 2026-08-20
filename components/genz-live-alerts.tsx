'use client';

import React, { useState, useEffect } from 'react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { Flame, X, Volume2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MatchData } from '../lib/sports-api';

export interface GenZAlertPayload {
  id: string;
  type: 'LIVE_GOAL' | 'BANKER_LOCKED' | 'RESULT_SETTLED';
  title: string;
  message: string;
  badge: string;
  badgeStyle: string;
  matchTitle: string;
  match: MatchData;
}

interface GenZLiveAlertsProps {
  matches?: MatchData[];
  onOpenMatchAudit?: (match: MatchData) => void;
}

export const GenZLiveAlerts: React.FC<GenZLiveAlertsProps> = ({ 
  matches = [],
  onOpenMatchAudit,
}) => {
  const [activeAlert, setActiveAlert] = useState<GenZAlertPayload | null>(null);

  useEffect(() => {
    if (!matches || matches.length === 0) return;

    // Pick real live or finished match from stream
    const finishedMatch = matches.find((m) => m.status === 'FINISHED');
    const liveMatch = matches.find((m) => m.status === 'LIVE');
    const targetMatch = liveMatch || finishedMatch;

    if (!targetMatch) return;

    const timer = setTimeout(() => {
      if (targetMatch.status === 'LIVE') {
        setActiveAlert({
          id: `alert-${targetMatch.id}`,
          type: 'LIVE_GOAL',
          title: '⚽ IN-PLAY GOAL EVENT',
          message: `${targetMatch.homeTeam} ${targetMatch.homeScore} - ${targetMatch.awayScore} ${targetMatch.awayTeam} (${targetMatch.matchTime}) in ${targetMatch.league}.`,
          badge: 'LIVE MATCH ⚽',
          badgeStyle: 'bg-crimson text-white font-black animate-pulse',
          matchTitle: `${targetMatch.homeTeam} vs ${targetMatch.awayTeam}`,
          match: targetMatch,
        });
        stadiumAudio.playCrowdRoar();
      } else if (targetMatch.status === 'FINISHED') {
        setActiveAlert({
          id: `alert-${targetMatch.id}`,
          type: 'RESULT_SETTLED',
          title: '🟢 OFFICIAL FINAL SCORE SETTLED',
          message: `Official Full Time result: ${targetMatch.homeTeam} ${targetMatch.homeScore} - ${targetMatch.awayScore} ${targetMatch.awayTeam} (${targetMatch.league}). Validated in official referee ledger.`,
          badge: 'SETTLED OUTCOME 🟢',
          badgeStyle: 'bg-stadiumGreen text-black font-black glow-emerald',
          matchTitle: `${targetMatch.homeTeam} vs ${targetMatch.awayTeam}`,
          match: targetMatch,
        });
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [matches]);

  const handleReactHype = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
    });
    stadiumAudio.playCrowdRoar();
  };

  const handleOpenAudit = () => {
    if (activeAlert && onOpenMatchAudit) {
      onOpenMatchAudit(activeAlert.match);
      setActiveAlert(null);
    }
  };

  if (!activeAlert) return null;

  return (
    <div 
      onClick={handleOpenAudit}
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg glass-panel-premium rounded-3xl p-4 border border-stadiumGreen/60 shadow-2xl space-y-2.5 font-mono text-xs animate-fadeIn cursor-pointer hover:scale-[1.02] transition-all"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono ${activeAlert.badgeStyle}`}>
            {activeAlert.badge}
          </span>
          <span className="font-extrabold text-white text-xs">{activeAlert.matchTitle}</span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveAlert(null);
          }} 
          className="p-1 text-gray-400 hover:text-white transition-all rounded-full bg-panel border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Body */}
      <p className="text-gray-200 font-sans text-xs leading-relaxed font-medium">
        {activeAlert.message}
      </p>

      {/* Interactive Actions */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={handleReactHype}
          className="py-2 px-3 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-[11px] flex items-center justify-center space-x-1 transition-all"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>React Hype 🔥</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            stadiumAudio.playCrowdRoar();
          }}
          className="p-2 rounded-xl bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold font-bold transition-all"
          title="Play Crowd Cheer 🔊"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <div className="flex-1 text-right">
          <span className="text-[10px] text-stadiumGreen font-bold flex items-center justify-end space-x-1">
            <span>View Settlement Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

    </div>
  );
};

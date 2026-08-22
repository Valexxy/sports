'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../lib/translation-engine';
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
  onOpenMatch?: (match: MatchData) => void;
}

export const GenZLiveAlerts: React.FC<GenZLiveAlertsProps> = ({ 
  matches = [],
  onOpenMatch,
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
          badge: 'LIVE MATCH',
          badgeStyle: 'bg-crimson text-white font-black animate-pulse',
          matchTitle: `${targetMatch.homeTeam} vs ${targetMatch.awayTeam}`,
          match: targetMatch,
        });
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

  // Auto-dismiss after 7 seconds
  useEffect(() => {
    if (!activeAlert) return;
    const t = setTimeout(() => setActiveAlert(null), 7000);
    return () => clearTimeout(t);
  }, [activeAlert]);

  const handleOpenAlertMatch = () => {
    if (activeAlert && onOpenMatch) {
      onOpenMatch(activeAlert.match);
      setActiveAlert(null);
    }
  };

  if (!activeAlert) return null;

  return (
    <div 
      onClick={handleOpenAlertMatch}
      className="fixed bottom-20 right-3 sm:right-6 z-50 w-[92vw] sm:w-96 glass-panel-premium rounded-2xl p-3.5 border border-stadiumGreen/60 shadow-2xl space-y-2 font-mono text-xs animate-slideUp cursor-pointer hover:scale-[1.02] transition-all"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center space-x-2 min-w-0">
          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono flex-shrink-0 ${activeAlert.badgeStyle}`}>
            {activeAlert.badge}
          </span>
          <span className="font-black text-white text-xs truncate">{activeAlert.matchTitle}</span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveAlert(null);
          }} 
          className="p-1 text-gray-400 hover:text-white transition-all rounded-full bg-panel border border-white/10 flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message Body */}
      <p className="text-gray-200 font-sans text-xs leading-snug line-clamp-2">
        {activeAlert.message}
      </p>

      {/* Interactive Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleReactHype}
            className="py-1 px-2.5 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-[10px] flex items-center space-x-1 transition-all"
          >
            <Flame className="w-3 h-3 fill-current" />
            <span>Hype 🔥</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              stadiumAudio.playCrowdRoar();
            }}
            className="p-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold font-bold transition-all"
            title="Cheer 🔊"
          >
            <Volume2 className="w-3 h-3" />
          </button>
        </div>

        <span className="text-[10px] text-stadiumGreen font-bold flex items-center space-x-0.5 hover:underline">
          <span>View Audit</span>
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>

    </div>
  );
};

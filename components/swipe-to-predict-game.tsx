'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Flame, Sparkles, Check, X, Trophy, Share2, Clock, Zap, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface SwipeGameProps {
  matches: MatchData[];
}

interface MicroQuestion {
  id: string;
  matchTitle: string;
  league: string;
  question: string;
  category: 'GOAL' | 'CARD' | 'SKILL' | 'CORNER';
  timeRemainingSec: number;
  rewardPoints: number;
}

export const SwipeToPredictGame: React.FC<SwipeGameProps> = ({ matches }) => {
  const [streak, setStreak] = useState<number>(0);
  const [auraPoints, setAuraPoints] = useState<number>(1450);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);

  // Dynamic Micro-Questions derived from current live/upcoming matches
  const questions: MicroQuestion[] = React.useMemo(() => {
    const fallbackMatches = matches.length > 0 ? matches : [
      { homeTeam: 'Arsenal', awayTeam: 'Chelsea', league: 'Premier League' } as MatchData,
      { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga' } as MatchData,
      { homeTeam: 'Man City', awayTeam: 'Liverpool', league: 'Premier League' } as MatchData,
    ];

    const generated: MicroQuestion[] = [];
    fallbackMatches.slice(0, 8).forEach((m, idx) => {
      generated.push({
        id: `q-goal-${idx}`,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
        league: m.league || 'Top League',
        question: `Will ${m.homeTeam} score or win a corner in next 10 mins?`,
        category: 'GOAL',
        timeRemainingSec: 15,
        rewardPoints: 100,
      });
      generated.push({
        id: `q-card-${idx}`,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
        league: m.league || 'Top League',
        question: `Will there be any Yellow Card or VAR check this half?`,
        category: 'CARD',
        timeRemainingSec: 15,
        rewardPoints: 150,
      });
    });
    return generated;
  }, [matches]);

  const currentQ = questions[currentIndex % questions.length];

  // 15-Second Countdown Timer for Micro-Question
  useEffect(() => {
    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSwipe('left', false); // Timeout counts as pass
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleSwipe = (direction: 'left' | 'right', isWin: boolean = true) => {
    setSwipeDirection(direction);
    phoneHardware.triggerHaptic(direction === 'right' ? 'SUCCESS' : 'SELECTION');

    if (direction === 'right') {
      stadiumAudio.playAddPickSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setAuraPoints((prev) => prev + 100 * newStreak);

      if (newStreak >= 5) {
        setShowStreakModal(true);
        stadiumAudio.playCrowdRoar();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleShareStreak = () => {
    const text = `🔥 I am on a ${streak}X IN-PLAY SWIPE STREAK on Mivaj Sports! Can you beat my score? 👉 https://mivaj.com`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl relative overflow-hidden glow-emerald">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-crimson text-black font-black text-xl shadow-lg">
            🔥
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                SWIPE-TO-PREDICT (TINDER MODE) ⚡
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                LIVE DOPAMINE LOOP
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Swipe Right for <strong>YES</strong>, Swipe Left for <strong>NO</strong> &bull; Build 5X Streaks for VIP Badges
            </p>
          </div>
        </div>

        {/* Aura Points & Streak Tracker */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-black/60 border border-gold/40 text-gold font-black text-xs">
            <Trophy className="w-3.5 h-3.5 text-gold" />
            <span>{auraPoints.toLocaleString()} AURA</span>
          </div>

          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl border font-black text-xs transition-all ${
            streak >= 3
              ? 'bg-crimson/20 border-crimson text-crimson shadow-lg animate-pulse'
              : 'bg-black/60 border-white/10 text-white'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${streak >= 3 ? 'text-crimson animate-bounce' : 'text-gray-400'}`} />
            <span>{streak}X STREAK {streak >= 5 ? '👑' : streak >= 3 ? '🔥' : ''}</span>
          </div>
        </div>
      </div>

      {/* Swipe Interactive Card Container */}
      <div className="flex flex-col items-center justify-center py-4">
        <div
          className={`w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-black/90 to-panel border-2 border-white/15 shadow-2xl relative transition-all duration-300 transform ${
            swipeDirection === 'right'
              ? 'translate-x-16 rotate-6 border-stadiumGreen bg-stadiumGreen/10'
              : swipeDirection === 'left'
              ? '-translate-x-16 -rotate-6 border-crimson bg-crimson/10'
              : 'hover:scale-[1.01]'
          }`}
        >
          {/* Top Progress & Timer */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {currentQ.league} &bull; {currentQ.matchTitle}
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-crimson/20 text-crimson font-black text-[10px] animate-pulse">
              <Clock className="w-3 h-3" />
              <span>{timeLeft}s LEFT</span>
            </span>
          </div>

          {/* Question Body */}
          <div className="text-center py-6 space-y-3">
            <span className="text-4xl block">⚽</span>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              {currentQ.question}
            </h3>
            <p className="text-[11px] text-stadiumGreen font-bold">
              +{currentQ.rewardPoints} Aura Points on Correct Call
            </p>
          </div>

          {/* Swipe Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => handleSwipe('left')}
              className="py-3 rounded-2xl bg-crimson/20 hover:bg-crimson text-crimson hover:text-white border border-crimson/50 font-black text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <X className="w-4 h-4" />
              <span>NO / CAP (Swipe Left)</span>
            </button>

            <button
              onClick={() => handleSwipe('right')}
              className="py-3 rounded-2xl bg-stadiumGreen text-black hover:bg-emerald-400 border border-stadiumGreen font-black text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg glow-emerald"
            >
              <span>YES / LOCK (Swipe Right)</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Streak Celebration Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono">
          <div className="glass-panel-premium max-w-sm w-full p-6 rounded-3xl border-2 border-gold text-center space-y-4 shadow-2xl">
            <span className="text-5xl block animate-bounce">🔥</span>
            <h3 className="text-lg font-black text-gold">UNSTOPPABLE {streak}X STREAK!</h3>
            <p className="text-xs text-gray-300 font-sans">
              You are on fire! You unlocked the <strong>Certified Ball Knower 👑</strong> badge and +500 Bonus Aura.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleShareStreak}
                className="w-full py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center justify-center space-x-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Flex on WhatsApp Status ➔</span>
              </button>
              <button
                onClick={() => setShowStreakModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                Keep Swiping ⚡
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

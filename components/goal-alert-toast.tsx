'use client';

import React, { useState, useEffect } from 'react';
import { playSynthesizedStadiumRoar } from '../lib/stadium-audio';
import { useScreenWakeLock } from '../lib/hardware-sensors';
import { speakStadiumCommentary } from '../lib/voice-engine';
import { Flame, X, Bell } from 'lucide-react';

export const GoalAlertToast: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('⚽ GOAL! Arsenal 2 - 1 Chelsea (Havertz 62\')');

  // Keep screen awake during live games
  const wakeLockActive = useScreenWakeLock();

  useEffect(() => {
    // Trigger live goal notification & stadium crowd audio synth & commentator voice out loud after 8s
    const timer = setTimeout(() => {
      setShowAlert(true);
      playSynthesizedStadiumRoar();
      speakStadiumCommentary('Goal! Arsenal scores at sixty second minute! Arsenal leads 2 to 1!');

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md glass-panel rounded-2xl p-3.5 border border-stadiumGreen/60 shadow-2xl animate-bounce flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-stadiumGreen font-bold block uppercase tracking-wider">
            LIVE GOAL ALERT ⚽ {wakeLockActive ? '• SCREEN AWAKE ⚡' : ''}
          </span>
          <span className="text-xs font-extrabold text-white font-mono">{alertMessage}</span>
        </div>
      </div>

      <button onClick={() => setShowAlert(false)} className="p-1 text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

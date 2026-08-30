'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, Sparkles, Send, ShieldCheck, X } from 'lucide-react';
import { PushClientEngine } from '../lib/push-client-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const MatchdayPushBell: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    PushClientEngine.isSubscribed().then(setSubscribed);
  }, []);

  const handleToggleSubscribe = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    setLoading(true);
    const result = await PushClientEngine.subscribe();
    setLoading(false);

    if (result.ok) {
      setSubscribed(true);
      phoneHardware.triggerHaptic('SUCCESS');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.2 } });
    } else {
      alert(result.error || 'Failed to enable push notifications.');
    }
  };

  const handleFireTest = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    setTesting(true);
    const ok = await PushClientEngine.triggerTestNotification();
    setTesting(false);
    if (ok) {
      setTestSent(true);
      phoneHardware.triggerHaptic('GOAL');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.3 } });
      setTimeout(() => setTestSent(false), 4000);
    } else {
      alert('Failed to send test push notification. Check connection or allow notifications.');
    }
  };

  return (
    <div className="relative font-mono text-xs select-none">
      {/* iOS Floating / Header Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 shadow-md active:scale-95 ${
          subscribed
            ? 'bg-stadiumGreen/20 border-stadiumGreen/80 text-stadiumGreen shadow-stadiumGreen/20'
            : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:border-gold'
        }`}
        title="Matchday Web Push Notifications (Goals, Bankers, Settlements)"
        aria-label="Toggle Matchday Push Notifications"
      >
        {subscribed ? (
          <BellRing className="w-3.5 h-3.5 text-stadiumGreen animate-pulse" />
        ) : (
          <Bell className="w-3.5 h-3.5 text-gold" />
        )}
        <span className="font-black text-[10px] hidden sm:inline">
          {subscribed ? 'ALERTS ON' : 'PUSH ALERTS'}
        </span>
        <span className={`w-2 h-2 rounded-full ${subscribed ? 'bg-stadiumGreen shadow-[0_0_8px_#00e676]' : 'bg-gold animate-ping'}`} />
      </button>

      {/* Specular Solid Dark Popover Sheet with Backdrop Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[99]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Container */}
          <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-full mt-2 w-auto sm:w-96 rounded-[26px] bg-[#090f1d] border-2 border-stadiumGreen/60 shadow-[0_25px_60px_rgba(0,0,0,1)] p-5 space-y-3.5 z-[100] animate-fadeIn text-white">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-white tracking-wide">MATCHDAY WEB PUSH</h4>
                  <p className="text-[10px] text-gray-300 font-sans">Real-time lock screen alerts (3x Daily)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Schedule Features List — High-Contrast Solid Rows */}
            <div className="space-y-2 text-xs font-sans text-gray-200">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#111c30] border border-white/10 shadow-sm">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-base flex-shrink-0">🌅</span>
                  <div className="truncate">
                    <strong className="text-white block text-xs font-bold">8:00 AM Banker Drop</strong>
                    <span className="text-gray-300 text-[10px] block">Daily Poisson high-accuracy accumulator</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-stadiumGreen flex-shrink-0 stroke-[3]" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#111c30] border border-white/10 shadow-sm">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-base flex-shrink-0">⚽</span>
                  <div className="truncate">
                    <strong className="text-white block text-xs font-bold">Kickoffs &amp; Live Goals</strong>
                    <span className="text-gray-300 text-[10px] block">Instant sub-second score &amp; red card alerts</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-stadiumGreen flex-shrink-0 stroke-[3]" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#111c30] border border-white/10 shadow-sm">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-base flex-shrink-0">📜</span>
                  <div className="truncate">
                    <strong className="text-white block text-xs font-bold">11:00 PM Nightly Audit</strong>
                    <span className="text-gray-300 text-[10px] block">Verified referee ledger settlement &amp; ROI</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-stadiumGreen flex-shrink-0 stroke-[3]" />
              </div>
            </div>

            {/* 1-Tap Action Switch Button */}
            <button
              type="button"
              onClick={handleToggleSubscribe}
              disabled={loading || subscribed}
              className={`w-full py-3.5 rounded-2xl font-black text-xs font-mono flex items-center justify-center space-x-2 transition-all active:scale-[0.97] shadow-lg ${
                subscribed
                  ? 'bg-stadiumGreen/20 border-2 border-stadiumGreen text-stadiumGreen font-black'
                  : 'bg-stadiumGreen hover:bg-emerald-400 text-black shadow-stadiumGreen/25'
              }`}
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>MATCHDAY PUSH ACTIVE ✓</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4 animate-bounce" />
                  <span>1-TAP ACTIVATE PUSH ALERTS</span>
                </>
              )}
            </button>

            {/* Test Trigger Button (Instant Feedback) */}
            {subscribed && (
              <button
                type="button"
                onClick={handleFireTest}
                disabled={testing}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-gray-200 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-gold" />
                <span>{testing ? 'Sending Test...' : testSent ? 'Test Sent! Check Notifications 🔔' : 'Send Test Notification to this Device 🚀'}</span>
              </button>
            )}

            <div className="text-[10px] text-gray-400 text-center flex items-center justify-center space-x-1.5 pt-2 border-t border-white/10 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
              <span>Delivers on iOS 16.4+, Android &amp; Desktop. Zero battery drain.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

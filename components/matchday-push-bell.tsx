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

      {/* iOS 17 Style Specular Glass Popover Sheet (Mobile Responsive) */}
      {isOpen && (
        <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-full mt-2 w-auto sm:w-96 rounded-[26px] bg-[#0c1017]/98 backdrop-blur-2xl border border-stadiumGreen/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.15)] p-4 space-y-3 z-50 animate-fadeIn text-white">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white">MATCHDAY WEB PUSH</h4>
                <p className="text-[10px] text-gray-400 font-sans">Real-time lock screen alerts (3x Daily)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Schedule Features List */}
          <div className="space-y-1.5 text-[11px] font-sans text-gray-300">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-sm">🌅</span>
                <div className="truncate">
                  <strong className="text-white block text-[11px]">8:00 AM Banker Drop</strong>
                  <span className="text-gray-400 text-[10px]">Daily Poisson high-accuracy accumulator</span>
                </div>
              </div>
              <Check className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-sm">⚽</span>
                <div className="truncate">
                  <strong className="text-white block text-[11px]">Kickoffs &amp; Live Goals</strong>
                  <span className="text-gray-400 text-[10px]">Instant sub-second score &amp; red card alerts</span>
                </div>
              </div>
              <Check className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-sm">📜</span>
                <div className="truncate">
                  <strong className="text-white block text-[11px]">11:00 PM Nightly Audit</strong>
                  <span className="text-gray-400 text-[10px]">Verified referee ledger settlement &amp; ROI</span>
                </div>
              </div>
              <Check className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
            </div>
          </div>

          {/* 1-Tap Action Switch Button */}
          <button
            type="button"
            onClick={handleToggleSubscribe}
            disabled={loading || subscribed}
            className={`w-full py-3 rounded-2xl font-black text-xs font-mono flex items-center justify-center space-x-2 transition-all active:scale-[0.97] shadow-lg ${
              subscribed
                ? 'bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen'
                : 'bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black hover:scale-[1.01]'
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

          <div className="text-[9px] text-gray-400 text-center flex items-center justify-center space-x-1 pt-1 border-t border-white/5 font-sans">
            <ShieldCheck className="w-3 h-3 text-stadiumGreen flex-shrink-0" />
            <span>Delivers on iOS 16.4+, Android &amp; Desktop. Zero battery drain.</span>
          </div>
        </div>
      )}
    </div>
  );
};

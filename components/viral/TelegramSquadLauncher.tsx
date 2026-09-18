'use client';

import React, { useState } from 'react';
import { Send, Users, Trophy, Gift, ArrowRight, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export const TelegramSquadLauncher: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const telegramBotUrl = 'https://t.me/MivajSportsBot?start=squad_vip_banker';

  const handleShareSquad = () => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my Mivaj Sports Betting Squad!',
        text: '🔥 Form a 3-man squad with me on Mivaj Sports to unlock 100% Free VIP Bankers & live goal haptics!',
        url: telegramBotUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`🔥 Join my Mivaj Sports Squad on Telegram: ${telegramBotUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-r from-blue-950/60 via-black to-neutral-950 border border-blue-500/40 p-4 sm:p-6 font-mono text-xs shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40 shadow-lg shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-white text-sm sm:text-base">MIVAJ TELEGRAM SQUAD BATTLES</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white font-black text-[9px] uppercase">
                VIRAL 1-TAP
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Invite 3 friends to your squad inside Telegram to unlock 100% Free VIP Bankers &amp; split community prizes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShareSquad}
          className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>{copied ? 'Squad Link Copied!' : 'Form Squad on Telegram (1-Tap)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-black">1</div>
          <div>
            <span className="font-black text-white text-[11px] block">Create Squad</span>
            <span className="text-[10px] text-gray-400 font-sans">1-Tap Telegram Launch</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-stadiumGreen/20 text-stadiumGreen flex items-center justify-center font-black">2</div>
          <div>
            <span className="font-black text-white text-[11px] block">Share with 3 Friends</span>
            <span className="text-[10px] text-gray-400 font-sans">WhatsApp / Telegram</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">3</div>
          <div>
            <span className="font-black text-white text-[11px] block">Unlock VIP Bankers</span>
            <span className="text-[10px] text-gray-400 font-sans">Audited 100% Free Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

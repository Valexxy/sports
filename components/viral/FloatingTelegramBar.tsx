'use client';
import React, { useState, useEffect } from 'react';
import { Send, Share2, Sparkles, X, Users, Flame, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FloatingTelegramBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [memberCount, setMemberCount] = useState(4892);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Subtle live counter tick for high-converting social proof
    const timer = setInterval(() => {
      setMemberCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  if (!isClient || !isVisible) return null;

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    const text = encodeURIComponent(
      `🔥 *MIVAJ SPORTS — 84% AUDITED WIN-RATE BANKERS*\n\n` +
      `⚡ Official mathematical model & sub-second live goal tracker.\n` +
      `🏆 Free Daily Banker Drops & Instant Audio Commentary Wire.\n\n` +
      `👉 Join Free on Telegram: https://t.me/mivajsport\n` +
      `🌐 Live Match Center: https://mivaj.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-3 pointer-events-none animate-in fade-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto pointer-events-auto bg-gradient-to-r from-[#0d1627]/95 via-black/95 to-[#052e16]/95 border-2 border-stadiumGreen/50 rounded-2xl shadow-[0_0_25px_rgba(0,255,135,0.25)] backdrop-blur-md p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Pulse & Copy */}
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/50 flex items-center justify-center">
              <Send className="w-4 h-4 text-stadiumGreen animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-crimson"></span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-black text-stadiumGreen uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-gold inline" /> Free VIP Banker Drops
              </span>
              <span className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-full bg-white/10 text-[9px] font-mono text-gray-300">
                <Users className="w-2.5 h-2.5 text-cyan-400" />
                <span>{memberCount.toLocaleString()} Punters Joined</span>
              </span>
            </div>
            <p className="text-white text-xs font-black truncate leading-tight">
              Get Tonight&apos;s 84% Win-Rate Match Code & Audio Wire 📲
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            onClick={handleShareWhatsApp}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-black flex items-center space-x-1 transition-all active:scale-95 shadow-sm"
            title="Share with Friends on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Share</span>
          </button>

          <a
            href="https://t.me/mivajsport"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } })}
            className="px-3.5 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black text-xs font-mono font-black flex items-center space-x-1.5 shadow-lg shadow-stadiumGreen/25 active:scale-95 transition-all"
          >
            <span>JOIN TELEGRAM</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

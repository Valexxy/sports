'use client';

import React, { useRef } from 'react';
import { X, Download, Share2, Sparkles, MessageCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

interface SocialWishCardModalProps {
  player: {
    name: string;
    team_name: string;
    cutout_url?: string;
    country_flag?: string;
  };
  wishMessage: string;
  senderName: string;
  onClose: () => void;
}

export const SocialWishCardModal: React.FC<SocialWishCardModalProps> = ({
  player,
  wishMessage,
  senderName,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShareWhatsApp = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    const text = `🎂 I just wished *${player.name}* a Happy Birthday on Mivaj Sports!\n\n"${wishMessage}" — _${senderName}_\n\nLeave your birthday wish here: https://mivaj.com/players/${player.name.toLowerCase().replace(/\s+/g, '-')}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    const text = `🎂 Happy Birthday ${player.name}! 🌟\n\n"${wishMessage}" — via @MivajSports\n\nhttps://mivaj.com`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono">
      <div className="glass-panel-premium w-full max-w-md rounded-3xl border-2 border-stadiumGreen p-5 space-y-4 shadow-2xl text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1">
          <span className="text-[10px] text-stadiumGreen font-black uppercase tracking-wider flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>VIRAL BIRTHDAY SOCIAL CARD</span>
          </span>
          <h3 className="font-black text-sm text-white">FLEX ON STATUS & TWITTER</h3>
        </div>

        {/* 9:16 Preview Card */}
        <div
          ref={cardRef}
          className="relative aspect-[9/12] w-full rounded-2xl bg-gradient-to-b from-[#0e1a38] via-[#070c18] to-black border-2 border-gold/60 p-4 flex flex-col justify-between overflow-hidden shadow-inner select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/70 border border-white/10 backdrop-blur-sm">
              <span className="text-xs">⚡</span>
              <span className="text-[10px] font-black text-white">MIVAJ.COM</span>
            </div>
            <span className="text-[10px] font-black text-gold px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40">
              🎂 STAR BIRTHDAY
            </span>
          </div>

          {/* Center Player Cutout */}
          <div className="relative my-auto flex flex-col items-center z-10">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-stadiumGreen/60 overflow-hidden shadow-2xl bg-gradient-to-t from-black to-emerald-950/40 flex items-center justify-center">
              <img
                src={player.cutout_url || 'https://r2.thesportsdb.com/images/media/player/cutout/b16vvh1726053896.png'}
                alt={player.name}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
              />
            </div>

            <h2 className="text-base sm:text-lg font-black text-white mt-2 text-center">
              {player.name} {player.country_flag}
            </h2>
            <span className="text-[10px] text-gray-400 font-bold">{player.team_name}</span>
          </div>

          {/* User Birthday Wish Quote Box */}
          <div className="z-10 p-3 rounded-xl bg-black/80 border border-white/10 space-y-1 backdrop-blur-md">
            <p className="text-xs text-stadiumGreen font-bold italic line-clamp-3">
              "{wishMessage}"
            </p>
            <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-white/10">
              <span>Wished by: <strong className="text-white">{senderName}</strong></span>
              <span className="text-gold font-bold">mivaj.com/birthdays</span>
            </div>
          </div>
        </div>

        {/* 1-Tap Share Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Status</span>
          </button>
          
          <button
            onClick={handleShareTwitter}
            className="py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Share to X / Twitter</span>
          </button>
        </div>

      </div>
    </div>
  );
};

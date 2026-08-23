'use client';
import React from 'react';
import { X, Trophy, Share2, Award } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export const PunterCloutCardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-gold/70 p-6 space-y-4 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] via-black to-[#0f172a] border-2 border-gold space-y-3 shadow-2xl">
          <Award className="w-8 h-8 text-gold mx-auto animate-bounce" />
          <h3 className="font-black text-base text-gold uppercase tracking-widest">Master Punter Diploma</h3>
          <p className="text-xs text-gray-300">Awarded to <strong className="text-white">@AuraGod_Lagos</strong></p>
          <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-white/10">
            <div><span className="text-[10px] text-gray-400">Win Streak</span><div className="font-black text-stadiumGreen">7 Consecutive Wins</div></div>
            <div><span className="text-[10px] text-gray-400">Accuracy</span><div className="font-black text-gold">94.8% Verified</div></div>
          </div>
        </div>
        <button onClick={() => { phoneHardware.triggerHaptic('SELECTION'); window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('🔥 Check my Certified AuraScore Punter Diploma: 7 Wins in a row! https://sports-teal-psi.vercel.app/'), '_blank'); }} className="w-full py-3 rounded-2xl bg-gold text-black font-black flex items-center justify-center space-x-2">
          <Share2 className="w-4 h-4" /><span>Share Diploma on WhatsApp & Twitter</span>
        </button>
      </div>
    </div>
  );
};

'use client';

import React, { useRef } from 'react';
import { X, Download, Share2, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface WhatsAppFlexCardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  streak: string;
  winRate: string;
  auraWon: number;
}

export const WhatsAppFlexCardOverlay: React.FC<WhatsAppFlexCardOverlayProps> = ({
  isOpen,
  onClose,
  username,
  streak,
  winRate,
  auraWon,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#05070B');
    grad.addColorStop(0.5, '#022c22');
    grad.addColorStop(1, '#05070B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = '#00FFA3';
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, 1000, 1840);

    ctx.fillStyle = '#00FFA3';
    ctx.font = 'bold 54px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ AURASCORE STADIUM 2.0 ⚡', 540, 240);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px sans-serif';
    ctx.fillText('Official Closed-Loop AI Prediction Flex', 540, 310);

    ctx.font = '140px sans-serif';
    ctx.fillText('👑', 540, 520);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 84px monospace';
    ctx.fillText(username.startsWith('@') ? username : '@' + username, 540, 660);

    // Stats Grid Box
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(120, 800, 840, 480);
    ctx.strokeStyle = '#00FFA360';
    ctx.lineWidth = 4;
    ctx.strokeRect(120, 800, 840, 480);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'black 72px monospace';
    ctx.fillText('+' + auraWon.toLocaleString() + ' AURA XP', 540, 920);

    ctx.fillStyle = '#00FFA3';
    ctx.font = 'bold 50px monospace';
    ctx.fillText(streak + ' STREAK • ' + winRate + ' WIN RATE', 540, 1030);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px sans-serif';
    ctx.fillText('Dixon-Coles Poisson Certified Model', 540, 1140);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px monospace';
    ctx.fillText('MATCH MY AURA ➔ mivaj.com', 540, 1680);

    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mivaj-flex-' + username.replace('@', '') + '.png';
    link.href = imageUri;
    link.click();

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCoinCashout();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const handleShareWhatsApp = () => {
    const text = '🔥 *Omo! Check my AuraScore streak: ' + streak + ' with ' + winRate + ' Win Rate!* 🔥\n\nI just bagged +' + auraWon.toLocaleString() + ' Aura XP! Match my aura or pass: 👉 https://mivaj.com';
    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium max-w-md w-full p-6 rounded-3xl border-2 border-stadiumGreen shadow-2xl space-y-4 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10"><X className="w-4 h-4" /></button>
        
        <span className="text-5xl block animate-bounce">👑</span>
        <h3 className="text-lg font-black text-white">{username}</h3>
        <p className="text-xs text-stadiumGreen font-black">{streak} Streak &bull; {winRate} Win Rate</p>

        <div className="p-3.5 rounded-2xl bg-black/80 border border-gold/40 space-y-1">
          <span className="text-[10px] text-gray-400 block font-bold">TOTAL CLOSED-LOOP AURA XP</span>
          <span className="text-xl font-black text-gold font-mono">+{auraWon.toLocaleString()} AURA</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleDownload}
            className="py-2.5 rounded-xl bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save 9:16 Card</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow active:scale-95 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Flex on WhatsApp</span>
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

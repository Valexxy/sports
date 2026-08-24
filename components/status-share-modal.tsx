'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, FileText, Download, Share2, Copy, Check } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface StatusShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  odds: string;
  matchesCount: number;
  bookingCode: string;
  payoutEst: string;
}

export const StatusShareModal: React.FC<StatusShareModalProps> = ({
  isOpen,
  onClose,
  title,
  odds,
  matchesCount,
  bookingCode,
  payoutEst,
}) => {
  const [mode, setMode] = useState<'IMAGE' | 'TEXT'>('IMAGE');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const formattedText = 
    '🔥 *MIVAJ SPORTS • VIP BANKER ACCUMULATOR* 🔥\n\n' +
    '📊 *Total Odds:* @' + odds + ' (' + matchesCount + ' Curated Games)\n' +
    '💰 *Estimated Return:* ' + payoutEst + '\n' +
    '🛡️ *Cut-1 Insurance Shield:* ACTIVE\n' +
    '🎟️ *SportyBet / Stake Booking Code:* *' + bookingCode + '*\n\n' +
    '👉 Join Arena & Bet Live: https://mivaj.com';

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToWhatsApp = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(formattedText);
    window.open(url, '_blank');
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set 9:16 vertical resolution (1080 x 1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background Gradient (Void Dark to Emerald)
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
    gradient.addColorStop(0, '#05070B');
    gradient.addColorStop(0.5, '#0a1512');
    gradient.addColorStop(1, '#05070B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Border Glow
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, 1000, 1840);

    // Header Logo Badge
    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 54px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ MIVAJ SPORTS STADIUM 2.0 ⚡', 540, 240);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px sans-serif';
    ctx.fillText('Official AI Poisson Matchday Slip', 540, 310);

    // Trophy Icon
    ctx.font = '120px sans-serif';
    ctx.fillText('🏆', 540, 520);

    // Main Odds
    ctx.fillStyle = '#FFD700';
    ctx.font = 'black 110px monospace';
    ctx.fillText('@' + odds + ' ODDS', 540, 680);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(matchesCount + ' Curated Banker Matches • Cut-1 Shielded', 540, 770);

    // Booking Code Card Box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(140, 890, 800, 320);
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 4;
    ctx.strokeRect(140, 890, 800, 320);

    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('OFFICIAL BOOKING CODE', 540, 970);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'black 90px monospace';
    ctx.fillText(bookingCode, 540, 1090);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '32px sans-serif';
    ctx.fillText('Valid on SportyBet • 22Bet • Stake', 540, 1160);

    // Payout return
    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 48px monospace';
    ctx.fillText('Est. Payout: ' + payoutEst, 540, 1340);

    // Watermark & Call to action
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px monospace';
    ctx.fillText('JOIN FREE & BET LIVE ➔ mivaj.com', 540, 1650);

    ctx.fillStyle = '#64748b';
    ctx.font = '30px sans-serif';
    ctx.fillText('18+ Only • Responsible Gaming • Verified Dixon-Coles AI', 540, 1730);

    // Trigger Download
    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mivaj-slip-' + bookingCode + '.png';
    link.href = imageUri;
    link.click();

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCoinCashout();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono">
      <div className="glass-panel-premium max-w-md w-full p-5 sm:p-6 rounded-3xl border-2 border-stadiumGreen/60 space-y-4 shadow-2xl relative text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3">
          <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
            📱
          </div>
          <div>
            <h3 className="font-black text-sm text-white">SHARE TO WHATSAPP STATUS</h3>
            <p className="text-[10px] text-gray-400 font-sans">Choose between high-res story picture or text</p>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/60 border border-white/10">
          <button
            onClick={() => setMode('IMAGE')}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'IMAGE' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>📸 9:16 Picture Card</span>
          </button>

          <button
            onClick={() => setMode('TEXT')}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'TEXT' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📝 Text & Code</span>
          </button>
        </div>

        {/* Preview Container */}
        {mode === 'IMAGE' ? (
          <div className="p-4 rounded-2xl bg-gradient-to-b from-black to-emerald-950/40 border border-stadiumGreen/40 text-center space-y-2">
            <span className="text-3xl block">🏆</span>
            <div className="text-xl font-black text-gold font-mono">@{odds} ODDS</div>
            <div className="text-[10px] text-gray-300">{matchesCount} Banker Matches • Cut-1 Shielded</div>
            <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 font-mono text-sm font-black text-[#00e676]">
              {bookingCode}
            </div>
            <p className="text-[9px] text-gray-400">Watermarked for mivaj.com &bull; 1080x1920 HD</p>

            <button
              onClick={handleDownloadImage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg glow-emerald active:scale-95 transition-all mt-3"
            >
              <Download className="w-4 h-4" />
              <span>Download 9:16 Image for Status ➔</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <pre className="p-3 rounded-2xl bg-black/80 border border-white/10 text-[10px] text-gray-300 font-mono whitespace-pre-wrap max-h-44 overflow-y-auto">
              {formattedText}
            </pre>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyText}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied! ✓' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleShareToWhatsApp}
                className="py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open WhatsApp ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden Canvas for High-Res 1080x1920 Export */}
        <canvas ref={canvasRef} className="hidden" />

      </div>
    </div>
  );
};

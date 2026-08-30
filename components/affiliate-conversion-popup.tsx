'use client';

import React, { useState, useEffect } from 'react';
import { Gift, X, ExternalLink, Sparkles, Check, Copy, Flame, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { useModalBackHandler } from '../lib/history-back-navigation';

interface AffiliateConversionPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AFFILIATE_OFFERS = [
  {
    id: '22bet',
    name: '22Bet Sportsbook',
    bonus: '300% Welcome Bonus up to ₦250,000',
    code: 'MIVAJ22',
    url: 'https://22bet.ng/?tag=d_972744m_97c_',
    badge: 'EXCLUSIVE PARTNER 👑',
    bg: 'from-emerald-950/80 to-emerald-900/60 border-emerald-500/50',
    btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
  },
  {
    id: 'stake',
    name: 'Stake.com Crypto & Fiat',
    bonus: 'VIP Tier Boost + Zero Payout Fees',
    code: 'MIVAJVIP',
    url: 'https://stake.com/?c=bPn8D0iA',
    badge: 'INSTANT CASHOUT ⚡',
    bg: 'from-blue-950/80 to-blue-900/60 border-blue-500/50',
    btnBg: 'bg-blue-500 hover:bg-blue-400 text-white',
  },
  {
    id: 'bet9ja',
    name: 'Bet9ja Nigeria',
    bonus: '100% Match Bonus + 170% Multiple Boost',
    code: 'MIVAJ9JA',
    url: 'https://sports.bet9ja.com?ref=mivaj',
    badge: 'NAIJA FAVOURITE 🟢',
    bg: 'from-green-950/80 to-green-900/60 border-green-500/50',
    btnBg: 'bg-green-600 hover:bg-green-500 text-white',
  },
  {
    id: '1xbet',
    name: '1xBet Global',
    bonus: '300% First Deposit Bonus Package',
    code: 'MIVAJ1X',
    url: 'https://1xbet.ng?ref=mivaj',
    badge: 'HIGHEST ACCUMULATOR ODDS 🌍',
    bg: 'from-cyan-950/80 to-cyan-900/60 border-cyan-500/50',
    btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-black',
  },
];

export const AffiliateConversionPopup: React.FC<AffiliateConversionPopupProps> = ({
  isOpen: controlledOpen,
  onClose: controlledClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const close = controlledClose || (() => setInternalOpen(false));

  useModalBackHandler(open, close);

  useEffect(() => {
    if (controlledOpen !== undefined) return;
    // Show automatically after 45 seconds of browsing if user hasn't seen it recently
    const hasSeen = sessionStorage.getItem('mivaj_seen_bonus_popup');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
        sessionStorage.setItem('mivaj_seen_bonus_popup', 'true');
        try { phoneHardware.triggerHaptic('AFRO_BEAT'); } catch {}
      }, 35000);
      return () => clearTimeout(timer);
    }
  }, [controlledOpen]);

  const handleClaim = (offer: typeof AFFILIATE_OFFERS[0]) => {
    navigator.clipboard.writeText(offer.code);
    setCopiedCode(offer.id);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    try { stadiumAudio.playCoinCashout(); } catch {}
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });

    setTimeout(() => {
      window.open(offer.url, '_blank');
      setCopiedCode(null);
    }, 400);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-xl bg-[#080c14] border-2 border-gold/50 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl shadow-gold/10 text-white relative overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-stadiumGreen via-gold to-stadiumGreen" />

        {/* Close Button */}
        <button
          onClick={() => {
            try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
            close();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Banner */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center space-x-1.5 bg-gold/15 text-gold px-3 py-1 rounded-full border border-gold/30 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Exclusive Affiliate Welcome Bonuses</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Claim Up To ₦250,000 + 300% Bonus
          </h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Place your banker predictions with verified bookmaker partners. 1-Click unlock promo bonuses & instant withdrawals:
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 py-1">
          {AFFILIATE_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className={`p-3.5 rounded-2xl bg-gradient-to-b ${offer.bg} border space-y-2 flex flex-col justify-between shadow-md group`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-gold bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                    {offer.badge}
                  </span>
                  <span className="text-[10px] font-mono text-gray-300 font-bold">Code: {offer.code}</span>
                </div>
                <h3 className="font-extrabold text-sm text-white">{offer.name}</h3>
                <p className="text-[11px] text-gray-200 mt-1 font-medium leading-snug">{offer.bonus}</p>
              </div>

              <button
                onClick={() => handleClaim(offer)}
                className={`w-full py-2 px-3 rounded-xl ${offer.btnBg} font-black text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 group-hover:shadow-lg`}
              >
                <span>{copiedCode === offer.id ? 'Code Copied! Opening... ✓' : 'Claim Bonus & Bet ➔'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 text-center sm:text-left">
          <span>Official Telegram Community: <a href="https://t.me/mivajsport" target="_blank" rel="noreferrer" className="text-gold font-bold hover:underline">t.me/mivajsport</a></span>
          <span>Support: <strong className="text-white">mivajtips@gmail.com</strong></span>
        </div>
      </div>
    </div>
  );
};

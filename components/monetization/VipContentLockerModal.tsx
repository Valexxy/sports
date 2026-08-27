'use client';

import React, { useState } from 'react';
import { 
  Lock, Unlock, ShieldCheck, Sparkles, ExternalLink, 
  CheckCircle2, ArrowRight, Zap, Gift, Trophy, X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOP_CPA_AFFILIATES, SMARTLINK_CONFIG } from '../../config/monetization';
import { smartlinkMonetizer } from '../../lib/smartlink-monetizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';

interface VipContentLockerModalProps {
  slipTitle?: string;
  totalOdds?: string;
  confidenceRate?: string;
  vipBookingCode?: string;
  onClose: () => void;
  onUnlocked?: () => void;
}

export const VipContentLockerModal: React.FC<VipContentLockerModalProps> = ({
  slipTitle = "🔥 58.40 ACCA BANKER • 100% AUDITED",
  totalOdds = "58.40",
  confidenceRate = "98.2%",
  vipBookingCode = "STAKE-7798X2",
  onClose,
  onUnlocked,
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCpaUnlock = (affiliateUrl: string, name: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    setVerifying(true);

    // Open affiliate CPA signup in new tab
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');

    // Simulate instant unlocking verification
    setTimeout(() => {
      setVerifying(false);
      setUnlocked(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      if (onUnlocked) onUnlocked();
    }, 2800);
  };

  const handleSmartlinkUnlock = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    setVerifying(true);
    
    // Trigger Monetag / CPAGrip smartlink
    smartlinkMonetizer.triggerSmartLink(SMARTLINK_CONFIG.monetagDirectLink);

    setTimeout(() => {
      setVerifying(false);
      setUnlocked(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      if (onUnlocked) onUnlocked();
    }, 2500);
  };

  const handleCopyCode = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    navigator.clipboard.writeText(vipBookingCode);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn font-mono">
      <div className="glass-panel-premium w-full max-w-lg rounded-3xl border-2 border-stadiumGreen p-6 space-y-5 shadow-2xl text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 shadow-lg shadow-stadiumGreen/20">
            {unlocked ? <Unlock className="w-8 h-8 text-stadiumGreen" /> : <Lock className="w-8 h-8 text-gold animate-bounce" />}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black text-gold tracking-widest uppercase flex items-center justify-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP LOCKER • HIGH VALUE ACCUMULATOR</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {slipTitle}
            </h3>
            <div className="flex items-center justify-center space-x-3 text-xs pt-1">
              <span className="text-gray-400">Total Odds: <strong className="text-stadiumGreen font-mono">{totalOdds}</strong></span>
              <span className="text-gray-400">• Confidence: <strong className="text-cyan-400">{confidenceRate}</strong></span>
            </div>
          </div>
        </div>

        {/* UNLOCKED STATE */}
        {unlocked ? (
          <div className="p-5 rounded-2xl bg-black/80 border-2 border-stadiumGreen text-center space-y-4 animate-fadeIn">
            <span className="text-xs text-stadiumGreen font-black block">
              🎉 VIP SLIP UNLOCKED &amp; VERIFIED!
            </span>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 space-y-1">
              <span className="text-[10px] text-gray-400 block">STAKE &amp; 22BET BOOKING CODE:</span>
              <div className="text-3xl font-black text-stadiumGreen tracking-widest select-all font-mono">
                {vipBookingCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="w-full py-3.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-stadiumGreen/25 transition-all active:scale-95 font-mono"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              <span>{copied ? 'CODE COPIED TO CLIPBOARD ✓' : 'COPY VIP CODE & BET NOW'}</span>
            </button>
          </div>
        ) : (
          /* LOCKED STATE — 2 HIGH VALUE UNLOCK PATHS */
          <div className="space-y-4">
            
            {verifying ? (
              <div className="p-6 rounded-2xl bg-black/80 border border-gold/40 text-center space-y-3 animate-pulse">
                <span className="w-4 h-4 rounded-full bg-gold animate-ping inline-block" />
                <h4 className="text-xs font-black text-gold">VERIFYING SPONSOR COMPLETION...</h4>
                <p className="text-[11px] text-gray-400 font-sans">
                  Checking registration or sponsored verification. Slip will automatically reveal in 2 seconds!
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-300 text-center leading-relaxed">
                  Choose an instant method below to unlock this <strong>{totalOdds} Odds Verified Slip</strong> for 100% free:
                </p>

                {/* Option 1: 1-Click Register on Top CPA Partners */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gold block">
                    METHOD A: 1-CLICK FREE REGISTRATION (INSTANT UNLOCK)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TOP_CPA_AFFILIATES.slice(0, 2).map((aff) => (
                      <button
                        key={aff.id}
                        onClick={() => handleCpaUnlock(aff.affiliateUrl, aff.name)}
                        className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-stadiumGreen/40 hover:border-stadiumGreen text-left transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-white">{aff.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold">
                              FREE UNLOCK
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {aff.bonusText}
                          </span>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-stadiumGreen">
                          <span>{aff.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 2: 30-Second Task / Smartlink */}
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <span className="text-[10px] font-black text-cyan-400 block">
                    METHOD B: COMPLETE 30-SEC SPONSORED VERIFICATION
                  </span>

                  <button
                    onClick={handleSmartlinkUnlock}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <Gift className="w-4 h-4 text-cyan-400" />
                    <span>Quick Sponsor Unlock (30 Seconds)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center justify-between text-[9px] text-gray-500 pt-1 border-t border-white/10">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-stadiumGreen" />
                <span>100% Free • No Payment Required</span>
              </span>
              <span>Audited by AuraMaster_NG</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

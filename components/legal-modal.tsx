'use client';
import React from 'react';
import { X, ShieldCheck, AlertCircle, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8 font-mono text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <ShieldCheck className="w-6 h-6 text-stadiumGreen" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white">LEGAL TERMS, PRIVACY & RESPONSIBLE FAN GAMING</h2>
            <p className="text-xs text-gray-400">Entertainment & Sports Prediction Information Only (18+ / 21+)</p>
          </div>
        </div>

        {/* Legal Points */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-gray-300 font-sans leading-relaxed">
          
          <div className="p-3.5 rounded-xl bg-panel border border-white/10 space-y-1">
            <span className="font-extrabold text-gold text-xs block font-mono">1. ENTERTAINMENT & INFORMATION DISCLAIMER</span>
            <p className="text-xs text-gray-300">
              Mivaj Sports Pro is an independent sports prediction, live score, and fan engagement platform. We are NOT a sports betting operator or bookmaker. All match win probabilities and odds matrices are for statistical analysis and fan fun only.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-panel border border-white/10 space-y-1">
            <span className="font-extrabold text-stadiumGreen text-xs block font-mono">2. RESPONSIBLE FAN ENGAGEMENT (18+)</span>
            <p className="text-xs text-gray-300">
              Never risk capital you cannot afford to lose. Always adhere to recommended smart stake safety guidelines (max 5% of total bankroll per match). If you or someone you know needs help, visit BeGambleAware.org or GamCare.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-panel border border-white/10 space-y-1">
            <span className="font-extrabold text-cyberPurple text-xs block font-mono">3. PRIVACY & COMMUNITY HARDENING</span>
            <p className="text-xs text-gray-300">
              We strictly enforce OWASP security standards, anti-spam filters, and Content Security Policies. No private messaging / direct chatting (DMs) is allowed to prevent harassment.
            </p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-stadiumGreen text-black font-extrabold text-xs shadow-md"
        >
          I Accept Legal Terms & Continue
        </button>

      </div>
    </div>
  );
};

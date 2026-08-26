'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Swords, Trophy, ShieldCheck, Zap, ArrowLeft, Check, Share2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../../lib/sound-synthesizer';

export default function ChallengeDeepLinkPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = (params?.id as string) || 'mivaj-p2p';
  const [accepted, setAccepted] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const fixtureTitle = 'Arsenal vs Chelsea';
  const creator = '@Tunde_Arsenal';
  const creatorPick = 'Arsenal Win 🏠';
  const stake = 500;

  const handleAcceptDuel = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdRoar();
    setAccepted(true);
    setResolving(true);

    setTimeout(() => {
      setResolving(false);
      setWinner('@You');
      stadiumAudio.playCoinCashout();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }, 3000);
  };

  const handleShareOnWhatsApp = () => {
    const text = '⚔️ *WAHALA! I just challenged @Tunde on Mivaj Sports!* ⚔️\n\nArsenal vs Chelsea • 500 Aura Escrow. Match your aura or pass! 👉 https://mivaj.com/challenge/' + challengeId;
    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-panel-premium max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/60 shadow-2xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Arena</span>
          </button>

          <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-black font-black text-[9px]">
            OFFICIAL P2P ESCROW
          </span>
        </div>

        {/* Duel Graphic Card */}
        <div className="text-center space-y-3">
          <span className="text-5xl block animate-bounce">⚔️</span>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            1v1 AURA DUEL CHALLENGE
          </h1>
          <p className="text-xs text-gray-300 font-sans">
            <strong className="text-gold">{creator}</strong> just threw down a <strong className="text-cyan-400">{stake} AURA</strong> challenge for your face!
          </p>
        </div>

        {/* Match & Pick Box */}
        <div className="p-4 rounded-2xl bg-black/80 border border-cyan-400/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">FIXTURE:</span>
            <span className="font-black text-white">{fixtureTitle}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">CREATOR PICK:</span>
            <span className="font-black text-stadiumGreen">{creatorPick}</span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
            <span className="text-gray-400">TOTAL ESCROW POT:</span>
            <span className="font-black text-gold font-mono text-sm">🏆 {stake * 2} AURA</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          {!accepted ? (
            <button
              onClick={handleAcceptDuel}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg glow-emerald active:scale-95 transition-all"
            >
              <Swords className="w-4 h-4" />
              <span>Enter Ring & Match {stake} Aura ➔</span>
            </button>
          ) : resolving ? (
            <div className="w-full py-3.5 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-xs text-center animate-pulse">
              ⚽ DUEL IN-PLAY: Resolving match outcome in escrow...
            </div>
          ) : (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen font-black text-xs text-center">
                🏆 VICTORY! You won +{stake * 2} AURA Points!
              </div>
              <button
                onClick={handleShareOnWhatsApp}
                className="w-full py-3 rounded-2xl bg-[#25D366] text-black font-black text-xs flex items-center justify-center space-x-2 shadow"
              >
                <Share2 className="w-4 h-4" />
                <span>Flex Win on WhatsApp Status ➔</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

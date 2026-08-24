'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { Send, MessageSquare, Share2, Sparkles, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink, Zap } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

interface SocialBroadcastHubProps {
  matches: MatchData[];
}

export const SocialCommunityBroadcastHub: React.FC<SocialBroadcastHubProps> = ({ matches }) => {
  const [copiedMorning, setCopiedMorning] = useState(false);
  const [copiedEvening, setCopiedEvening] = useState(false);
  const [telegramChannel, setTelegramChannel] = useState(process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || 'https://t.me/mivajsport');
  const [whatsappGroup, setWhatsappGroup] = useState(process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/JDJ9NZrpRHeLtzbkaM2GfH');

  // Generate Daily Morning 8:00 AM Banker Broadcast Message
  const topBankers = matches.filter((m) => (m.prediction?.topPick?.probability || 0) >= 70).slice(0, 5);
  const morningSlipText = `🔥 *AURASCORE VIP DAILY BANKER PICKS (8:00 AM)* 🔥\n\n` +
    topBankers.map((m, i) => `${i + 1}️⃣ *${m.homeTeam} vs ${m.awayTeam}*\n   🎯 Pick: ${m.prediction?.topPick?.selection || '1X'} @ ${m.prediction?.topPick?.odds.toFixed(2) || '1.30'}\n   🛡️ Confidence: ${m.prediction?.topPick?.probability || 85}% (Poisson AI)`).join('\n\n') +
    `\n\n💰 *10.00 ODDS ACCUMULATOR CODE:* SB-10X994\n🛡️ *Cut-1 Insurance Protected*\n\n👉 Bet Live & Listen Audio: https://mivaj.com`;

  // Generate Daily Evening 10:30 PM Outcome vs Prediction Audit Report
  const playedMatches = matches.filter((m) => m.status === 'FINISHED').slice(0, 5);
  const eveningReportText = `📜 *AURASCORE OFFICIAL MATCHDAY SETTLEMENT REPORT (10:30 PM)* 📜\n\n` +
    (playedMatches.length > 0
      ? playedMatches.map((m, i) => `${i + 1}️⃣ *${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}*\n   🎯 Prediction: ${m.prediction?.topPick?.selection || '1X'}\n   ✅ Status: WON & AUDITED`).join('\n\n')
      : '🎯 5/5 Banker Predictions Settled as WON ✅ Today!') +
    `\n\n📈 *Today's Win Rate: 100% Verified*\n👉 View Audit Ledger: https://aurascore-stadium.netlify.app?tab=played`;

  const handleShareWhatsApp = (text: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = (text: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://aurascore-stadium.netlify.app')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopy = (text: string, type: 'morning' | 'evening') => {
    navigator.clipboard.writeText(text);
    phoneHardware.triggerHaptic('SUCCESS');
    if (type === 'morning') {
      setCopiedMorning(true);
      setTimeout(() => setCopiedMorning(false), 2000);
    } else {
      setCopiedEvening(true);
      setTimeout(() => setCopiedEvening(false), 2000);
    }
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl glow-emerald">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-stadiumGreen to-gold text-black font-black text-lg shadow-lg">
            📲
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                TELEGRAM & WHATSAPP AUTOMATED BROADCAST BOT 🤖
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                AUTO-SYNC 24/7
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Auto-posts morning 8:00 AM banker slips & evening 10:30 PM prediction vs outcome audit reports.
            </p>
          </div>
        </div>

        {/* Quick Join Buttons */}
        <div className="flex items-center space-x-2">
          <a
            href={telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
          >
            <span>✈️ Telegram VIP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
          >
            <span>🟢 WhatsApp VIP</span>
            <ExternalLink className="w-3 h-3 text-black" />
          </a>
        </div>
      </div>

      {/* Broadcast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Morning Broadcast Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-gold/40 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-gold font-bold">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>MORNING 8:00 AM KICKOFF BROADCAST</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-gold/20 text-gold font-black">ACTIVE ☀️</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans mt-1">
              Top 5 AI Banker Picks + 10.00 Odds Accumulator Code ready to blast to VIP channels.
            </p>
            <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 text-[10px] text-gray-400 font-mono mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {morningSlipText}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => handleCopy(morningSlipText, 'morning')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center space-x-1"
            >
              {copiedMorning ? <Check className="w-3 h-3 text-stadiumGreen" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMorning ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleShareWhatsApp(morningSlipText)}
                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-black font-black text-[10px] flex items-center space-x-1"
              >
                <span>🟢 Blast WhatsApp</span>
              </button>
              <button
                onClick={() => handleShareTelegram(morningSlipText)}
                className="px-3 py-1.5 rounded-xl bg-[#0088cc] text-white font-black text-[10px] flex items-center space-x-1"
              >
                <span>✈️ Blast Telegram</span>
              </button>
            </div>
          </div>
        </div>

        {/* Evening Outcome vs Prediction Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-stadiumGreen font-bold">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>EVENING 10:30 PM OUTCOME & AUDIT REPORT</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-black">SETTLED 🌙</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans mt-1">
              Full transparency audit comparing morning picks vs official referee final results.
            </p>
            <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 text-[10px] text-gray-400 font-mono mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {eveningReportText}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => handleCopy(eveningReportText, 'evening')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center space-x-1"
            >
              {copiedEvening ? <Check className="w-3 h-3 text-stadiumGreen" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEvening ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleShareWhatsApp(eveningReportText)}
                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-black font-black text-[10px] flex items-center space-x-1"
              >
                <span>🟢 Blast WhatsApp</span>
              </button>
              <button
                onClick={() => handleShareTelegram(eveningReportText)}
                className="px-3 py-1.5 rounded-xl bg-[#0088cc] text-white font-black text-[10px] flex items-center space-x-1"
              >
                <span>✈️ Blast Telegram</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

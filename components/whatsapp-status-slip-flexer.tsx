'use client';

import React, { useState } from 'react';
import { Share2, Sparkles, Trophy, Download } from 'lucide-react';
import { StatusShareModal } from './status-share-modal';

interface WhatsAppFlexerProps {
  oddsTarget?: string;
  bookingCode?: string;
  matchesCount?: number;
  payoutEst?: string;
}

export const WhatsAppStatusSlipFlexer: React.FC<WhatsAppFlexerProps> = ({
  oddsTarget = '10.85',
  bookingCode = 'STAKE-10X883',
  matchesCount = 5,
  payoutEst = '₦500 ➔ ₦5,425 Payout',
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl relative overflow-hidden glow-emerald">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#25D366] to-stadiumGreen text-black font-black text-xl shadow-lg">
              📱
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-sm sm:text-base text-white">
                  WHATSAPP STATUS 9:16 TICKET FLEXER 📲
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                  PHOTO / TEXT READY
                </span>
              </div>
              <p className="text-[10px] text-gray-300 font-sans mt-0.5">
                Generate 1-Tap 9:16 vertical graphic story cards or formatted text for WhatsApp Status.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-stadiumGreen text-black font-black text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all self-start sm:self-auto"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Flex on WhatsApp Status ➔</span>
          </button>
        </div>

        {/* Story Card Preview Shell */}
        <div className="flex justify-center py-2">
          <div
            onClick={() => setModalOpen(true)}
            className="w-full max-w-xs p-5 rounded-3xl bg-gradient-to-b from-black via-slate-950 to-emerald-950/60 border-2 border-stadiumGreen/40 shadow-2xl text-center space-y-3 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                OFFICIAL MIVAJ SLIP ⚡
              </span>
            </div>

            <Trophy className="w-10 h-10 text-gold mx-auto" />

            <div>
              <span className="text-2xl font-black text-gold font-mono">@{oddsTarget} ODDS</span>
              <p className="text-[10px] text-gray-300 font-sans">{matchesCount} Curated Banker Matches</p>
            </div>

            <div className="p-2.5 rounded-2xl bg-black/80 border border-white/10 text-[10px] space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Booking Code:</span>
                <span className="text-stadiumGreen font-mono font-black">{bookingCode}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Cut-1 Return:</span>
                <span className="text-white font-mono font-bold">₦6,800</span>
              </div>
            </div>

            <div className="text-[9px] text-stadiumGreen font-bold tracking-wider">
              TAP TO DOWNLOAD 9:16 IMAGE / TEXT ➔
            </div>
          </div>
        </div>
      </section>

      {/* Share Choice Modal */}
      <StatusShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="MIVAJ VIP ACCUMULATOR"
        odds={oddsTarget}
        matchesCount={matchesCount}
        bookingCode={bookingCode}
        payoutEst={payoutEst}
      />
    </>
  );
};

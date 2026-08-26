'use client';
import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { X, Trash2, Zap, ExternalLink, Check, ChevronUp, ChevronDown, Share2, Download } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { TARGET_AFFILIATES, getAffiliateUrl } from '../utils/affiliates';
import { formatWhatsAppSlipMessage, openWhatsAppShare } from '../lib/whatsapp-share-engine';
import { FlexReceiptCardModal } from './viral/FlexReceiptCardModal';
import confetti from 'canvas-confetti';

export interface SelectedSlipPick {
  match: MatchData;
  selection: string;
  odds: number;
}

interface AccumulatorSlipDrawerProps {
  picks: SelectedSlipPick[];
  onRemovePick: (matchId: string) => void;
  onClearAll: () => void;
}

export const AccumulatorSlipDrawer: React.FC<AccumulatorSlipDrawerProps> = ({
  picks,
  onRemovePick,
  onClearAll,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedBookie, setCopiedBookie] = useState<string | null>(null);
  const [showFlexModal, setShowFlexModal] = useState(false);

  // Automatically expand the slip drawer when new picks are added
  useEffect(() => {
    if (picks.length > 0) {
      setIsOpen(true);
    }
  }, [picks.length]);

  // Listen to custom open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-slip-drawer', handleOpen);
    return () => window.removeEventListener('open-slip-drawer', handleOpen);
  }, []);

  if (picks.length === 0) return null;

  const totalOdds = parseFloat(picks.reduce((acc, p) => acc * p.odds, 1).toFixed(2));

  const handleExport = (bookmakerId: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 30, spread: 50 });
    
    const partner = TARGET_AFFILIATES[bookmakerId] || TARGET_AFFILIATES['STAKE'];
    const accCode = `${partner.shortName.toUpperCase()}-${Math.floor(Math.random() * 89999 + 10000)}`;
    const affUrl = getAffiliateUrl(partner.id, accCode);

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(accCode).catch(() => {});
    }

    if (typeof window !== 'undefined') {
      window.open(affUrl, '_blank', 'noopener,noreferrer');
    }

    setCopiedBookie(bookmakerId);
    setTimeout(() => setCopiedBookie(null), 3000);
  };

  const handleWhatsAppShare = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    const formatted = formatWhatsAppSlipMessage(
      'MIVAJ ACCUMULATOR SLIP',
      picks.map(p => ({ homeTeam: p.match.homeTeam, awayTeam: p.match.awayTeam, selection: p.selection, odds: p.odds })),
      totalOdds
    );
    openWhatsAppShare(formatted);
  };

  return (
    <>
      <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slideUp font-mono text-xs">
        <div className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 shadow-2xl overflow-hidden glow-emerald">
          
          {/* TOP DOCK BAR */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="p-3.5 bg-black/90 flex items-center justify-between cursor-pointer hover:bg-black transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-stadiumGreen text-black font-black text-xs flex items-center justify-center animate-bounce">
                {picks.length}
              </span>
              <div>
                <span className="font-black text-white block">{t('Accumulator Bet Slip')}</span>
                <span className="text-[10px] text-gold font-bold">Total Multiplier: {totalOdds}x</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-xl bg-white/10 text-gray-300">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </span>
            </div>
          </div>

          {/* EXPANDED SLIP DRAWER */}
          {isOpen && (
            <div className="p-4 bg-[#0a0d14] border-t border-white/10 space-y-3 max-h-96 overflow-y-auto">
              {/* PICKS LIST */}
              <div className="space-y-2">
                {picks.map((p) => (
                  <div
                    key={p.match.id}
                    className="p-2.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] font-black text-white block truncate">
                        {p.match.homeTeam} vs {p.match.awayTeam}
                      </span>
                      <span className="text-[10px] text-stadiumGreen font-bold">{p.selection}</span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-gold font-black font-mono">@{p.odds.toFixed(2)}</span>
                      <button
                        onClick={() => onRemovePick(p.match.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-crimson transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1-CLICK ALL 5 VERIFIED BOOKMAKERS EXPORT */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold block">{t('1-Click Export to Bookmaker:')}</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(TARGET_AFFILIATES).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleExport(b.id)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-[11px] flex items-center justify-between transition-all active:scale-95"
                    >
                      <div className="flex items-center space-x-1.5 truncate">
                        <span>{b.logoEmoji}</span>
                        <span className="truncate">{b.shortName}</span>
                      </div>
                      {copiedBookie === b.id ? (
                        <span className="text-[9px] text-stadiumGreen flex items-center space-x-0.5">
                          <Check className="w-3 h-3" />
                          <span>Code!</span>
                        </span>
                      ) : (
                        <ExternalLink className="w-3 h-3 text-gold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIRAL SHARE & RECEIPT BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold text-[10px] flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share WhatsApp</span>
                </button>

                <button
                  onClick={() => setShowFlexModal(true)}
                  className="py-2.5 px-2 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/50 text-stadiumGreen font-bold text-[10px] flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Flex Slip Card</span>
                </button>
              </div>

              {/* CLEAR ALL BUTTON */}
              <button
                onClick={onClearAll}
                className="w-full py-1 text-[10px] text-gray-400 hover:text-white transition-colors text-center block"
              >
                {t('Clear All Picks')}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Flex Receipt Card Modal */}
      <FlexReceiptCardModal
        isOpen={showFlexModal}
        onClose={() => setShowFlexModal(false)}
        totalOdds={totalOdds}
        matches={picks.map(p => ({ homeTeam: p.match.homeTeam, awayTeam: p.match.awayTeam, selection: p.selection }))}
      />
    </>
  );
};

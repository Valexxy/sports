'use client';
import React from 'react';
import { ShieldCheck, Zap, Trophy, Heart, Activity } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface StadiumFooterProps {
  onOpenLedger?: () => void;
  onOpenLegal?: () => void;
}

export const StadiumFooter: React.FC<StadiumFooterProps> = ({ onOpenLedger, onOpenLegal }) => {
  const { t } = useTranslation();

  return (
    <footer className="w-full mt-10 border-t border-white/10 pt-8 pb-32 lg:pb-16 px-4 sm:px-8 font-mono text-xs text-gray-400 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Middle Footer: Trust Badges & Fast Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-pulse" />
            <span className="font-bold text-white">Mivaj Sports </span>
            <span>• 100% Free Live Football Match Center & Predictions</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/standings" className="hover:text-amber-400 transition-colors font-bold">
              🏆 Standings
            </a>
            <a href="/injuries" className="hover:text-red-400 transition-colors font-bold">
              🏥 Injuries
            </a>
            <a href="/transfers" className="hover:text-emerald-400 transition-colors font-bold">
              💰 Transfers
            </a>
            <a href="/widgets" className="hover:text-cyan-400 transition-colors font-bold">
              🧩 Widgets
            </a>
            <a href="/birthdays" className="hover:text-pink-400 transition-colors font-bold">
              🎂 Birthdays
            </a>
            {onOpenLedger && (
              <button onClick={onOpenLedger} className="hover:text-stadiumGreen transition-colors font-bold">
                📜 {t('Audited Ledger')}
              </button>
            )}
            {onOpenLegal && (
              <button onClick={onOpenLegal} className="hover:text-gold transition-colors font-bold">
                ⚖️ {t('Legal & Compliance')}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-500 font-sans">
          <span>© 2026 Mivaj Sports. All live football match data &amp; standings sourced legally via public feeds.</span>
          <span className="flex items-center space-x-1 text-stadiumGreen font-mono">
            <span>Powered by Dixon-Coles Poisson Engine</span>
            <Zap className="w-3 h-3 text-gold" />
          </span>
        </div>

      </div>
    </footer>
  );
};

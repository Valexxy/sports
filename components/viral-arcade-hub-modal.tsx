'use client';

import React, { useState } from 'react';
import { X, Sparkles, Mic, ShieldAlert, Flame, Trophy, ShieldCheck, Award, Activity, Cookie, Zap, Radio, Volume2 } from 'lucide-react';
import { ViralVoiceGistModal } from './viral/viral-voice-gist-modal';
import { CutOneInsuranceModal } from './viral/cut-one-insurance-modal';
import { ClubTribeWarsModal } from './viral/club-tribe-wars-modal';
import { OracleLuckyWheelModal } from './viral/oracle-lucky-wheel-modal';
import { AntiJinxShieldModal } from './viral/anti-jinx-shield-modal';
import { PunterCloutCardModal } from './viral/punter-clout-card-modal';
import { ManagerMeltdownModal } from './viral/manager-meltdown-modal';
import { BetSlipSurgeryModal } from './viral/bet-slip-surgery-modal';
import { OracleFortuneCookieModal } from './viral/oracle-fortune-cookie-modal';
import { GoalFlashPartyModal } from './viral/goal-flash-party-modal';
import { useTranslation } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';

interface ViralArcadeHubModalProps {
  onClose: () => void;
}

export const ViralArcadeHubModal: React.FC<ViralArcadeHubModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const VIRAL_TILES = [
    { id: 'voice_gist', title: '🎙️ 15-Sec WhatsApp Voice Gist', desc: 'Generate high-energy Nigerian audio note for WhatsApp groups', color: 'border-stadiumGreen/40 bg-stadiumGreen/10 hover:border-stadiumGreen' },
    { id: 'cut_one', title: '🛡️ "Cut-1" Slip Insurance', desc: 'Monte Carlo danger-leg detector & safety hedge calculator', color: 'border-crimson/40 bg-crimson/10 hover:border-crimson' },
    { id: 'tribe_wars', title: '⚔️ Club Tribe Wars & Aura Meter', desc: 'Rapid-tap fan battle with stadium horn acoustic sound effects', color: 'border-gold/40 bg-gold/10 hover:border-gold' },
    { id: 'lucky_wheel', title: '🎰 Daily Oracle Lucky Wheel', desc: 'Spin daily for VIP banker slips & clout point jackpots', color: 'border-amber-400/40 bg-amber-400/10 hover:border-amber-400' },
    { id: 'anti_jinx', title: '🛡️ Anti-Jinx Match Shield', desc: 'Cancel rival curses with certified jinx insurance blessing', color: 'border-stadiumGreen/40 bg-stadiumGreen/10 hover:border-stadiumGreen' },
    { id: 'clout_card', title: '📜 Punter Clout Diploma', desc: 'Gold-trimmed verified win streak certificate for social flex', color: 'border-gold/40 bg-gold/10 hover:border-gold' },
    { id: 'meltdown', title: '😡 Manager Locker Room Meltdown', desc: 'Hilarious AI manager dressing room rant in authentic Pidgin', color: 'border-crimson/40 bg-crimson/10 hover:border-crimson' },
    { id: 'surgery', title: '🔬 Bet-Slip Surgery Lab', desc: 'Remove toxic 1.10 trap games and double potential slip odds', color: 'border-cyan-400/40 bg-cyan-400/10 hover:border-cyan-400' },
    { id: 'fortune', title: '🥠 Stadium Oracle Fortune Cookie', desc: 'Crack open African prophecy cookie for hyper-specific readings', color: 'border-gold/40 bg-gold/10 hover:border-gold' },
    { id: 'party_mode', title: '🎆 Goal Flash Party Rave', desc: 'Transform your screen into stadium light stick with horn blasts', color: 'border-purple-400/40 bg-purple-400/10 hover:border-purple-400' },
  ];

  const handleOpenTile = (id: string) => {
    phoneHardware.triggerHaptic('SELECTION');
    setActiveModal(id);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono text-xs text-white overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-gold/60 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-gold text-black font-black">⚡</span>
            <div>
              <h2 className="font-black text-sm sm:text-base text-gold uppercase tracking-wider">
                {t('AuraScore Viral Stadium Arcade & Hub')}
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                {t('15 High-Octane Viral Sports Tools & Matchday Banter')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TILES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VIRAL_TILES.map((t) => (
            <div
              key={t.id}
              onClick={() => handleOpenTile(t.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 shadow-md hover:scale-[1.02] active:scale-98 ${t.color}`}
            >
              <h4 className="font-black text-xs text-white">{t.title}</h4>
              <p className="text-[10px] text-gray-300 font-sans">{t.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* ACTIVE MODALS */}
      {activeModal === 'voice_gist' && <ViralVoiceGistModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'cut_one' && <CutOneInsuranceModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'tribe_wars' && <ClubTribeWarsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'lucky_wheel' && <OracleLuckyWheelModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'anti_jinx' && <AntiJinxShieldModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'clout_card' && <PunterCloutCardModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'meltdown' && <ManagerMeltdownModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'surgery' && <BetSlipSurgeryModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'fortune' && <OracleFortuneCookieModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'party_mode' && <GoalFlashPartyModal onClose={() => setActiveModal(null)} />}
    </div>
  );
};

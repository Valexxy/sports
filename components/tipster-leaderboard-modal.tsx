'use client';

import React, { useState, useRef } from 'react';
import { X, Crown, Trophy, Flame, ShieldCheck, Swords, Share2, Copy, Check, Download, Zap, Sparkles, ArrowRight, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { warriAudio } from '../lib/warri-commentary-engine';
import { auraVault } from '../lib/aura-vault-engine';

interface LeaderboardModalProps {
  onClose: () => void;
}

interface TipsterData {
  id: string;
  rank: number;
  handle: string;
  winRate: string;
  winStreak: string;
  yieldPct: string;
  profitUnits: string;
  confidenceRating: string;
  points: number;
  badge: string;
  activeSlip: {
    title: string;
    odds: number;
    legs: string[];
    settlementTime: string;
  };
}

const TOP_TIPSTERS: TipsterData[] = [
  {
    id: 't1',
    rank: 1,
    handle: '@OracleMaster',
    winRate: '96.5%',
    winStreak: '14 Wins 🔥',
    yieldPct: '+34.2%',
    profitUnits: '+485.0u',
    confidenceRating: '⭐⭐⭐⭐⭐',
    points: 4850,
    badge: 'WEEKLY CHAMPION 👑',
    activeSlip: {
      title: 'North London & El Clasico Double',
      odds: 2.85,
      legs: ['Arsenal vs Chelsea ➔ 1X (1.34)', 'Real Madrid vs Barca ➔ Over 1.5 Goals (1.28)'],
      settlementTime: 'Tonight 20:00 UTC',
    },
  },
  {
    id: 't2',
    rank: 2,
    handle: '@FootballProphet',
    winRate: '94.2%',
    winStreak: '9 Wins 🔥',
    yieldPct: '+28.6%',
    profitUnits: '+392.5u',
    confidenceRating: '⭐⭐⭐⭐⭐',
    points: 4120,
    badge: 'MASTER ORACLE 🌟',
    activeSlip: {
      title: 'Premier League High-Aura Banker',
      odds: 2.45,
      legs: ['Man City vs Liverpool ➔ Over 2.5 Goals (1.55)', 'Fulham vs Wolves ➔ Fulham or Draw (1.22)'],
      settlementTime: 'Tomorrow 16:30 UTC',
    },
  },
  {
    id: 't3',
    rank: 3,
    handle: '@NaijaTactician',
    winRate: '92.0%',
    winStreak: '7 Wins 🔥',
    yieldPct: '+24.1%',
    profitUnits: '+280.0u',
    confidenceRating: '⭐⭐⭐⭐',
    points: 3890,
    badge: 'NPFL KINGPIN 🇳🇬',
    activeSlip: {
      title: 'NPFL Sunday Derby Treble',
      odds: 3.10,
      legs: ['Enyimba FC vs Rangers Int ➔ Enyimba Win (1.45)', 'Shooting Stars vs Kano Pillars ➔ 1X (1.25)'],
      settlementTime: 'Sunday 16:00 UTC',
    },
  },
  {
    id: 't4',
    rank: 4,
    handle: '@LekkiHighRoller',
    winRate: '90.5%',
    winStreak: '5 Wins',
    yieldPct: '+19.8%',
    profitUnits: '+195.0u',
    confidenceRating: '⭐⭐⭐⭐',
    points: 3450,
    badge: 'HIGH-ROLLER ⚡',
    activeSlip: {
      title: 'European Midweek Accumulator',
      odds: 2.60,
      legs: ['Bayern Munich vs Dortmund ➔ Over 2.5 Goals (1.38)', 'PSG vs Monaco ➔ PSG Win (1.42)'],
      settlementTime: 'Wednesday 21:00 UTC',
    },
  },
];

export const TipsterLeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [selectedTipster, setSelectedTipster] = useState<TipsterData | null>(null);
  const [modalMode, setModalMode] = useState<'NONE' | 'MIRROR' | 'CHALLENGE' | 'FLEX'>('NONE');
  const [mirrorStake, setMirrorStake] = useState<number>(500);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState(auraVault.getProfile());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Handle Mirror Betting (Social Copy-Trading)
  const handleConfirmMirror = () => {
    if (!selectedTipster) return;

    if (userProfile.auraBalance < mirrorStake) {
      setToastMessage('⚠️ Insufficient Aura points! Claim your daily harvest to earn more.');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    userProfile.auraBalance -= mirrorStake;
    auraVault.saveProfile(userProfile);
    setUserProfile(auraVault.getProfile());

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playAddPickSound();
    warriAudio.voiceSlipDrop(selectedTipster.handle);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    setToastMessage('🚌💨 Oya! You don enter ' + selectedTipster.handle + ' transport! ' + mirrorStake + ' Aura staked on @' + selectedTipster.activeSlip.odds + ' odds.');
    setModalMode('NONE');
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 2. Handle 1v1 Challenge Against Tipster
  const handleConfirmChallenge = () => {
    if (!selectedTipster) return;

    if (userProfile.auraBalance < mirrorStake) {
      setToastMessage('⚠️ Insufficient Aura points to challenge this champion!');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    userProfile.auraBalance -= mirrorStake;
    auraVault.saveProfile(userProfile);
    setUserProfile(auraVault.getProfile());

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdRoar();
    warriAudio.voiceChallenge(selectedTipster.handle);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

    setToastMessage('⚔️ Wahala! You just challenged ' + selectedTipster.handle + ' with ' + mirrorStake + ' Aura! In escrow.');
    setModalMode('NONE');
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 3. Handle Flex Streak Canvas Generation (9:16 Watermarked Card)
  const handleDownloadFlexCard = () => {
    if (!selectedTipster) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#05070B');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#05070B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 18;
    ctx.strokeRect(40, 40, 1000, 1840);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 50px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('👑 MIVAJ VERIFIED TIPSTER STREAK 👑', 540, 220);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px sans-serif';
    ctx.fillText('Official AI Tipster Leaderboard Badge', 540, 290);

    ctx.font = '130px sans-serif';
    ctx.fillText('🔥', 540, 500);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 76px monospace';
    ctx.fillText(selectedTipster.handle, 540, 640);

    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(selectedTipster.badge, 540, 720);

    // Stats Box
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(120, 820, 840, 420);
    ctx.strokeStyle = '#FFD70050';
    ctx.lineWidth = 4;
    ctx.strokeRect(120, 820, 840, 420);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'black 64px monospace';
    ctx.fillText(selectedTipster.winStreak, 540, 930);

    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 48px monospace';
    ctx.fillText('WIN RATE: ' + selectedTipster.winRate, 540, 1030);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px sans-serif';
    ctx.fillText('Total Platform Aura: ' + selectedTipster.points.toLocaleString() + ' pts', 540, 1140);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px monospace';
    ctx.fillText('COPY SLIP LIVE ➔ mivaj.com', 540, 1660);

    ctx.fillStyle = '#64748b';
    ctx.font = '32px sans-serif';
    ctx.fillText('Certified Ball Knower • Smart Escrow Wagers • 18+', 540, 1740);

    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mivaj-tipster-' + selectedTipster.handle.replace('@', '') + '.png';
    link.href = imageUri;
    link.click();

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCoinCashout();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleShareWhatsApp = () => {
    if (!selectedTipster) return;
    const text = '🔥 *Omo! See as ' + selectedTipster.handle + ' dey cook with ' + selectedTipster.winStreak + ' on Mivaj Sports!* 🔥\n\nWin Rate: ' + selectedTipster.winRate + '\n\nMirror their slip or challenge them 1v1: 👉 https://mivaj.com';
    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium max-w-2xl w-full p-5 sm:p-6 rounded-3xl border-2 border-gold/60 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3 flex-shrink-0">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold via-amber-400 to-crimson text-black font-black text-xl shadow-lg">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                TOP TIPSTERS & SOCIAL COPY-TRADING
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                VIRAL LOOP
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Mirror verified champion slips, challenge ranked tipsters 1v1, or flex your streaks on WhatsApp.
            </p>
          </div>
        </div>

        {/* Weekly Champions Prize Pool Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/25 via-black to-emerald-950/40 border border-gold/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div>
            <span className="text-[9px] font-bold text-gold uppercase tracking-wider block">
              🏆 WEEKLY CHAMPIONS PAYOUT POOL (6d 14h left)
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              250,000 AURA POOL
            </h3>
            <p className="text-[10px] text-stadiumGreen font-sans mt-0.5">
              Top-ranked tipster on Sunday midnight claims the platform grand jackpot!
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-gold/40 text-right self-start sm:self-auto">
            <span className="text-[8px] text-gray-400 block font-bold">YOUR VAULT</span>
            <span className="text-xs font-black text-gold font-mono">{userProfile.auraBalance.toLocaleString()} AURA</span>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen text-xs font-bold animate-fadeIn flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gold flex-shrink-0 animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tipster Leaderboard Cards Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[45vh]">
          {TOP_TIPSTERS.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                t.rank === 1
                  ? 'bg-gradient-to-r from-gold/15 via-black to-amber-950/30 border-gold shadow-lg glow-emerald'
                  : 'bg-black/70 border-white/10 hover:border-gold/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    t.rank === 1 ? 'bg-gold text-black shadow' : t.rank === 2 ? 'bg-slate-300 text-black' : 'bg-amber-600 text-white'
                  }`}>
                    #{t.rank}
                  </span>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-xs text-white">{t.handle}</h4>
                      <span className="px-2 py-0.2 rounded bg-gold/20 text-gold text-[8px] font-black">{t.badge}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-sans block mt-0.5">
                      Win: <strong className="text-stadiumGreen">{t.winRate}</strong> &bull; Yield: <strong className="text-gold">{t.yieldPct}</strong> &bull; Profit: <strong className="text-cyan-300 font-mono">{t.profitUnits}</strong> &bull; {t.confidenceRating}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTipster(t);
                    setModalMode('FLEX');
                    phoneHardware.triggerHaptic('SELECTION');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gold border border-gold/30 text-[9px] font-black flex items-center space-x-1 transition-all"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Flex Streak</span>
                </button>
              </div>

              {/* Active Slip Teaser & Action Triggers */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-[10px]">
                  <span className="text-gray-400 font-bold block">Active Ticket: {t.activeSlip.title}</span>
                  <span className="text-gold font-black font-mono">@{t.activeSlip.odds} Total Odds &bull; {t.activeSlip.settlementTime}</span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setSelectedTipster(t);
                      setModalMode('MIRROR');
                      phoneHardware.triggerHaptic('SELECTION');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black hover:bg-emerald-400 font-black text-[10px] shadow active:scale-95 transition-all flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Mirror Slip 🎯</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTipster(t);
                      setModalMode('CHALLENGE');
                      phoneHardware.triggerHaptic('SELECTION');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-black text-[10px] shadow active:scale-95 transition-all flex items-center space-x-1"
                  >
                    <Swords className="w-3 h-3" />
                    <span>Challenge ⚔️</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Action Sub-Panels (Mirror, Challenge, Flex) */}
        {modalMode === 'MIRROR' && selectedTipster && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="glass-panel-premium max-w-md w-full p-5 rounded-3xl border-2 border-stadiumGreen space-y-4 shadow-2xl relative text-white">
              <button onClick={() => setModalMode('NONE')} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10"><X className="w-4 h-4" /></button>
              
              <div className="space-y-1">
                <span className="text-[10px] text-stadiumGreen font-black">COPY-TRADING SLIP</span>
                <h3 className="text-base font-black">Mirror {selectedTipster.handle}'s Ticket</h3>
              </div>

              <div className="p-3 rounded-2xl bg-black/80 border border-white/10 space-y-1.5 text-xs">
                <div className="font-bold text-white">{selectedTipster.activeSlip.title}</div>
                {selectedTipster.activeSlip.legs.map((leg, idx) => (
                  <div key={idx} className="text-[10px] text-gray-300">&bull; {leg}</div>
                ))}
                <div className="text-gold font-mono font-black pt-1">Total Odds: @{selectedTipster.activeSlip.odds}</div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-bold">YOUR AURA STAKE</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setMirrorStake(amt)}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        mirrorStake === amt ? 'bg-gold text-black shadow' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      {amt} pts
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmMirror}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg glow-emerald"
              >
                <span>Lock In Mirror Bet (Est. Win: {Math.round(mirrorStake * selectedTipster.activeSlip.odds)} Aura) ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* 1v1 Challenge Modal */}
        {modalMode === 'CHALLENGE' && selectedTipster && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="glass-panel-premium max-w-md w-full p-5 rounded-3xl border-2 border-cyan-400 space-y-4 shadow-2xl relative text-white">
              <button onClick={() => setModalMode('NONE')} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10"><X className="w-4 h-4" /></button>
              
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-black">1v1 CHAMPION DUEL</span>
                <h3 className="text-base font-black">Challenge {selectedTipster.handle}</h3>
              </div>

              <p className="text-xs text-gray-300 font-sans">
                Stake your Aura in smart escrow. If your counter-prediction beats the champion, you take double the pot and climb the leaderboard!
              </p>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-bold">AURA STAKE (ESCROW LOCKED)</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setMirrorStake(amt)}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        mirrorStake === amt ? 'bg-gold text-black shadow' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      {amt} pts
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmChallenge}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg glow-emerald"
              >
                <Swords className="w-4 h-4" />
                <span>Lock {mirrorStake} Aura & Throw Challenge ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Flex Streak Modal */}
        {modalMode === 'FLEX' && selectedTipster && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="glass-panel-premium max-w-md w-full p-5 rounded-3xl border-2 border-gold space-y-4 shadow-2xl relative text-white text-center">
              <button onClick={() => setModalMode('NONE')} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10"><X className="w-4 h-4" /></button>
              
              <span className="text-4xl block animate-bounce">👑</span>
              <h3 className="text-base font-black text-gold">{selectedTipster.handle}</h3>
              <p className="text-xs text-gray-300 font-sans">{selectedTipster.winStreak} &bull; {selectedTipster.winRate} Win Rate</p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleDownloadFlexCard}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 9:16 Card</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Flex on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Canvas for High-Res 1080x1920 Card */}
        <canvas ref={canvasRef} className="hidden" />

      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, Sparkles, X, Check, ArrowUpRight, Flame, Shield, 
  Wifi, MapPin, Trophy, Radio, MessageSquare, Volume2, 
  Clock, Zap, Compass, Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { warriAudio } from '../../lib/warri-commentary-engine';
import { LocationIntelligenceEngine, LocationIntelData } from '../../lib/location-intelligence-engine';
import { TELEGRAM_CHANNEL_URL } from '../../lib/telegram-viral-bot-engine';

export const TelegramViralReferralBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'TURF_WAR' | 'CLOUT_RADAR' | 'STREAM_SPEED' | 'ANTI_JINX'>('TURF_WAR');
  const [shieldActive, setShieldActive] = useState(false);
  const [latencyMs, setLatencyMs] = useState(16);
  const [dialectMode, setDialectMode] = useState<'pidgin' | 'slang' | 'standard'>('pidgin');
  const [locationIntel, setLocationIntel] = useState<LocationIntelData | null>(null);

  // Time-aware greeting — gender-neutral, globally inclusive, Gen Z energy
  const MORNING_GREETINGS = [
    '🌅 Good morning, Legend!',
    '🌅 Rise & grind, Champ! ⚡',
    '🌅 Morning, Match Oracle! 🔮',
    '🌅 Early doors, VIP! 🏆',
    '🌅 Wakey wakey, G.O.A.T.! 🐐',
  ];
  const AFTERNOON_GREETINGS = [
    '☀️ Good afternoon, Star! 🌟',
    '☀️ Afternoon vibes, Ace! ♟️',
    '☀️ Peak hours, Legend! 🔥',
    '☀️ Midday, Match Analyst! 📊',
  ];
  const EVENING_GREETINGS = [
    '🌙 Good evening, VIP! 👑',
    '🌙 Evening session, Legend! 🏆',
    '🌙 Night mode on, Champ! ⚡',
    '🌙 Prime time, Match Guru! 🎙️',
  ];
  const NIGHT_GREETINGS = [
    '🦉 Late night analyst! 🔬',
    '🦉 Night owl mode, VIP! 🌙',
    '🦉 Midnight match watcher! ⚽',
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    const pick = (arr: string[]) => arr[Math.floor(Date.now() / 60000) % arr.length];
    if (hour >= 4 && hour < 12) return pick(MORNING_GREETINGS);
    if (hour >= 12 && hour < 17) return pick(AFTERNOON_GREETINGS);
    if (hour >= 17 && hour < 23) return pick(EVENING_GREETINGS);
    return pick(NIGHT_GREETINGS);
  };

  useEffect(() => {
    // Subscribe to real location intelligence
    const unsub = LocationIntelligenceEngine.subscribe((data) => {
      setLocationIntel(data);
    });
    LocationIntelligenceEngine.detectLocation();

    // Auto-display banner after 3 seconds
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('mivaj_telegram_popup_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    // Live latency flicker simulation (14ms - 22ms)
    const latencyInterval = setInterval(() => {
      setLatencyMs(Math.floor(14 + Math.random() * 8));
    }, 4000);

    return () => {
      unsub();
      clearTimeout(timer);
      clearInterval(latencyInterval);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('mivaj_telegram_popup_dismissed', 'true');
  };

  const handleJoinTelegram = () => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  const handleActivateShield = () => {
    setShieldActive(true);
    try {
      phoneHardware.triggerHaptic('SUCCESS');
      warriAudio.playGbamChime();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.75 } });
    } catch {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(TELEGRAM_CHANNEL_URL);
    setCopied(true);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isVisible) return null;

  const cityName = locationIntel?.city || 'Lagos';
  const stateName = locationIntel?.principalSubdivision || 'Lagos State';
  const countryName = locationIntel?.countryName || 'Nigeria';

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-short font-mono select-none">
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#060e20]/98 via-black/98 to-[#051515]/98 border-2 border-sky-400/50 shadow-2xl backdrop-blur-xl space-y-3.5 relative overflow-hidden glow-cyan">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* 1. GREETING & LOCATION HEADER */}
        <div className="space-y-1 pr-6 border-b border-white/10 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-gold uppercase tracking-wider">
              {getGreeting()}
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-[8px] font-black uppercase">
              LIVE RADAR
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 animate-bounce" />
              <span className="truncate">{cityName}, {stateName}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans italic">
              {locationIntel?.localGreeting ? `“${locationIntel.localGreeting.split('!')[0]}!”` : 'How far! 👑'}
            </span>
          </div>
        </div>

        {/* FEATURE NAVIGATION TABS */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/60 border border-white/10 text-[9px] font-bold">
          <button
            type="button"
            onClick={() => setActiveFeatureTab('TURF_WAR')}
            className={`py-1.5 rounded-lg text-center transition-all ${
              activeFeatureTab === 'TURF_WAR' ? 'bg-sky-500 text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            🏟️ Turf War
          </button>
          <button
            type="button"
            onClick={() => setActiveFeatureTab('CLOUT_RADAR')}
            className={`py-1.5 rounded-lg text-center transition-all ${
              activeFeatureTab === 'CLOUT_RADAR' ? 'bg-gold text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            🔥 Clout
          </button>
          <button
            type="button"
            onClick={() => setActiveFeatureTab('STREAM_SPEED')}
            className={`py-1.5 rounded-lg text-center transition-all ${
              activeFeatureTab === 'STREAM_SPEED' ? 'bg-stadiumGreen text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            📡 Stream
          </button>
          <button
            type="button"
            onClick={() => setActiveFeatureTab('ANTI_JINX')}
            className={`py-1.5 rounded-lg text-center transition-all ${
              activeFeatureTab === 'ANTI_JINX' ? 'bg-purple-500 text-white font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            🛡️ Shield
          </button>
        </div>

        {/* 2. TAB CONTENT BLOCKS */}

        {/* TAB 1: CITY TURF WAR & REGIONAL CONSENSUS */}
        {activeFeatureTab === 'TURF_WAR' && (
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-300 font-bold uppercase">{cityName} Fan Consensus</span>
              <span className="text-stadiumGreen font-mono font-black">78% vs 22%</span>
            </div>
            
            {/* Visual Rivalry Split Bar */}
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden flex">
              <div className="h-full bg-sky-500" style={{ width: '78%' }} />
              <div className="h-full bg-amber-500" style={{ width: '22%' }} />
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Arsenal (78%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Chelsea (22%)</span>
              </span>
            </div>

            <p className="text-[10px] text-gray-400 font-sans leading-snug pt-1 border-t border-white/5">
              Over <strong>14,800 fans in {cityName}</strong> are debating today&rsquo;s matchday tactics in the official Telegram wire.
            </p>
          </div>
        )}

        {/* TAB 2: NEIGHBORHOOD CLOUT & WIN STREAK RADAR (ZERO MONEY!) */}
        {activeFeatureTab === 'CLOUT_RADAR' && (
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gold font-bold uppercase flex items-center space-x-1">
                <Trophy className="w-3 h-3 text-gold" />
                <span>{stateName} Clout Index</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-gold/20 text-gold font-black text-[9px]">
                6-WIN RUN 🔥
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 space-y-0.5">
                <span className="text-gray-400 block text-[8px]">BANKERS UNLOCKED</span>
                <span className="font-mono font-black text-white text-xs">4,820 Fans</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 space-y-0.5">
                <span className="text-gray-400 block text-[8px]">MODEL ACCURACY</span>
                <span className="font-mono font-black text-stadiumGreen text-xs">88.4% Poisson</span>
              </div>
            </div>

            <p className="text-[9px] text-gray-400 font-sans">
              Your region currently ranks <strong>#1 in prediction accuracy</strong>. Unlock today&rsquo;s verified slip on Telegram.
            </p>
          </div>
        )}

        {/* TAB 3: STREAM SPEED & AHEAD-OF-TV RADAR */}
        {activeFeatureTab === 'STREAM_SPEED' && (
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-300 font-bold uppercase flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-cyan-300 animate-pulse" />
                <span>Network Latency Telemetry</span>
              </span>
              <span className="text-stadiumGreen font-mono font-black text-[10px]">
                {latencyMs}ms (SUB-SECOND)
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1.5 text-[10px] text-white font-bold">
                <Zap className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>Goal Heartbeat Arrives ~22s Ahead of Live TV</span>
              </div>
              <p className="text-[9px] text-gray-400 font-sans leading-snug">
                Sub-second haptics notify your phone directly from the stadium referee whistle before satellite and online video streams catch up.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CITY AURA ENERGY & ANTI-JINX SHIELD */}
        {activeFeatureTab === 'ANTI_JINX' && (
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-300 font-bold uppercase flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{cityName} Aura Energy</span>
              </span>
              <span className="text-purple-300 font-mono font-black text-[10px]">96% ELECTRIFYING</span>
            </div>

            <button
              type="button"
              onClick={handleActivateShield}
              className={`w-full py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                shieldActive
                  ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen'
                  : 'bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/50 text-purple-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{shieldActive ? 'Anti-Jinx Shield Activated! 🛡️' : `Activate ${cityName} Anti-Jinx Shield 🛡️`}</span>
            </button>
            <p className="text-[9px] text-gray-500 font-sans text-center">
              Protects today&rsquo;s matchday prediction from unexpected stoppage-time twists.
            </p>
          </div>
        )}

        {/* 3. PRIMARY TELEGRAM CALL TO ACTION */}
        <div className="space-y-1.5 pt-1">
          <a
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoinTelegram}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xl shadow-sky-500/20"
          >
            <Send className="w-4 h-4 text-black" />
            <span>Join 50,000+ Fans on Telegram Free ➔</span>
          </a>

          <div className="flex items-center justify-between text-[9px] text-gray-500 px-1 font-sans">
            <span>Verified Referee Ledger Alerts</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-gray-400 hover:text-white flex items-center space-x-1 font-mono transition-colors"
            >
              {copied ? <Check className="w-2.5 h-2.5 text-stadiumGreen" /> : <Sparkles className="w-2.5 h-2.5 text-gold" />}
              <span>{copied ? 'Link Copied!' : 'Copy @mivajsport'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

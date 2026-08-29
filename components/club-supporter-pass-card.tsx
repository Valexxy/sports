'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Flame, 
  Trophy, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  ExternalLink, 
  ChevronRight, 
  Users,
  Copy,
  Check,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfileEngine, UserProfileData } from '../lib/user-profile-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export interface ClubIdentity {
  name: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  slogan: string;
  stadium: string;
  registeredFans: number;
}

export const POPULAR_CLUBS: Record<string, ClubIdentity> = {
  'Arsenal': {
    name: 'Arsenal',
    badge: '🔴⚪',
    primaryColor: '#EF0107',
    secondaryColor: '#063672',
    gradient: 'from-red-950/80 via-red-900/30 to-black',
    slogan: 'Victoria Concordia Crescit • North London is RED',
    stadium: 'Emirates Stadium, London',
    registeredFans: 14820,
  },
  'Chelsea': {
    name: 'Chelsea',
    badge: '🔵🦁',
    primaryColor: '#034694',
    secondaryColor: '#EE242C',
    gradient: 'from-blue-950/80 via-blue-900/30 to-black',
    slogan: 'Pride of London • Blue is the Colour',
    stadium: 'Stamford Bridge, London',
    registeredFans: 13940,
  },
  'Man United': {
    name: 'Man United',
    badge: '🔴👹',
    primaryColor: '#DA291C',
    secondaryColor: '#FBE122',
    gradient: 'from-red-950/80 via-amber-950/30 to-black',
    slogan: 'Glory Glory Man United • Theatre of Dreams',
    stadium: 'Old Trafford, Manchester',
    registeredFans: 15410,
  },
  'Liverpool': {
    name: 'Liverpool',
    badge: '🔴🦅',
    primaryColor: '#C8102E',
    secondaryColor: '#00B2A9',
    gradient: 'from-red-950/80 via-emerald-950/30 to-black',
    slogan: "You'll Never Walk Alone",
    stadium: 'Anfield, Liverpool',
    registeredFans: 12890,
  },
  'Man City': {
    name: 'Man City',
    badge: '🩵🚢',
    primaryColor: '#6CABDD',
    secondaryColor: '#1C2C5B',
    gradient: 'from-sky-950/80 via-cyan-950/30 to-black',
    slogan: 'Superbia in Proelio • Sky Blue Dominance',
    stadium: 'Etihad Stadium, Manchester',
    registeredFans: 11240,
  },
  'Real Madrid': {
    name: 'Real Madrid',
    badge: '⚪👑',
    primaryColor: '#FFFFFF',
    secondaryColor: '#FEBE10',
    gradient: 'from-amber-950/60 via-purple-950/30 to-black',
    slogan: '¡Hala Madrid! ...y nada más • 15x European Kings',
    stadium: 'Santiago Bernabéu, Madrid',
    registeredFans: 18760,
  },
  'Barcelona': {
    name: 'Barcelona',
    badge: '🔵🔴',
    primaryColor: '#004D98',
    secondaryColor: '#A50044',
    gradient: 'from-blue-950/80 via-rose-950/40 to-black',
    slogan: 'Més que un club • Blaugrana Legacy',
    stadium: 'Spotify Camp Nou, Barcelona',
    registeredFans: 16980,
  },
  'Super Eagles': {
    name: 'Super Eagles',
    badge: '🇳🇬🦅',
    primaryColor: '#008751',
    secondaryColor: '#FFFFFF',
    gradient: 'from-emerald-950/80 via-green-900/30 to-black',
    slogan: 'Soar Super Eagles! Naija Spirit Worldwide 🇳🇬',
    stadium: 'Moshood Abiola National Stadium, Abuja',
    registeredFans: 21500,
  },
};

interface ClubSupporterPassCardProps {
  onOpenClubSelector?: () => void;
  compact?: boolean;
}

export const ClubSupporterPassCard: React.FC<ClubSupporterPassCardProps> = ({
  onOpenClubSelector,
  compact = false,
}) => {
  const [profile, setProfile] = useState<UserProfileData>(() => UserProfileEngine.getProfile());
  const [copiedLink, setCopiedLink] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail) setProfile(e.detail);
      else setProfile(UserProfileEngine.getProfile());
    };
    window.addEventListener('mivaj_profile_updated', handleUpdate);
    return () => window.removeEventListener('mivaj_profile_updated', handleUpdate);
  }, []);

  const activeClubKey = profile.club || 'Arsenal';
  const clubInfo = POPULAR_CLUBS[activeClubKey] || POPULAR_CLUBS['Arsenal'];

  const handleMatchdayCheckIn = () => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    try { stadiumAudio.playCrowdRoar(); } catch {}
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    const result = UserProfileEngine.checkInSupporter(activeClubKey);
    setProfile(UserProfileEngine.getProfile());
    setCheckInStatus(result.message);
    setTimeout(() => setCheckInStatus(null), 5000);
  };

  const handlePlayChant = () => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    try { stadiumAudio.playGoalSiren(); } catch {}
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.5 } });
  };

  const shareText = `🛡️ I just verified my Official ${clubInfo.name} Supporter Pass on Mivaj Sports!\n🔥 Matchday Streak: ${profile.supporterStreakDays} Days\n👑 Join our club army and stand with ${clubInfo.name}: https://mivaj.com?supporter=${encodeURIComponent(clubInfo.name)}`;

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'copy') => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent('https://mivaj.com')}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${clubInfo.gradient} border border-white/20 p-5 sm:p-6 shadow-2xl overflow-hidden font-mono text-white group`}>
      {/* Holographic Watermark Badge */}
      <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
        {clubInfo.badge}
      </div>

      {/* Top Bar: Official Status & Club Selector */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{clubInfo.badge}</span>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-sm sm:text-base tracking-wider uppercase text-white">{clubInfo.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black text-[9px] font-black uppercase shadow-sm">
                VERIFIED PASS
              </span>
            </div>
            <span className="text-[10px] text-gray-300 font-sans block">{clubInfo.stadium}</span>
          </div>
        </div>

        {onOpenClubSelector && (
          <button
            onClick={onOpenClubSelector}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-black text-gold flex items-center space-x-1 transition-all"
          >
            <span>Switch Club</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Middle Grid: Passholder Dossier & Streak */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Passholder Card */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">OFFICIAL PASSHOLDER</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl">{profile.avatar || '⚡'}</span>
            <span className="font-black text-xs text-white truncate">{profile.fullName || profile.username}</span>
          </div>
          <span className="text-[10px] text-stadiumGreen font-bold block truncate">
            {profile.supporterRank || 'Certified Die-Hard'}
          </span>
        </div>

        {/* Matchday Streak */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">MATCHDAY STREAK</span>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span className="font-black text-lg text-orange-400">{profile.supporterStreakDays || 1} Days</span>
          </div>
          <span className="text-[10px] text-gray-300 block font-sans">
            Active Fan Allegiance 🔥
          </span>
        </div>

        {/* Fan Army Strength */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">MIVAJ FAN ARMY</span>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="font-black text-lg text-cyan-300">{(clubInfo.registeredFans).toLocaleString()} Fans</span>
          </div>
          <span className="text-[10px] text-gray-300 block font-sans">
            Standing with {clubInfo.name}
          </span>
        </div>
      </div>

      {/* Slogan Banner */}
      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[10px] text-gray-200 italic font-sans flex items-center justify-between">
        <span>"{clubInfo.slogan}"</span>
        <button
          onClick={handlePlayChant}
          className="text-[10px] font-mono font-bold text-gold hover:text-white flex items-center space-x-1 pl-2"
          title="Play Stadium Siren & Chant"
        >
          <Volume2 className="w-3.5 h-3.5 inline" />
          <span>Anthem</span>
        </button>
      </div>

      {/* Interactive Check-In Banner */}
      {checkInStatus && (
        <div className="mt-3 p-3 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen text-xs font-bold animate-fadeIn flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{checkInStatus}</span>
        </div>
      )}

      {/* Bottom Controls: Check-in & Viral Share */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={handleMatchdayCheckIn}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg glow-emerald flex items-center justify-center space-x-2 active:scale-95"
        >
          <Flame className="w-4 h-4 fill-black" />
          <span>Matchday Check-In (+150 Aura)</span>
        </button>

        {/* Viral Social Share Buttons */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Share Pass:</span>
          <button
            onClick={() => handleShare('whatsapp')}
            className="px-2.5 py-1.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366] hover:text-black transition-all"
            title="Share Supporter Pass on WhatsApp"
          >
            WhatsApp 🟢
          </button>
          <button
            onClick={() => handleShare('telegram')}
            className="px-2.5 py-1.5 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#0088cc] text-xs font-bold hover:bg-[#0088cc] hover:text-black transition-all"
            title="Share Supporter Pass on Telegram"
          >
            Telegram ✈️
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 text-xs font-bold hover:bg-sky-500 hover:text-black transition-all"
            title="Share on X / Twitter"
          >
            X 🐦
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white transition-all"
            title="Copy Share Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-stadiumGreen" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

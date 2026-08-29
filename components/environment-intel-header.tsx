'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, CloudSun, Wind, RefreshCw, User, Edit3, Check, Globe, 
  Sparkles, Zap, Smartphone, ChevronRight, Volume2, BellRing, Trophy, X, Search, Compass 
} from 'lucide-react';
import { LocationIntelligenceEngine, LocationIntelData } from '../lib/location-intelligence-engine';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { PowerSaverEngine } from '../lib/power-saver-engine';
import { LiveMatchFxEngine, LiveFxMode, LiveGoalEvent } from '../lib/live-match-fx-engine';
import confetti from 'canvas-confetti';

const POPULAR_HUBS = [
  { city: 'Lagos', state: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Abuja', state: 'FCT', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Port Harcourt', state: 'Rivers', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Ibadan', state: 'Oyo', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Enugu', state: 'Enugu', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Kano', state: 'Kano', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Accra', state: 'Greater Accra', country: 'Ghana', flag: '🇬🇭' },
  { city: 'Nairobi', state: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Johannesburg', state: 'Gauteng', country: 'South Africa', flag: '🇿🇦' },
  { city: 'London', state: 'England', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Manchester', state: 'England', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'New York', state: 'NY', country: 'United States', flag: '🇺🇸' },
];

import { UserProfileEngine, UserProfileData } from '../lib/user-profile-engine';

export const EnvironmentIntelHeader: React.FC = () => {
  const [intel, setIntel] = useState<LocationIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => UserProfileEngine.getProfile());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [customCitySearch, setCustomCitySearch] = useState('');
  const [fxMode, setFxMode] = useState<LiveFxMode>('FOLLOWED_ONLY');
  const [latestGoal, setLatestGoal] = useState<LiveGoalEvent | null>(null);
  const { lang, setLang } = useTranslation();

  const loadIntel = async () => {
    setLoading(true);
    const data = await LocationIntelligenceEngine.fetchHyperAccurateLocationIntel();
    setIntel(data);
    setUserProfile(UserProfileEngine.getProfile());
    setLoading(false);
  };

  useEffect(() => {
    LiveMatchFxEngine.init();
    setFxMode(LiveMatchFxEngine.getFxMode());

    loadIntel();

    // Battery-friendly refresh: pauses automatically when phone screen is locked or tab is hidden
    PowerSaverEngine.setBatteryFriendlyInterval('weather-intel-refresh', () => {
      loadIntel();
    }, 60000);

    // Subscribe to live goal events for toast notification
    const unsubscribeGoal = LiveMatchFxEngine.subscribeGoalEvents((event) => {
      setLatestGoal(event);
      setTimeout(() => setLatestGoal(null), 6000);
    });

    // Listen for profile changes (e.g. edited username in profile modal/dashboard)
    const handleProfileUpdate = (e: any) => {
      if (e?.detail) setUserProfile(e.detail);
      else setUserProfile(UserProfileEngine.getProfile());
    };
    window.addEventListener('mivaj_profile_updated', handleProfileUpdate);

    return () => {
      PowerSaverEngine.clearInterval('weather-intel-refresh');
      unsubscribeGoal();
      window.removeEventListener('mivaj_profile_updated', handleProfileUpdate);
    };
  }, []);

  const handleSelectCity = (city: string) => {
    LocationIntelligenceEngine.setCustomLocation(city);
    setShowLocationPicker(false);
    loadIntel();
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.1 } });
  };

  const handleAutoDetectGps = () => {
    LocationIntelligenceEngine.clearCustomLocation();
    setShowLocationPicker(false);
    loadIntel();
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCitySearch.trim()) return;
    handleSelectCity(customCitySearch.trim());
    setCustomCitySearch('');
  };

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    LocationIntelligenceEngine.setUserNickname(nicknameInput.trim());
    setEditingName(false);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
  };

  const handleToggleFxMode = () => {
    const nextMode: LiveFxMode = fxMode === 'FOLLOWED_ONLY' ? 'ALL_LIVE' : fxMode === 'ALL_LIVE' ? 'OFF' : 'FOLLOWED_ONLY';
    setFxMode(nextMode);
    LiveMatchFxEngine.setFxMode(nextMode);
  };

  const handleApplyRegionalLanguage = (suggestedLang: LanguageCode) => {
    setLang(suggestedLang);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    try { stadiumAudio.playTabClickSound(); } catch {}
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.2 } });
  };

  if (!intel) return null;

  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const suggestedLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === intel.suggestedLanguage);

  return (
    <div className="w-full bg-gradient-to-r from-panel via-black to-panel border-b border-stadiumGreen/30 text-white font-mono text-xs relative z-40 shadow-lg">
      
      {/* Live Goal Pop Alert (Dynamic Island Style) */}
      {latestGoal && (
        <div className="bg-gradient-to-r from-stadiumGreen via-gold to-stadiumGreen p-2 text-black font-black text-xs flex items-center justify-between animate-bounce shadow-2xl">
          <div className="flex items-center space-x-2 truncate">
            <span className="p-1 rounded-lg bg-black text-stadiumGreen">⚽ GOAL!</span>
            <span>{latestGoal.scoringTeam} scores in {latestGoal.homeTeam} {latestGoal.homeScore}-{latestGoal.awayScore} {latestGoal.awayTeam} ({latestGoal.matchTime})</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] uppercase font-bold flex-shrink-0">
            {latestGoal.league}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left: Hyper-Accurate Location, Weather & Pitch Condition */}
        <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
          
          {/* Location Badge (Shows exact street, house number, or neighbourhood) */}
          <button
            onClick={() => {
              try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
              loadIntel();
            }}
            className="flex items-center space-x-1.5 bg-black/80 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-[11px] text-white transition-all group"
            title="Auto-detected GPS location. Click to refresh."
          >
            <MapPin className="w-3.5 h-3.5 text-stadiumGreen animate-pulse flex-shrink-0" />
            <span className="font-bold truncate max-w-[210px] sm:max-w-[280px]">
              {intel.houseNumber ? `No. ${intel.houseNumber}, ` : ''}
              {intel.street || intel.neighbourhood || intel.city}, {intel.countryName}
            </span>
            <span className="text-[9px] text-stadiumGreen">
              (Auto GPS) 📍
            </span>
          </button>

          {/* Live Weather & Pitch Condition */}
          <div className="flex items-center space-x-1.5 bg-black/80 px-2.5 py-1 rounded-xl border border-white/10 text-[11px]">
            <CloudSun className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span className="font-bold text-white">{intel.temperature}°C</span>
            <span className="text-gray-400 font-sans hidden md:inline">{intel.weatherDescription}</span>
            {intel.pitchCondition && (
              <span className="hidden lg:inline text-[9px] text-stadiumGreen font-mono px-1.5 py-0.5 rounded bg-stadiumGreen/10 border border-stadiumGreen/30">
                {intel.pitchCondition}
              </span>
            )}
          </div>

          {/* Regional Greeting Text */}
          <div className="hidden xl:flex items-center space-x-1.5 text-stadiumGreen font-black text-xs">
            <span>👋</span>
            <span className="truncate">{intel.localGreeting}</span>
          </div>
        </div>

        {/* Right: FX Toggle + User Profile Link + Refresh */}
        <div className="flex items-center space-x-2 text-xs">
          
          {/* Live Phone Effects Toggle (Followed / All / Off) */}
          <button
            onClick={handleToggleFxMode}
            className={`px-2.5 py-1 rounded-xl border text-[10px] font-black transition-all flex items-center space-x-1 ${
              fxMode === 'FOLLOWED_ONLY'
                ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40'
                : fxMode === 'ALL_LIVE'
                ? 'bg-gold/20 text-gold border-gold/40'
                : 'bg-panel text-gray-400 border-white/10'
            }`}
            title="Toggle Live Match Goal Vibrations & Flash"
          >
            <Zap className="w-3 h-3" />
            <span>FX: {fxMode === 'FOLLOWED_ONLY' ? 'Followed 📳' : fxMode === 'ALL_LIVE' ? 'All Live 🔥' : 'Muted'}</span>
          </button>

          {/* Profile Name (Edited ONLY in profile dashboard) */}
          <a
            href="/dashboard"
            className="flex items-center space-x-1.5 bg-black/70 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-stadiumGreen/40 text-[10px] text-stadiumGreen hover:text-white transition-all shadow-sm group"
            title="Your fan profile — click to edit username, check level & referrals in Dashboard"
          >
            <User className="w-3 h-3 text-gold group-hover:scale-110 transition-transform" />
            <span className="font-black truncate max-w-[120px]">@{userProfile.username.replace(/^@/, '')}</span>
            <span className="text-[9px] px-1 rounded bg-stadiumGreen/20 text-stadiumGreen font-mono font-bold">
              LVL {userProfile.level?.level || 4}
            </span>
          </a>

          {/* Manual Intel Refresh */}
          <button
            onClick={loadIntel}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Refresh Location & Weather"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-stadiumGreen' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};

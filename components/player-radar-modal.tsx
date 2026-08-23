'use client';
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  X, 
  Search, 
  Shield, 
  Zap, 
  Bell, 
  Trophy, 
  Flame, 
  Smartphone,
  CheckCircle2,
  Activity,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FEATURED_PLAYERS_CATALOG, FollowedPlayer, playerFollowEngine } from '../lib/player-follow-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';
import { getClubCrest } from '../lib/club-crest-engine';

interface PlayerRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerRadarModal: React.FC<PlayerRadarModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [followedList, setFollowedList] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<FollowedPlayer | null>(null);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFollowedList(playerFollowEngine.getFollowedPlayers());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredPlayers = FEATURED_PLAYERS_CATALOG.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.club.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (player: FollowedPlayer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    phoneHardware.triggerHaptic('SELECTION');
    const isNow = playerFollowEngine.toggleFollowPlayer(player.name);
    setFollowedList(playerFollowEngine.getFollowedPlayers());
    if (isNow) {
      stadiumAudio.playBookmarkSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } else {
      stadiumAudio.playRemovePickSound();
    }
  };

  const handleTestLockScreen = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playWonTicketSound();
    setTestSent(true);
    await playerFollowEngine.sendLockScreenAlert(
      '⚽ GOAL ALERT: Victor Osimhen Scored! (64\')',
      'Galatasaray 2 - 1 Fenerbahçe. Victor Osimhen scored a diving header! Tap to view live stadium radar.'
    );
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-5 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-4xl h-[92vh] glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold via-stadiumGreen to-cyberPurple text-black font-black shadow-lg">
              <Star className="w-6 h-6 text-black fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-base sm:text-xl text-white tracking-wider">
                  STAR PLAYER RADAR & DOSSIER ⭐
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[10px]">
                  LOCK-SCREEN ALERTS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Click any player for full statistical dossier or tap follow for lock screen goal alerts!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <button
              onClick={handleTestLockScreen}
              className="px-3.5 py-2 rounded-2xl bg-gold/20 hover:bg-gold text-gold hover:text-black border border-gold/40 font-black text-xs transition-all flex items-center space-x-1.5 shadow-md"
              title="Test Phone Lock Screen Notification"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{testSent ? 'Alert Dispatched ✓' : 'Test Lock Screen Alert 📱'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search star players (Haaland, Osimhen, Saka, Salah, Lookman, Vinicius...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
          />
        </div>

        {/* Players Grid */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-3 sm:p-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPlayers.map((player) => {
              const isFollowed = followedList.includes(player.name);

              return (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="glass-panel rounded-2xl p-3.5 border border-white/10 hover:border-stadiumGreen transition-all flex items-center justify-between gap-3 group cursor-pointer hover:bg-white/5 active:scale-[0.99]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-panel via-black to-panel border border-white/10 flex items-center justify-center font-black text-sm text-gold flex-shrink-0 group-hover:border-stadiumGreen">
                      {player.rating}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-black text-white text-xs truncate group-hover:text-stadiumGreen transition-colors">
                          {player.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-black text-[8px]">
                          {player.position}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-sans block mt-0.5 truncate">
                        {player.club} • {player.country}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggle(player, e)}
                    className={`px-3 py-1.5 rounded-xl border font-black text-xs transition-all flex items-center space-x-1 flex-shrink-0 ${
                      isFollowed
                        ? 'bg-gold text-black border-gold shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:text-gold hover:border-gold/50'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
                    <span>{isFollowed ? 'Following' : 'Follow'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-white/10 pt-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-stadiumGreen inline-block animate-ping" />
            <span>Lock screen notifications wake your device automatically when your followed players score</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all"
          >
            Done ➔
          </button>
        </div>

      </div>

      {/* DETAILED PLAYER DOSSIER MODAL */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="relative w-full max-w-lg glass-panel-premium rounded-3xl border-2 border-gold/60 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-gold to-stadiumGreen p-0.5 flex-shrink-0 shadow-xl">
                <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center font-black text-2xl text-gold">
                  {selectedPlayer.rating}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-black text-lg text-white truncate">{selectedPlayer.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                    {selectedPlayer.position}
                  </span>
                </div>
                <p className="text-gray-300 text-xs font-sans mt-0.5">
                  {selectedPlayer.club} • {selectedPlayer.country}
                </p>
                <div className="flex items-center space-x-2 mt-1 text-[10px] text-gold font-bold">
                  <span>OVR Rating: {selectedPlayer.rating}</span>
                  <span>•</span>
                  <span>Scouting Index: Elite ⚡</span>
                </div>
              </div>
            </div>

            {/* Stats Bento */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-[9px] text-gray-400 font-bold block">GOALS / 90m</span>
                <span className="text-lg font-black text-stadiumGreen block">0.84</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-[9px] text-gray-400 font-bold block">xG THREAT</span>
                <span className="text-lg font-black text-gold block">9.4 / 10</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-[9px] text-gray-400 font-bold block">SHOT ACCURACY</span>
                <span className="text-lg font-black text-white block">76%</span>
              </div>
            </div>

            {/* In-depth dossier text */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-gray-300 font-sans text-xs leading-relaxed">
              <p>
                <strong>{selectedPlayer.name}</strong> is currently in prime form for <strong>{selectedPlayer.club}</strong>. Known for explosive finishing, clinical positioning, and high pressing intensity.
              </p>
              <p className="text-[11px] text-gray-400">
                ⭐ Following this star activates real-time goal alerts and starting XI notifications directly on your phone lock screen whenever {selectedPlayer.club} plays.
              </p>
            </div>

            {/* Action Bar (MUST STILL HAVE FOLLOW BUTTON INSIDE DETAILS) */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-3">
              <button
                onClick={() => handleToggle(selectedPlayer)}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  followedList.includes(selectedPlayer.name)
                    ? 'bg-gold text-black shadow-gold/30'
                    : 'bg-stadiumGreen hover:bg-emerald-400 text-black shadow-stadiumGreen/30'
                }`}
              >
                <Star className={`w-4 h-4 ${followedList.includes(selectedPlayer.name) ? 'fill-black' : ''}`} />
                <span>
                  {followedList.includes(selectedPlayer.name)
                    ? '⭐ Following Star Player (Active Alert ✓)'
                    : '⭐ Follow Star Player for Live Alerts'}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

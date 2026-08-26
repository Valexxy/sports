'use client';
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  X, 
  Search, 
  Shield, 
  Zap, 
  Trophy, 
  Flame, 
  Target, 
  Award, 
  Activity, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Calendar,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FEATURED_PLAYERS_CATALOG, FollowedPlayer, playerFollowEngine } from '../lib/player-follow-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface PlayerRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClub?: (clubName: string) => void;
  onOpenLeague?: (leagueName: string) => void;
}

export const PlayerRadarModal: React.FC<PlayerRadarModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenClub,
  onOpenLeague 
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [followedList, setFollowedList] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<FollowedPlayer | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFollowedList(playerFollowEngine.getFollowedPlayers());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredPlayers = FEATURED_PLAYERS_CATALOG.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.club.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
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

  const handleSharePlayer = (player: FollowedPlayer, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `⭐ Check out ${player.name} (${player.countryFlag} ${player.club}) dossier on Mivaj Sports! Full statistics, banker picks & trophies: https://mivaj.com/?player=${player.id}`;
    if (navigator.share) {
      navigator.share({ title: `${player.name} Dossier`, text, url: 'https://mivaj.com' }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Player dossier link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#07090e] rounded-3xl border-2 border-gold/50 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col text-white my-auto">
        
        {/* If Selected Player: Render Deep Comprehensive Profile View */}
        {selectedPlayer ? (
          <div className="space-y-4 flex flex-col h-full overflow-y-auto">
            
            {/* Navigation Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center space-x-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Star Players</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Hero Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-panel/70 p-4 rounded-3xl border border-gold/40">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-black border border-gold/50 flex-shrink-0 flex items-center justify-center p-1 shadow-inner">
                <img
                  src={selectedPlayer.jerseyPhoto}
                  alt={selectedPlayer.name}
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-1 right-1 text-base">{selectedPlayer.countryFlag}</div>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-black text-xl sm:text-2xl text-white truncate">{selectedPlayer.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold font-mono font-black text-xs border border-gold/30">
                    ⚡ {selectedPlayer.rating} OVR
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-300">
                  <span className="text-stadiumGreen font-black">⚽ {selectedPlayer.club}</span>
                  <span>&bull;</span>
                  <span>{selectedPlayer.league}</span>
                  <span>&bull;</span>
                  <span className="text-gold">#{selectedPlayer.jerseyNumber} {selectedPlayer.position}</span>
                </div>
                <div className="text-[10px] text-gray-400 font-sans">
                  Country: {selectedPlayer.country} &bull; Age: {selectedPlayer.age} &bull; Preferred Foot: {selectedPlayer.foot} &bull; Value: {selectedPlayer.marketValue}
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => handleToggle(selectedPlayer)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                    followedList.includes(selectedPlayer.name)
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-stadiumGreen text-black hover:bg-emerald-400'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{followedList.includes(selectedPlayer.name) ? 'Following ✓' : 'Follow Alerts ⭐'}</span>
                </button>

                <button
                  onClick={(e) => handleSharePlayer(selectedPlayer, e)}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Share Player Dossier"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Linked Club & League Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => {
                  if (onOpenClub) onOpenClub(selectedPlayer.club);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-stadiumGreen transition-all cursor-pointer group"
              >
                <span className="text-[9px] text-gray-400 font-bold block">CLUB PROFILE HUB</span>
                <span className="text-xs font-black text-white group-hover:text-stadiumGreen flex items-center justify-between mt-1">
                  <span>{selectedPlayer.club}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div 
                onClick={() => {
                  if (onOpenLeague) onOpenLeague(selectedPlayer.league);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-cyan-400 transition-all cursor-pointer group"
              >
                <span className="text-[9px] text-gray-400 font-bold block">LEAGUE STANDINGS</span>
                <span className="text-xs font-black text-white group-hover:text-cyan-400 flex items-center justify-between mt-1">
                  <span>{selectedPlayer.league}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Comprehensive Key Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-center">
                <span className="text-[9px] text-gray-400 block font-bold uppercase">SEASON GOALS</span>
                <span className="text-xl font-black text-stadiumGreen">🔥 {selectedPlayer.goals}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-center">
                <span className="text-[9px] text-gray-400 block font-bold uppercase">ASSISTS</span>
                <span className="text-xl font-black text-cyan-400">👟 {selectedPlayer.assists}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-center">
                <span className="text-[9px] text-gray-400 block font-bold uppercase">MARKET VALUE</span>
                <span className="text-base font-black text-gold">{selectedPlayer.marketValue}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-center">
                <span className="text-[9px] text-gray-400 block font-bold uppercase">PREF. FOOT</span>
                <span className="text-base font-black text-purple-400">⚡ {selectedPlayer.foot}</span>
              </div>
            </div>

            {/* Career Trophies & Honors */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-xs font-black text-gold flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-gold" />
                <span>Career Honors & Trophies</span>
              </span>
              <ul className="space-y-1.5 text-xs text-gray-200">
                {selectedPlayer.trophies.map((tr, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="text-gold">★</span>
                    <span>{tr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming Match & In-Play Prediction */}
            <div className="p-4 rounded-2xl bg-panel/70 border border-stadiumGreen/40 space-y-2">
              <span className="text-[10px] text-stadiumGreen font-black uppercase tracking-wider block">
                ⚡ NEXT UPCOMING MATCHDAY FIXTURE
              </span>
              <p className="text-sm font-black text-white">
                {selectedPlayer.nextMatch}
              </p>
              <div className="p-3 rounded-xl bg-black/80 border border-gold/30 flex items-center justify-between">
                <span className="text-xs text-gold font-black">🎯 Banker In-Play Pick:</span>
                <span className="text-xs font-mono font-black text-stadiumGreen">{selectedPlayer.inPlayPick}</span>
              </div>
            </div>

          </div>
        ) : (
          /* Star Player Grid Catalog View */
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold via-stadiumGreen to-cyan-400 text-black font-black shadow-lg">
                  <Star className="w-6 h-6 text-black fill-current" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="font-black text-base sm:text-xl text-white tracking-wider">
                      ⭐ GLOBAL STAR PLAYERS &amp; RADAR DOSSIER
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold font-black text-[10px] border border-gold/30">
                      100% VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">
                    Tap any player card for full statistical breakdown, match footprint, and lock-screen alerts.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all self-end sm:self-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="relative flex-shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search star players by name, club, or country (Haaland, Osimhen, Mbappé, Saka, Yamal...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-panel/80 border border-white/10 text-white placeholder-gray-500 font-mono text-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
            </div>

            {/* Modern Gen-Z Holographic Player Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {filteredPlayers.map((player) => {
                  const isFollowed = followedList.includes(player.name);

                  return (
                    <div
                      key={player.id}
                      onClick={() => {
                        phoneHardware.triggerHaptic('SELECTION');
                        stadiumAudio.playTabClickSound();
                        setSelectedPlayer(player);
                      }}
                      className="group relative rounded-3xl bg-gradient-to-b from-panel/90 to-black/95 border border-white/10 hover:border-gold/60 p-3.5 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/10"
                    >
                      {/* Top Card Bar: Rating + Position + Follow Star */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-8 h-8 rounded-xl bg-gold/20 border border-gold/40 text-gold font-black text-xs flex items-center justify-center shadow-inner">
                            {player.rating}
                          </span>
                          <span className="text-[10px] font-black text-gray-300 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 uppercase">
                            {player.position.split(' ')[0]}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleToggle(player, e)}
                          className={`p-1.5 rounded-xl border transition-all ${
                            isFollowed 
                              ? 'bg-gold text-black border-gold shadow-md' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-gold'
                          }`}
                          title={isFollowed ? 'Following (Tap to unfollow)' : 'Follow for Lock-Screen Goal Alerts'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Player Action Portrait with Real Transparent Cutout */}
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 via-black/80 to-black border border-white/10 flex items-center justify-center p-2 shadow-inner">
                        <img
                          src={player.jerseyPhoto}
                          alt={player.name}
                          className="w-full h-full object-contain group-hover:scale-115 transition-transform duration-500 drop-shadow-xl"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />

                        <div className="absolute top-2 right-2 text-base shadow-sm">
                          {player.countryFlag}
                        </div>
                      </div>

                      {/* Player Name, Club & Stats */}
                      <div className="space-y-1">
                        <span className="font-black text-sm text-white block truncate group-hover:text-gold transition-colors">
                          {player.name}
                        </span>
                        <div className="flex items-center space-x-1.5 text-[10px] text-stadiumGreen font-bold truncate">
                          <span>⚽</span>
                          <span className="truncate">{player.club}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-sans block truncate">
                          {player.league}
                        </span>
                      </div>

                      {/* Stats Pill Row */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10 text-center font-mono">
                        <div className="bg-white/5 py-1 px-1.5 rounded-lg">
                          <span className="text-[8px] text-gray-400 block">GOALS</span>
                          <span className="text-xs font-black text-stadiumGreen">🔥 {player.goals}</span>
                        </div>
                        <div className="bg-white/5 py-1 px-1.5 rounded-lg">
                          <span className="text-[8px] text-gray-400 block">ASSISTS</span>
                          <span className="text-xs font-black text-cyan-400">👟 {player.assists}</span>
                        </div>
                      </div>

                      {/* Action Banner */}
                      <div className="flex items-center justify-between text-[10px] text-gold font-bold pt-1">
                        <span>Tap to View Full Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

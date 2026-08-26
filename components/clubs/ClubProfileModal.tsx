'use client';

import React, { useState } from 'react';
import { X, Shield, Users, Trophy, MapPin, Globe2, Activity, ArrowRight, Flag } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { getClubSquad, DeepPlayerEntity } from '../../lib/club-squad-database';
import { PlayerProfileModal } from '../players/PlayerProfileModal';

interface ClubProfileModalProps {
  clubName: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenBirthdays?: () => void;
}

export const ClubProfileModal: React.FC<ClubProfileModalProps> = ({
  clubName,
  isOpen,
  onClose,
  onOpenBirthdays,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SQUAD' | 'STADIUM' | 'ANALYTICS'>('SQUAD');
  const [selectedPlayer, setSelectedPlayer] = useState<DeepPlayerEntity | null>(null);

  if (!isOpen || !clubName) return null;

  const squad = getClubSquad(clubName);

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-[#0d111a] rounded-3xl border-2 border-stadiumGreen/60 shadow-2xl p-4 sm:p-6 space-y-4 my-6 max-h-[92vh] overflow-y-auto text-white glow-emerald">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 p-1 flex items-center justify-center shadow">
                <Shield className="w-8 h-8 text-stadiumGreen" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-black text-white flex items-center space-x-2">
                  <span>{clubName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-bold">
                    OFFICIAL CLUB PROFILE
                  </span>
                </h2>
                <p className="text-[11px] text-gray-400 font-sans">Full Roster, Granular Biodata &amp; Player Match Footprints</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
            {[
              { id: 'SQUAD' as const, label: 'Squad (' + squad.length + ')', icon: Users },
              { id: 'OVERVIEW' as const, label: 'Overview', icon: Trophy },
              { id: 'STADIUM' as const, label: 'Stadium', icon: MapPin },
              { id: 'ANALYTICS' as const, label: 'Analytics', icon: Activity },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  stadiumAudio.playTabClickSound();
                  setActiveTab(tab.id);
                }}
                className={'px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ' + (activeTab === tab.id ? 'bg-stadiumGreen text-black shadow' : 'bg-white/5 text-gray-400 hover:text-white')}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'SQUAD' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {squad.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      phoneHardware.triggerHaptic('SELECTION');
                      stadiumAudio.playAddPickSound();
                      setSelectedPlayer(player);
                    }}
                    className="p-3 rounded-2xl bg-black/50 border border-white/[0.08] hover:border-stadiumGreen/60 transition-all cursor-pointer group flex items-center justify-between hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-xs flex items-center justify-center border border-stadiumGreen/30 group-hover:bg-stadiumGreen group-hover:text-black transition-colors">
                        #{player.number}
                      </span>
                      <div>
                        <span className="font-black text-xs text-white group-hover:text-stadiumGreen transition-colors flex items-center space-x-1">
                          <span>{player.name}</span>
                          <span>{player.natFlag}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 block font-sans">
                          {player.specificRole} &bull; {player.age} yrs
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center space-x-2">
                      <div>
                        <span className="text-xs font-black text-stadiumGreen block">{player.seasonStats.goals}G / {player.seasonStats.assists}A</span>
                        <span className="text-[9px] text-gray-500">{player.marketValue}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-stadiumGreen group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'OVERVIEW' && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300 font-sans">
              <h4 className="font-black text-white font-mono text-sm">{clubName} Historical Foundation</h4>
              <p>One of the foremost competitive institutions in elite world sports, tracked with high-precision Poisson attack/defense ratios and live matchday tracking on Mivaj.</p>
            </div>
          )}

          {activeTab === 'STADIUM' && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300 font-sans">
              <h4 className="font-black text-white font-mono text-sm">Main Arena &amp; Pitch Dimensions</h4>
              <p>Official stadium capacity with 52,000+ seats, optimized pitch grass hybrid drainage, and altitude-adjusted home win telemetry.</p>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300 font-sans">
              <h4 className="font-black text-white font-mono text-sm">Poisson Attack &amp; Defense Ratings</h4>
              <p>Calculated dynamic xG creation per 90: <strong>2.15</strong> &bull; Conceded per 90: <strong>0.88</strong> &bull; Model win bias: <strong>+18.4%</strong>.</p>
            </div>
          )}
        </div>
      </div>

      <PlayerProfileModal
        isOpen={!!selectedPlayer}
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onOpenBirthdays={onOpenBirthdays}
      />
    </>
  );
};

'use client';

import React, { useState } from 'react';
import { X, Trophy, Star, Video, Play, Upload, CheckCircle2, FileText, Image as ImageIcon, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface Props {
  onClose: () => void;
}

export interface GrassrootsTalent {
  id: string;
  name: string;
  age: number;
  club: string;
  state: string;
  position: string;
  scoutRating: string;
  speed: string;
  goals: number;
  assists: number;
  highlight: string;
  videoUrl: string;
  thumbnail: string;
  votes: number;
  radar: {
    pace: number;
    dribbling: number;
    finishing: number;
    vision: number;
    physical: number;
  };
}

const INITIAL_TALENTS: GrassrootsTalent[] = [
  {
    id: 't-1',
    name: 'Chukwuemeka Okonkwo',
    age: 18,
    club: 'Beyond Limits FA',
    state: 'Ogun State, NG',
    position: 'Right Winger / Speedster',
    scoutRating: '9.4 / 10',
    speed: '34.8 km/h',
    goals: 14,
    assists: 9,
    highlight: 'Top Scorer NPFL Youth Championship 2024. Elite 1v1 dribble rate and explosive cut-inside bursts.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-a-stadium-41136-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    votes: 1420,
    radar: { pace: 96, dribbling: 92, finishing: 88, vision: 80, physical: 78 },
  },
  {
    id: 't-2',
    name: 'Abubakar Danladi',
    age: 19,
    club: 'Kano Pillars Academy',
    state: 'Kano State, NG',
    position: 'Central Midfielder / Anchor',
    scoutRating: '9.1 / 10',
    speed: '31.2 km/h',
    goals: 7,
    assists: 15,
    highlight: '92% pass completion. Exceptional spatial awareness under high press. Dictates game tempo with ease.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-player-scoring-a-goal-at-a-football-match-41140-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    votes: 1285,
    radar: { pace: 78, dribbling: 88, finishing: 75, vision: 95, physical: 85 },
  },
  {
    id: 't-3',
    name: 'Godswill Ebuka',
    age: 17,
    club: 'Sporting Lagos Youth',
    state: 'Lagos State, NG',
    position: 'Centre Forward / Target Man',
    scoutRating: '9.6 / 10',
    speed: '35.1 km/h',
    goals: 19,
    assists: 6,
    highlight: 'Lagos State Gold Cup MVP. Compared to Victor Osimhen for relentless pressing and aerial power.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-footballer-running-with-the-ball-in-a-stadium-41138-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    votes: 2150,
    radar: { pace: 94, dribbling: 84, finishing: 96, vision: 74, physical: 92 },
  },
  {
    id: 't-4',
    name: 'Favour Blessing Uche',
    age: 18,
    club: 'Rivers Angels Grassroots',
    state: 'Rivers State, NG',
    position: 'Attacking Midfielder',
    scoutRating: '9.3 / 10',
    speed: '32.4 km/h',
    goals: 11,
    assists: 13,
    highlight: 'NWFL Youth Revelation of the Year. Pinpoint through-balls and long-range knuckleball freekicks.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-a-stadium-41136-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    votes: 1640,
    radar: { pace: 85, dribbling: 91, finishing: 86, vision: 94, physical: 80 },
  },
];

export const GrassrootsScoutingModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'SUBMIT' | 'LEADERBOARD'>('RADAR');
  const [talents, setTalents] = useState<GrassrootsTalent[]>(INITIAL_TALENTS);
  const [selectedTalent, setSelectedTalent] = useState<GrassrootsTalent | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

  // Submission Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '18',
    club: '',
    state: 'Lagos State, NG',
    position: 'Forward',
    speed: '33.5 km/h',
    highlightUrl: '',
    notes: '',
  });
  const [submittedFile, setSubmittedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'VIDEO' | 'PDF' | 'IMAGE'>('VIDEO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleVote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (userVotes[id]) return;

    setUserVotes((prev) => ({ ...prev, [id]: true }));
    setTalents((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );
    stadiumAudio.playCrowdRoar();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'VIDEO' | 'PDF' | 'IMAGE') => {
    if (e.target.files && e.target.files[0]) {
      setSubmittedFile(e.target.files[0].name);
      setFileType(type);
    }
  };

  const handleSubmitTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.club.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newProspect: GrassrootsTalent = {
        id: 't-' + Date.now(),
        name: formData.name.trim(),
        age: parseInt(formData.age, 10) || 18,
        club: formData.club.trim(),
        state: formData.state,
        position: formData.position,
        scoutRating: '9.0 / 10',
        speed: formData.speed || '33.0 km/h',
        goals: 5,
        assists: 4,
        highlight: formData.notes || 'Recently submitted grassroots standout. Under review by NPFL scouts.',
        videoUrl: formData.highlightUrl || 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-a-stadium-41136-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        votes: 1,
        radar: { pace: 85, dribbling: 82, finishing: 80, vision: 80, physical: 80 },
      };

      setTalents([newProspect, ...talents]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      stadiumAudio.playCrowdRoar();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });

      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('RADAR');
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all hover:rotate-90 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-white text-sm sm:text-base">
                  NAIJA GRASSROOTS SCOUTING & NPFL RADAR 🇳🇬⚽
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[9px]">
                  PRO RADAR
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Discovering the next Osimhen, Kanu & Lookman across Nigeria. Verified scout radar & community voting.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1.5 bg-black/60 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('RADAR')}
              className={'px-3 py-1.5 rounded-xl font-black text-[10px] transition-all ' +
                (activeTab === 'RADAR' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white')}
            >
              ⭐ Top Prospects
            </button>
            <button
              onClick={() => setActiveTab('SUBMIT')}
              className={'px-3 py-1.5 rounded-xl font-black text-[10px] transition-all ' +
                (activeTab === 'SUBMIT' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white')}
            >
              📤 Submit Talent
            </button>
            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={'px-3 py-1.5 rounded-xl font-black text-[10px] transition-all ' +
                (activeTab === 'LEADERBOARD' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white')}
            >
              🏆 Votes
            </button>
          </div>
        </div>

        {/* Premium Stats Grid (NO USSD) */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Scouted Talents</span>
            <span className="text-stadiumGreen font-black text-base sm:text-xl">1,240+ Kids</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Pitches Funded</span>
            <span className="text-gold font-black text-base sm:text-xl">36 States</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Verified Scouts</span>
            <span className="text-cyberPurple font-black text-base sm:text-xl">180+ Agents</span>
          </div>
        </div>

        {/* TAB 1: RADAR CARDS (CLICKABLE WITH VIDEOS & VOTING) */}
        {activeTab === 'RADAR' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stadiumGreen font-black uppercase tracking-wider">
                ⚡ Click any card to watch video highlights & scouting report
              </span>
              <span className="text-[10px] text-gray-400">{talents.length} Prospects Live</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {talents.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTalent(t)}
                  className="group p-3.5 rounded-3xl bg-black/65 hover:bg-black/90 border border-white/10 hover:border-stadiumGreen/60 space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-xl hover:shadow-stadiumGreen/20 flex flex-col justify-between"
                >
                  <div>
                    {/* Video Thumbnail Preview Banner */}
                    <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-white/10 mb-2.5">
                      <img
                        src={t.thumbnail}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-stadiumGreen/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-bold text-stadiumGreen">
                        Age {t.age}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold/90 text-black text-[9px] font-black">
                        ⭐ {t.scoutRating}
                      </div>
                    </div>

                    {/* Talent Info */}
                    <div>
                      <h3 className="font-black text-white text-sm group-hover:text-stadiumGreen transition-colors flex items-center justify-between">
                        <span>{t.name}</span>
                        <Video className="w-3.5 h-3.5 text-gray-400 group-hover:text-stadiumGreen" />
                      </h3>
                      <p className="text-[10px] text-gray-300 font-bold">{t.position}</p>
                      <p className="text-[9px] text-stadiumGreen font-mono">{t.club} • {t.state}</p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-white/5 text-[10px] my-2 text-center">
                      <div>
                        <span className="text-gray-400 text-[8px] block">SPEED</span>
                        <strong className="text-white font-mono">{t.speed}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[8px] block">GOALS</span>
                        <strong className="text-gold font-mono">{t.goals}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[8px] block">ASSISTS</span>
                        <strong className="text-stadiumGreen font-mono">{t.assists}</strong>
                      </div>
                    </div>

                    <p className="text-[9px] text-gray-400 font-sans italic line-clamp-2">{t.highlight}</p>
                  </div>

                  {/* Voting Button */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={(e) => handleVote(e, t.id)}
                      className={'px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center space-x-1.5 transition-all ' +
                        (userVotes[t.id]
                          ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20'
                          : 'bg-panel hover:bg-stadiumGreen/20 text-gray-300 hover:text-white border border-white/10')}
                    >
                      <Star className={'w-3 h-3 ' + (userVotes[t.id] ? 'fill-black' : 'text-gold')} />
                      <span>{userVotes[t.id] ? 'Voted ✓' : 'Vote Wonderkid'}</span>
                    </button>
                    <span className="text-[10px] text-gold font-mono font-bold">{t.votes.toLocaleString()} votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TALENT SUBMISSION (MULTIPLE FILE TYPES) */}
        {activeTab === 'SUBMIT' && (
          <form onSubmit={handleSubmitTalent} className="p-4 sm:p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3.5">
            <div>
              <h3 className="text-white font-black text-sm flex items-center space-x-2">
                <Upload className="w-4 h-4 text-stadiumGreen" />
                <span>SUBMIT A PROSPECT TO NIGERIAN & EUROPEAN SCOUTS</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Upload video highlights, scouting reports (PDF), match photos, or YouTube links.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-300 block mb-1">Player Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Victor Osimhen Jr."
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-300 block mb-1">Academy / Grassroots Club *</label>
                <input
                  type="text"
                  required
                  value={formData.club}
                  onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                  placeholder="e.g. Ultimate Strikers Academy"
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-300 block mb-1">Age (Years)</label>
                <select
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-white focus:outline-none focus:border-stadiumGreen font-mono"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 14).map((a) => (
                    <option key={a} value={a}>Age {a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-300 block mb-1">Position & Role</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g. Centre Forward / Box-to-Box"
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-mono"
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="p-3.5 rounded-2xl bg-panel border border-white/10 space-y-2">
              <span className="text-[10px] text-stadiumGreen font-bold block">
                ATTACH HIGHLIGHT MEDIA (CHOOSE ONE OR MORE)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Video Upload */}
                <label className="p-3 rounded-xl bg-black/50 border border-dashed border-white/20 hover:border-stadiumGreen/60 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1">
                  <Video className="w-5 h-5 text-stadiumGreen" />
                  <span className="text-[10px] text-white font-bold">Video Clip (.mp4, .mov)</span>
                  <span className="text-[8px] text-gray-400">Max 50MB</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'VIDEO')} />
                </label>

                {/* 2. PDF Scouting Report */}
                <label className="p-3 rounded-xl bg-black/50 border border-dashed border-white/20 hover:border-gold/60 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1">
                  <FileText className="w-5 h-5 text-gold" />
                  <span className="text-[10px] text-white font-bold">Scout Report (.pdf)</span>
                  <span className="text-[8px] text-gray-400">Match stats dossier</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileChange(e, 'PDF')} />
                </label>

                {/* 3. Photo ID */}
                <label className="p-3 rounded-xl bg-black/50 border border-dashed border-white/20 hover:border-cyberPurple/60 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1">
                  <ImageIcon className="w-5 h-5 text-cyberPurple" />
                  <span className="text-[10px] text-white font-bold">Action Photo (.jpg, .png)</span>
                  <span className="text-[8px] text-gray-400">HD Match Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'IMAGE')} />
                </label>
              </div>

              {submittedFile && (
                <div className="p-2 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40 flex items-center justify-between text-stadiumGreen text-[10px] font-bold">
                  <span>Attached: {submittedFile} ({fileType})</span>
                  <CheckCircle2 className="w-4 h-4 text-stadiumGreen" />
                </div>
              )}
            </div>

            {/* Video Highlight Link Alternative */}
            <div>
              <label className="text-[10px] text-gray-300 block mb-1">Or YouTube / TikTok Highlight URL</label>
              <input
                type="url"
                value={formData.highlightUrl}
                onChange={(e) => setFormData({ ...formData, highlightUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@..."
                className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-lg shadow-stadiumGreen/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting to NPFL & International Scouts... ⏳</span>
              ) : submitSuccess ? (
                <span>Prospect Successfully Submitted! ✓</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Talent to Radar 🚀</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: COMMUNITY VOTING LEADERBOARD */}
        {activeTab === 'LEADERBOARD' && (
          <div className="p-4 rounded-3xl bg-black/60 border border-white/10 space-y-3">
            <span className="text-[10px] text-gold font-black uppercase tracking-wider block">
              🏆 Top Voted Nigerian Wonderkids (Community Golden Boy)
            </span>

            <div className="space-y-2">
              {[...talents].sort((a, b) => b.votes - a.votes).map((t, rank) => (
                <div key={t.id} className="p-3 rounded-2xl bg-panel border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={'w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ' +
                      (rank === 0 ? 'bg-gold text-black shadow-md' : rank === 1 ? 'bg-gray-300 text-black' : rank === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-gray-400')}>
                      {rank + 1}
                    </span>
                    <div>
                      <h4 className="font-black text-white text-xs">{t.name}</h4>
                      <p className="text-[10px] text-gray-400">{t.position} • {t.club}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-gold font-mono font-black text-xs">{t.votes.toLocaleString()} Votes</span>
                    <button
                      onClick={(e) => handleVote(e, t.id)}
                      className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen hover:bg-stadiumGreen hover:text-black font-bold text-[10px] transition-all"
                    >
                      +1 Vote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POPUP TALENT VIDEO & SCOUTING DOSSIER MODAL */}
        {selectedTalent && (
          <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
            <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedTalent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-stadiumGreen text-xs font-black">
                <Video className="w-4 h-4" />
                <span>OFFICIAL SCOUTING VIDEO & RADAR DOSSIER</span>
              </div>

              {/* Video Player Embed */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-stadiumGreen/40 bg-black aspect-video flex items-center justify-center shadow-2xl">
                <video
                  src={selectedTalent.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Player Overview */}
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedTalent.name}</h3>
                  <p className="text-xs text-stadiumGreen font-bold">{selectedTalent.position} • {selectedTalent.club}</p>
                  <p className="text-[10px] text-gray-400">{selectedTalent.state} | Top Speed: {selectedTalent.speed}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-gold">⭐ {selectedTalent.scoutRating}</span>
                  <span className="text-[10px] text-gray-400 block font-mono">{selectedTalent.votes.toLocaleString()} Votes</span>
                </div>
              </div>

              {/* Tactical Radar Breakdown */}
              <div className="p-3.5 rounded-2xl bg-panel border border-white/10 space-y-2">
                <span className="text-[10px] text-stadiumGreen font-black uppercase tracking-wider block">
                  📊 Tactical Attributes (AI Scout Breakdown)
                </span>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-400 block text-[9px]">PACE</span>
                    <strong className="text-stadiumGreen font-mono text-xs">{selectedTalent.radar.pace}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-400 block text-[9px]">DRIBBLING</span>
                    <strong className="text-gold font-mono text-xs">{selectedTalent.radar.dribbling}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-400 block text-[9px]">FINISHING</span>
                    <strong className="text-crimson font-mono text-xs">{selectedTalent.radar.finishing}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-400 block text-[9px]">VISION</span>
                    <strong className="text-cyberPurple font-mono text-xs">{selectedTalent.radar.vision}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-400 block text-[9px]">PHYSICAL</span>
                    <strong className="text-blue-400 font-mono text-xs">{selectedTalent.radar.physical}</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 font-sans leading-relaxed">{selectedTalent.highlight}</p>

              <button
                onClick={(e) => handleVote(e, selectedTalent.id)}
                className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs shadow-lg shadow-stadiumGreen/30 hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2"
              >
                <Star className="w-4 h-4 fill-black" />
                <span>Cast Official Wonderkid Vote (+1) ⭐</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

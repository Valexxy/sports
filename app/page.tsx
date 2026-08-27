'use client';

import { BetSlipDrawer } from '../components/bet-slip-drawer';
import { FEATURE_BUNDLES } from '../lib/feature-bundle-config';

import { SportBar, SportFilterType } from '../components/navigation/SportBar';
import { PolymorphicMatchCard } from '../components/matches/PolymorphicMatchCard';
import { ScreenPinnedMatchWidget } from '../components/screen-pinned-match-widget';
import { SecurityHealthBadge } from '../components/security-health-badge';
import { StadiumSmartPreloader } from '../components/stadium-smart-preloader';
import { ViralArcadeHubModal } from '../components/viral-arcade-hub-modal';
import { backgroundGoalChimes } from '../lib/background-goal-chimes';
import React, { useState, useEffect, useMemo } from 'react';
import { StadiumFooter } from '../components/stadium-footer';
import { PersistentStorage } from '../lib/persistent-storage-engine';
import { StadiumHeader } from '../components/stadium-header';
import { DailyMatchCard } from '../components/daily-match-card';
import { LeagueStandingsTable } from '../components/league-standings-table';
import { ReceiptModal } from '../components/receipt-modal';
import { PublicLedgerModal } from '../components/public-ledger';
import { MatchInsightsModal } from '../components/match-insights-modal';
import { UserProfileModal } from '../components/user-profile-modal';
import { PredictionHistoryModal } from '../components/prediction-history-modal';
import { TeamExplorerModal } from '../components/team-explorer-modal';
import { DailyAuraHarvestModal } from '../components/daily-aura-harvest-modal';
import { WhaleLeaderboardModal } from '../components/whale-leaderboard-modal';
import { AdminChatDrawer } from '../components/admin-chat-drawer';
import { BirthdayCenterModal } from '../components/birthday-center-modal';
import { NaijaBanterLoungeModal } from '../components/naija-banter-lounge-modal';
import { GrassrootsScoutingModal } from '../components/grassroots-scouting-modal';
import { TipsterLeaderboardModal } from '../components/tipster-leaderboard-modal';
import { LegalModal } from '../components/legal-modal';
import { HistoryArchiveModal } from '../components/history-archive-modal';
import { RotatingPoolModal } from '../components/rotating-pool-modal';
import { GenZLiveAlerts } from '../components/genz-live-alerts';
import { GoogleDateNavigator } from '../components/google-date-navigator';
import { CloutCardGenerator } from '../components/clout-card-generator';
import { ReverseJinxModal } from '../components/reverse-jinx-modal';
import { OfflineBanner } from '../components/offline-banner';
import { ErrorBoundary } from '../components/error-boundary';
import { BroadcastTicker, TriggerUpdate } from '../components/broadcast-ticker';

import { FooterComplianceDisclaimer } from '../components/footer-disclaimer';
import { SportsNewsSection } from '../components/sports-news-section';
export interface BetItem { id: string; selection: string; odds: number; probability: number; homeTeam: string; awayTeam: string; matchId: string; }
import { MobileAppDock } from '../components/mobile-app-dock';
import { StadiumSuitesMenu } from '../components/stadium-suites-menu';
import { StadiumAndViralHub } from '../components/stadium-viral-hub';
import { EffectsModal } from '../components/effects-modal';
import { VcFundingModal } from '../components/vc-funding-modal';
import { fetchLiveMatches, MatchData } from '../lib/sports-api';
import { PhoneHardwareBanner } from '../components/phone-install-banner';
import { LeagueStandingsModal } from '../components/league-standings-modal';
import { GlobalLeagueBrowser } from '../components/global-league-browser';
import { AuthDashboardModal } from '../components/auth-dashboard-modal';
import { PlayerRadarModal } from '../components/player-radar-modal';
import { ClubProfileHubModal } from '../components/club-profile-hub-modal';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { speakNaija, allowSpeechOnUserGesture } from '../lib/naija-voice-engine';
import { playerFollowEngine } from '../lib/player-follow-engine';
import { SettlementLedgerSection } from '../components/settlement-ledger-section';
import { RealtimeCaptureStatus } from '../components/realtime-capture-status';
import { MatchAlertScheduler } from '../lib/match-alert-scheduler';
import { sortMatchesByClosestKickoff } from '../lib/match-sorter';
import { Sparkles, Search, ChevronDown, RefreshCw, Radio, Calendar, Clock, Zap } from 'lucide-react';
import { GlobalLanguageSwitcher } from '../components/global-language-switcher';
import { DailyBankerAccumulatorCard } from '../components/daily-banker-accumulator-card';




import { PublicSocialLinksCard } from '../components/community/PublicSocialLinksCard';
import { CrossPlatformConverterModal } from '../components/cross-platform-code-converter-modal';



import { FlexReceiptCardModal } from '../components/viral/FlexReceiptCardModal';

import { AccumulatorSlipDrawer, SelectedSlipPick } from '../components/accumulator-slip-drawer';
import { ViralFeaturesGrid } from '../components/viral-features-grid';
import { StadiumUserWeatherPanel } from '../components/stadium-user-weather-panel';
import { registerPushClient, pushClientId } from '../lib/push-client';
import { cacheOffline } from '../lib/offline-manager';

import { useTranslation } from '../lib/translation-engine';

type FilterType = 'LIVE' | 'UPCOMING' | 'PLAYED' | 'FOLLOWING' | 'ALL';

export default function Home() {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [hasAutoSwitchedTab, setHasAutoSwitchedTab] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSport, setActiveSport] = useState<SportFilterType>('ALL');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('Today');
  const [isViewingToday, setIsViewingToday] = useState<boolean>(true);
  const [selectedSport, setSelectedSport] = useState<'SOCCER' | 'BASKETBALL' | 'TENNIS'>('SOCCER');
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeDockTab, setActiveDockTab] = useState('MATCHES');
  const handleSelectDockTab = (tab: string) => {
    setActiveDockTab(tab);
    if (tab === 'FOLLOWING') {
      setActiveFilter('FOLLOWING');
    } else if (tab === 'MATCHES') {
      setActiveFilter('ALL');
    }
  };
  
  const [followedMatchIds, setFollowedMatchIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') return PersistentStorage.getFollowedMatches();
    return [];
  });
  const [followedLeagues, setFollowedLeagues] = useState<string[]>([]);
  const [showLeagueBrowser, setShowLeagueBrowser] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>([]);
  // Dark Mode Permanently Locked
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedMatches, setSavedMatches] = useState<MatchData[]>([]);
  const [betSlipItems, setBetSlipItems] = useState<BetItem[]>([]);
  const [accumulatorPicks, setAccumulatorPicks] = useState<SelectedSlipPick[]>([]);

  const handleAddMultiPicks = (picks: SelectedSlipPick[]) => {
    setAccumulatorPicks(prev => {
      const existingIds = new Set(prev.map(p => p.match.id));
      const newPicks = picks.filter(p => !existingIds.has(p.match.id));
      return [...prev, ...newPicks];
    });
  };

  const handleRemoveAccumulatorPick = (matchId: string) => {
    setAccumulatorPicks(prev => prev.filter(p => p.match.id !== matchId));
  };
  const [selectedMatchForReceipt, setSelectedMatchForReceipt] = useState<MatchData | null>(null);
  const [selectedMatchForInsights, setSelectedMatchForInsights] = useState<MatchData | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const [showBankroll, setShowBankroll] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTrackRecord, setShowTrackRecord] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showWhaleModal, setShowWhaleModal] = useState(false);
  const [showAdminChatDrawer, setShowAdminChatDrawer] = useState(false);
  const [showBirthdaysModal, setShowBirthdaysModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCloutCardModal, setShowCloutCardModal] = useState(false);
  const [showReverseJinxModal, setShowReverseJinxModal] = useState(false);
  const [showRotatingPoolModal, setShowRotatingPoolModal] = useState(false);
  const [showSuitesMenu, setShowSuitesMenu] = useState(false);
  const [showViralArcade, setShowViralArcade] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);
  const [showBanterModal, setShowBanterModal] = useState(false);
  const [showGrassrootsModal, setShowGrassrootsModal] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [selectedLeagueForTable, setSelectedLeagueForTable] = useState<string | null>(null);
  const [selectedClubForProfile, setSelectedClubForProfile] = useState<string | null>(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [showVcFundingModal, setShowVcFundingModal] = useState(false);

  const loadMatches = async () => {
    try {
      const data = await fetchLiveMatches();
      if (Array.isArray(data) && data.length > 0) {
        setMatches(data);
        try { localStorage.setItem('aurascore_matches_cache', JSON.stringify(data)); } catch (e) {}
      }
      setLastSynced(new Date());
      MatchAlertScheduler.checkAndTriggerLiveAlerts(data);
    } catch (err) {
      console.warn('Matches fetch error:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('aurascore_matches_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMatches(parsed);
          setLoadingMatches(false);
        }
      }
    } catch (e) {}
    loadMatches();
  }, []);

  // Robust Browser Back Button & Refresh State Restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;

        const restoreFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const matchId = params.get('match');
      const tab = params.get('tab');
      const modal = params.get('modal');

      if (matchId && matches.length > 0) {
        const found = matches.find(m => m.id === matchId);
        if (found) setSelectedMatchForInsights(found);
      } else if (!matchId) {
        setSelectedMatchForInsights(null);
      }

      if (tab && ['LIVE', 'UPCOMING', 'PLAYED', 'FOLLOWING', 'ALL'].includes(tab.toUpperCase())) {
        setActiveFilter(tab.toUpperCase() as FilterType);
      }

      // Restore Modals on Refresh
      if (modal === 'bankroll') setShowBankroll(true);
      if (modal === 'ledger') setShowTrackRecord(true);
      if (modal === 'leaderboard') setShowLeaderboardModal(true);
      if (modal === 'viral') setShowViralArcade(true);
      if (modal === 'banter') setShowBanterModal(true);
      if (modal === 'birthdays') setShowBirthdaysModal(true);
      if (modal === 'grassroots') setShowGrassrootsModal(true);
      if (modal === 'profile') setShowProfile(true);
      if (modal === 'leagues') setShowLeagueBrowser(true);
    };

    restoreFromUrl();
    window.addEventListener('popstate', restoreFromUrl);
    return () => window.removeEventListener('popstate', restoreFromUrl);
  }, [matches]);

  // Auto-refresh controlled by FEATURE_BUNDLES (Disabled by default to save mobile data)
  useEffect(() => {
    if (!FEATURE_BUNDLES.AUTO_BACKGROUND_POLLING) return;
    const interval = setInterval(() => { loadMatches(); }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Boot: analytics tracking + push subscription + offline caching
  useEffect(() => {
    const sessionId = pushClientId || `s-${Date.now().toString(36)}`;
    if (FEATURE_BUNDLES.ANALYTICS_BEACONING) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'pageview', sessionId }),
      }).catch(() => {});
    }

    // Register for server-initiated Web Push (silent, only if user grants).
    registerPushClient().catch(() => {});

    // Cache matches offline so the app remains usable with no network.
    if (!matches.length) return;
    cacheOffline('aurascore_matches', matches).catch(() => {});
  }, [matches.length]);

  
  
  // Permanent Cyber Obsidian Dark Mode

  const handleToggleFollowLeague = (leagueId: string) => {
    setFollowedLeagues((prev) => {
      const updated = prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId];
      try {
        localStorage.setItem('aurascore_followed_leagues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleFollow = (match: MatchData) => {
    const exists = followedMatchIds.includes(match.id);
    if (exists) {
      MatchAlertScheduler.unfollowMatch(match.id);
      setFollowedMatchIds(prev => prev.filter(id => id !== match.id));
      // Remove from server-side follow store.
      fetch(`/api/follow?clientId=${encodeURIComponent(pushClientId)}&matchId=${encodeURIComponent(match.id)}`, { method: 'DELETE' }).catch(() => {});
    } else {
      MatchAlertScheduler.followMatch(match);
      setFollowedMatchIds(prev => [...prev, match.id]);
      // Persist to server so server-initiated push works.
      fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: pushClientId,
          matchId: match.id,
          matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
          lastHomeScore: match.homeScore,
          lastAwayScore: match.awayScore,
        }),
      }).catch(() => {});
    }
  };

  const handleBookmarkToggle = (match: MatchData) => {
    setSavedMatches(prev => {
      if (prev.some(m => m.id === match.id)) return prev.filter(m => m.id !== match.id);
      return [...prev, match];
    });
  };

  const handleAddMultiBetItems = (picks: Array<{ match: MatchData; selection: string; odds: number }>) => {
    
    const newItems: BetItem[] = picks.map(p => ({
      matchId: p.match.id,
      matchTitle: p.match.homeTeam + ' vs ' + p.match.awayTeam,
      selection: p.selection,
      odds: p.odds,
    }));
    setBetSlipItems(newItems);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([80, 40, 80]);
  };

  const handleAddBetItem = (match: MatchData, selection: string, odds: number) => {
    const newItem: BetItem = {
      matchId: match.id,
      matchTitle: match.homeTeam + ' vs ' + match.awayTeam,
      selection,
      odds,
    };
    setBetSlipItems(prev => [...prev.filter(i => i.matchId !== match.id), newItem]);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([80]);
  };

  const handleRemoveBetItem = (index: number) => {
    setBetSlipItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSelectTickerUpdate = (update: TriggerUpdate) => {
    const match = matches.find(m => (m.homeTeam + ' vs ' + m.awayTeam) === update.matchTitle) || matches[0];
    if (match) setSelectedMatchForInsights(match);
  };

  const [highGuaranteesOnly, setHighGuaranteesOnly] = useState(false);

  // Helper to extract clean YYYY-MM-DD in user's local timezone
  const getMatchLocalDate = (utcDate?: string): string => {
    if (!utcDate) return new Date().toLocaleDateString('en-CA');
    try {
      const d = new Date(utcDate);
      if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-CA');
      return d.toLocaleDateString('en-CA');
    } catch {
      return new Date().toLocaleDateString('en-CA');
    }
  };

  // Strictly segment matches by the selected calendar day
  const dayMatches = React.useMemo(() => {
    return matches.filter((m) => {
      const matchDate = getMatchLocalDate(m.utcDate);
      return matchDate === selectedDateStr;
    });
  }, [matches, selectedDateStr]);

  const isSportMatch = (m: MatchData, sport: SportFilterType): boolean => {
    const l = (m.league || '').toLowerCase();
    const isBball = m.sport === 'BASKETBALL' || l.includes('nba') || l.includes('wnba') || l.includes('basketball') || l.includes('euroleague');
    const isCombat = m.sport === 'COMBAT' || l.includes('ufc') || l.includes('mma') || l.includes('boxing') || l.includes('bellator');
    const isTennis = m.sport === 'TENNIS' || l.includes('tennis') || l.includes('atp') || l.includes('wta') || l.includes('wimbledon') || l.includes('us open');
    const isNFL = m.sport === 'AMERICAN_FOOTBALL' || l.includes('nfl') || l.includes('football') && (l.includes('american') || l.includes('ncaa'));
    const isSoccer = !isBball && !isCombat && !isTennis && !isNFL;

    if (sport === 'ALL') return true;
    if (sport === 'SOCCER') return isSoccer;
    if (sport === 'BASKETBALL') return isBball;
    if (sport === 'COMBAT') return isCombat;
    if (sport === 'TENNIS') return isTennis;
    if (sport === 'AMERICAN_FOOTBALL') return isNFL;
    return true;
  };

  const daySportCounts = React.useMemo(() => {
    return {
      ALL: dayMatches.length,
      SOCCER: dayMatches.filter(m => isSportMatch(m, 'SOCCER')).length,
      BASKETBALL: dayMatches.filter(m => isSportMatch(m, 'BASKETBALL')).length,
      COMBAT: dayMatches.filter(m => isSportMatch(m, 'COMBAT')).length,
      TENNIS: dayMatches.filter(m => isSportMatch(m, 'TENNIS')).length,
      AMERICAN_FOOTBALL: dayMatches.filter(m => isSportMatch(m, 'AMERICAN_FOOTBALL')).length,
    };
  }, [dayMatches]);

  const filteredMatches = React.useMemo(() => {
    // Check if current day has fixtures for the active sport
    const daySportFixtures = dayMatches.filter(m => isSportMatch(m, activeSport));
    
    // If today has fixtures for this sport or ALL is active, use day fixtures; otherwise use all available matches for that sport
    const pool = activeSport === 'ALL'
      ? dayMatches
      : (daySportFixtures.length > 0 ? daySportFixtures : matches.filter(m => isSportMatch(m, activeSport)));

    const base = pool.filter(m => {
      const q = searchQuery.toLowerCase();
      if (q && !m.homeTeam.toLowerCase().includes(q) && !m.awayTeam.toLowerCase().includes(q) && !m.league.toLowerCase().includes(q)) return false;

      // Sport filter
      if (!isSportMatch(m, activeSport)) return false;
      
      // Banker filter
      if (highGuaranteesOnly) {
        const prob = m.prediction?.topPick?.probability || 0;
        const tier = m.prediction?.topPick?.confidenceTier || '';
        const isBanker = prob >= 65 || tier.includes('BANKER');
        if (!isBanker) return false;
      }

      if (activeFilter === 'LIVE') return m.status === 'LIVE';
      if (activeFilter === 'UPCOMING') return m.status === 'SCHEDULED';
      if (activeFilter === 'PLAYED') return m.status === 'FINISHED';
      if (activeFilter === 'FOLLOWING') return followedMatchIds.includes(m.id) || followedLeagues.some(l => m.league.toLowerCase().includes(l.toLowerCase()));
      return true;
    });
    return sortMatchesByClosestKickoff(base, activeFilter);
  }, [dayMatches, matches, searchQuery, activeFilter, activeSport, highGuaranteesOnly, followedMatchIds, followedLeagues]);

  const liveCount = filteredMatches.filter(m => m.status === 'LIVE').length;
  const upcomingCount = filteredMatches.filter(m => m.status === 'SCHEDULED').length;
  const playedCount = filteredMatches.filter(m => m.status === 'FINISHED').length;
  const highGuaranteesCount = filteredMatches.filter(m => (m.prediction?.topPick?.probability || 0) >= 70 || m.prediction?.topPick?.confidenceTier === 'ULTRA-BANKER').length;


  // Sync URL search params with Matches for Browser Back Button and Page Refresh Continuity
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const matchId = params.get('match');
      if (matchId && matches.length > 0) {
        const found = matches.find((m) => m.id === matchId);
        setSelectedMatchForInsights(found || null);
      } else if (!matchId) {
        setSelectedMatchForInsights(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [matches]);

  // Initial load check for ?match=id
  useEffect(() => {
    if (typeof window === 'undefined' || matches.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get('match');
    if (matchId) {
      const found = matches.find((m) => m.id === matchId);
      if (found) setSelectedMatchForInsights(found);
    }
  }, [matches]);

  const displayedMatches = filteredMatches.slice(0, visibleCount);

  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

  type PillDef = { key: FilterType; emoji: string; label: string; count: number; activeClass: string };
  const filterPills: PillDef[] = [
    { key: 'LIVE',     emoji: '', label: t('Live'),     count: liveCount,     activeClass: 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen font-black shadow-lg shadow-stadiumGreen/30' },
    { key: 'UPCOMING', emoji: '', label: t('Upcoming'), count: upcomingCount, activeClass: 'bg-amber-500/20 border-amber-500 text-amber-400 font-black shadow-lg shadow-amber-500/30' },
    { key: 'PLAYED',   emoji: '', label: t('Played'),   count: playedCount,   activeClass: 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-black shadow-lg shadow-cyan-500/30' },
  ];
  const followingCount = (dayMatches || []).filter(m => (followedMatchIds || []).includes(m.id) || (followedLeagues || []).some(l => (m.league || '').toLowerCase().includes((l || '').toLowerCase()))).length;

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-void flex flex-col pb-24 selection:bg-stadiumGreen selection:text-black font-sans `}>

        <BroadcastTicker matches={matches} onSelectUpdate={handleSelectTickerUpdate} />
        <OfflineBanner />
        <PhoneHardwareBanner />
        <GenZLiveAlerts matches={matches} onOpenMatch={(match) => setSelectedMatchForInsights(match)} />



        <StadiumHeader
          
          onOpenPlayers={() => setShowPlayersModal(true)}
          onOpenReceipt={() => matches.length > 0 && setSelectedMatchForReceipt(matches[0])}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenBankroll={() => setShowBankroll(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenTeams={() => setShowTeamsModal(true)}
          onOpenBirthdays={() => setShowBirthdaysModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenSuitesMenu={() => setShowSuitesMenu(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 space-y-5">

          {/* 1. GOOGLE DATE NAVIGATOR & DATE-SCOPED SPORT SELECTOR */}
          <GoogleDateNavigator onSelectDate={(dateStr, label, isToday, isPast) => { setSelectedDateStr(dateStr); setSelectedDateLabel(label); setIsViewingToday(isToday); setActiveFilter('ALL'); setSearchQuery(''); setVisibleCount(6); }} />

          {/* Sport Switcher Scoped To Selected Date */}
          <SportBar
            activeSport={activeSport}
            counts={daySportCounts}
            onSelectSport={(s) => {
              setActiveSport(s);
              setActiveFilter('ALL');
              setVisibleCount(6);
              try { stadiumAudio.playTabClickSound(); } catch (e) {}
            }}
          />

          {/* 2. MATCHES & PREDICTIONS HERO */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-8 rounded-full bg-stadiumGreen flex-shrink-0" />
                <div>
                  <h2 className="text-base font-black text-white flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-stadiumGreen" />
                    <span>
                      {isViewingToday ? "Today's Sports" : `${selectedDateLabel} Sports`}
                      {activeSport === 'SOCCER' && ' ⚽ (Football)'}
                      {activeSport === 'BASKETBALL' && ' 🏀 (Basketball)'}
                      {activeSport === 'COMBAT' && ' 🥊 (UFC / MMA)'}
                      {activeSport === 'TENNIS' && ' 🎾 (Tennis)'}
                      {activeSport === 'AMERICAN_FOOTBALL' && ' 🏈 (NFL)'}
                    </span>
                    {liveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] font-black animate-pulse">
                        {liveCount} LIVE
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-gray-400">{isViewingToday ? todayLabel : selectedDateStr} &bull; {filteredMatches.length} fixtures</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {lastSynced && (
                  <span className="text-[10px] text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Synced {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                )}
                <button onClick={loadMatches} disabled={loadingMatches}
                  className="p-2 rounded-xl bg-panel border border-white/10 text-stadiumGreen hover:bg-stadiumGreen/20 transition-all disabled:opacity-50">
                  <RefreshCw className={loadingMatches ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'} />
                </button>

              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('Search team, league or fixture...')}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10">
                  x
                </button>
              )}
            </div>

            {/* Status filter pills */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {filterPills.map(pill => (
                  <button
                    key={pill.key}
                    onClick={() => {
                      setActiveFilter(prev => prev === pill.key ? 'ALL' : pill.key);
                      setVisibleCount(6);
                      try { stadiumAudio.playTabClickSound(); } catch (e) {}
                    }}
                    className={`py-3 px-2 rounded-2xl border text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                      activeFilter === pill.key ? pill.activeClass : 'border-white/10 text-gray-400 bg-panel hover:text-white'
                    }`}
                  >
                    <span>{pill.label}</span>
                    {pill.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]">{pill.count}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setActiveFilter('FOLLOWING');
                    setVisibleCount(6);
                    try { stadiumAudio.playTabClickSound(); } catch (e) {}
                  }}
                  className={`py-2.5 px-2 rounded-2xl border text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                    activeFilter === 'FOLLOWING' ? 'bg-gold/20 border-gold text-gold shadow-lg shadow-gold/30' : 'border-white/10 text-gray-400 bg-panel hover:text-white'
                  }`}
                >
                  <span>⭐</span>
                  <span className="truncate">{t('Following')}</span>
                  {followingCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]">{followingCount}</span>}
                </button>

                <button
                  onClick={() => {
                    setShowLeagueBrowser(true);
                    try { stadiumAudio.playTabClickSound(); } catch (e) {}
                  }}
                  className="py-2.5 px-2 rounded-2xl border border-stadiumGreen/40 bg-stadiumGreen/15 hover:bg-stadiumGreen/25 text-stadiumGreen text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <span>🌍</span>
                  <span className="truncate">{t('All Leagues')}</span>
                </button>

                
              </div>
            </div>

            {/* Matches Grid */}
            {loadingMatches ? (
              <StadiumSmartPreloader />
            ) : filteredMatches.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayedMatches.map(match => (
                    <DailyMatchCard
                      key={match.id}
                      match={match}
                      onOpenInsights={setSelectedMatchForInsights}
                      onSelectOdds={handleAddBetItem}
                      onBookmarkMatch={handleBookmarkToggle}
                      onSelectClub={(club) => { setSelectedClubForProfile(club); setShowTeamsModal(true); }}
                      followedMatchIds={followedMatchIds}
                      onToggleFollow={handleToggleFollow}
                      onOpenStandings={(league) => {
                        setSelectedLeagueForTable(league);
                        setShowStandingsModal(true);
                      }}
                      onOpenTeam={(teamName) => { setSelectedClubForProfile(teamName); setShowTeamsModal(true); }}
                    />
                  ))}
                </div>
                {filteredMatches.length > visibleCount && (
                  <div className="text-center pt-2">
                    <button onClick={() => setVisibleCount(prev => prev + 6)}
                      className="px-6 py-3 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-sm inline-flex items-center space-x-2 transition-all hover:scale-105">
                      <Zap className="w-4 h-4" />
                      <span>Show 6 More Matches</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-10 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
                <Radio className="w-8 h-8 text-gold mx-auto" />
                <h3 className="text-white font-black text-sm">No matches found</h3>
                <p className="text-xs text-gray-400">Try selecting another date or switching filters.</p>
                <button onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); loadMatches(); }}
                  className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs">
                  Reset and Reload
                </button>
              </div>
            )}
          </div>

          
          

          {/* 4. REAL-TIME PHYSICS AURA MOMENTUM METER */}

          {/* 5. PAYSTACK GEN-Z FOMO MICRO-ODDS UNLOCKER (₦200, ₦300, ₦500) */}
          

          {/* 6. DAILY 10.00 ODDS ACCUMULATOR & CUT-1 SHIELD */}
          

          {/* 7. INSTANT AI MEME & SLANDER CARD CREATOR */}
          
          {/* 8. WHATSAPP STATUS 9:16 TICKET FLEXER */}
          
          {/* 9. 1v1 P2P SOCIAL WAGERS */}
          

          {/* 10. WONDERKID AURA STOCK EXCHANGE */}
          
          {/* 11. FULL SETTLEMENT LEDGER & AUDIT SUMMARY ON HOMEPAGE */}
          <SettlementLedgerSection onOpenAuditModal={() => setShowTrackRecord(true)} />

          {/* 12. TELEGRAM 24/7 BROADCAST BOT HUB */}
          <PublicSocialLinksCard />

          {/* 13. SPORTS NEWS SECTION */}
          <SportsNewsSection />

          {/* REGULATORY COMPLIANCE DISCLAIMER */}
          

          <FooterComplianceDisclaimer />

        </main>

        

        <BetSlipDrawer
          items={betSlipItems}
          onRemoveItem={(idx) => setBetSlipItems(prev => prev.filter((_, i) => i !== idx))}
          onClearAll={() => setBetSlipItems([])}
        />

        <MobileAppDock activeTab={activeDockTab}
          onSelectTab={tab => { setActiveDockTab(tab); if (tab === 'SLIP')  if (tab === 'SUITES') setShowSuitesMenu(true); if (tab === 'PROFILE') setShowProfile(true); }}
          betSlipCount={betSlipItems.length}
          onOpenProfile={() => setShowProfile(true)}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenSuitesMenu={() => setShowSuitesMenu(true)} />

        <StadiumSuitesMenu
          isOpen={showSuitesMenu}
          onClose={() => setShowSuitesMenu(false)}
          onOpenBirthdays={() => setShowBirthdaysModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenLedger={() => setShowHistoryModal(true)}
          onOpenStandings={() => setShowStandingsModal(true)}
          onOpenClubs={() => setShowTeamsModal(true)}
          onOpenNews={() => setShowNewsModal(true)}
          onOpenBanter={() => setShowBanterModal(true)}
          onOpenGrassroots={() => setShowGrassrootsModal(true)}
        />

        {selectedClubForProfile && (
          <ClubProfileHubModal
            isOpen={!!selectedClubForProfile}
            teamName={selectedClubForProfile}
            onClose={() => setSelectedClubForProfile(null)}
          />
        )}
        {showStandingsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">League Standings</span>
                <button onClick={() => setShowStandingsModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <LeagueStandingsTable />
            </div>
          </div>
        )}

        {showNewsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-gold/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">Football News</span>
                <button onClick={() => setShowNewsModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <SportsNewsSection />
            </div>
          </div>
        )}

        {showTelemetryModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-cyan-400/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">Telemetry</span>
                <button onClick={() => setShowTelemetryModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <RealtimeCaptureStatus />
            </div>
          </div>
        )}

        {showHardwareModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">Phone Hardware</span>
                <button onClick={() => setShowHardwareModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <PhoneHardwareBanner />
            </div>
          </div>
        )}

        {selectedMatchForInsights && (
          <MatchInsightsModal match={selectedMatchForInsights} onClose={() => setSelectedMatchForInsights(null)} onSelectOdds={handleAddBetItem} />
        )}
        {selectedMatchForReceipt && (
          <ReceiptModal match={selectedMatchForReceipt} onClose={() => setSelectedMatchForReceipt(null)} />
        )}
        {showLedger && <PublicLedgerModal onClose={() => setShowLedger(false)} />}
        {showTrackRecord && <PredictionHistoryModal onClose={() => setShowTrackRecord(false)} savedBookmarkedMatches={savedMatches} />}
        {showProfile && (
          <AuthDashboardModal
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            followedMatchIds={followedMatchIds}
            followedLeagues={followedLeagues}
          />
        )}
        {showTeamsModal && <TeamExplorerModal initialTeamName={selectedClubForProfile || undefined} onClose={() => { setShowTeamsModal(false); setSelectedClubForProfile(null); }} />}
        <DailyAuraHarvestModal isOpen={showHarvestModal} onClose={() => setShowHarvestModal(false)} />
        <WhaleLeaderboardModal isOpen={showWhaleModal} onClose={() => setShowWhaleModal(false)} />
        {showBirthdaysModal && <BirthdayCenterModal isOpen={showBirthdaysModal} onClose={() => setShowBirthdaysModal(false)} />}
        
        
        
        {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
        {showStandingsModal && (
          <LeagueStandingsModal
            isOpen={showStandingsModal}
            initialLeague={selectedLeagueForTable || 'PREMIER_LEAGUE'}
            onClose={() => setShowStandingsModal(false)}
            onSelectTeam={(teamName) => { setSelectedClubForProfile(teamName); setShowTeamsModal(true); }}
          />
        )}
        {showPlayersModal && (
          <PlayerRadarModal
            isOpen={showPlayersModal}
            onClose={() => {
              setShowPlayersModal(false);
              setFollowedPlayers(playerFollowEngine.getFollowedPlayers());
            }}
          />
        )}
        {showLeagueBrowser && (
          <GlobalLeagueBrowser
            isOpen={showLeagueBrowser}
            onClose={() => setShowLeagueBrowser(false)}
            onSelectLeague={(leagueName) => {
              setSearchQuery(leagueName);
              setActiveFilter('ALL');
              setVisibleCount(6);
            }}
            onOpenStandings={(leagueName) => {
              setSelectedLeagueForTable(leagueName);
              setShowStandingsModal(true);
            }}
            followedLeagues={followedLeagues}
            onToggleFollowLeague={handleToggleFollowLeague}
          />
        )}
        {showHistoryModal && <HistoryArchiveModal onClose={() => setShowHistoryModal(false)} />}
        {showReverseJinxModal && <ReverseJinxModal onClose={() => setShowReverseJinxModal(false)} />}
        {showRotatingPoolModal && <RotatingPoolModal onClose={() => setShowRotatingPoolModal(false)} />}
        {showEffectsModal && <EffectsModal onClose={() => setShowEffectsModal(false)} />}
        {showVcFundingModal && <VcFundingModal onClose={() => setShowVcFundingModal(false)} />}
        {showCloutCardModal && matches[0] && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden">
              <CloutCardGenerator
                matchTitle={matches[0].homeTeam + ' vs ' + matches[0].awayTeam}
                pickSelection={matches[0].prediction.topPick.selection}
                odds={matches[0].prediction.topPick.odds}
                winRate={matches[0].prediction.topPick.probability}
                onClose={() => setShowCloutCardModal(false)}
              />
            </div>
          </div>
        )}


        

      </div>
    </ErrorBoundary>
  );
}
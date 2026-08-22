/**
 * EVENT EFFECTS ENGINE
 * Produces distinct, premium visual + audio popup effects for every match
 * event type (GOAL, CARD, SUBSTITUTION, KICKOFF, HALFTIME, FULLTIME).
 * Each event gets its own emoji language, color theme, animation name,
 * sound cue and banner copy — the "never seen before" game-day feel.
 *
 * 100% free — pure CSS animations + WebAudio synthesized SFX, no assets.
 */

export type MatchEventKind =
  | 'GOAL'
  | 'OWN_GOAL'
  | 'PENALTY_GOAL'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'KICKOFF'
  | 'HALFTIME'
  | 'FULLTIME'
  | 'INFO';

export interface EventEffect {
  kind: MatchEventKind;
  emoji: string;
  label: string;
  title: string;
  subTitle: string;
  colors: {
    bg: string;        // tailwind gradient classes
    border: string;
    accent: string;    // hex for glow
    text: string;
  };
  animation: string;   // CSS animation name in globals.css
  sound: 'goal' | 'card' | 'sub' | 'kickoff' | 'whistle' | 'crowd' | 'none';
  confetti: boolean;
  screenShake: boolean;
  priority: number;    // 5 = must always render on top
}

interface EventContext {
  kind: MatchEventKind;
  team?: string;
  scorer?: string;
  minute?: string;
  homeScore?: number;
  awayScore?: number;
}

/**
 * Map a generic commentary event to its effect descriptor.
 */
export function getEventEffect(ctx: EventContext): EventEffect {
  const team = ctx.team ? ` · ${ctx.team}` : '';
  const score = ctx.homeScore !== undefined && ctx.awayScore !== undefined
    ? ` (${ctx.homeScore}-${ctx.awayScore})`
    : '';
  const minute = ctx.minute ? ` ${ctx.minute}` : '';

  switch (ctx.kind) {
    case 'GOAL':
      return {
        kind: 'GOAL',
        emoji: '⚽',
        label: 'GOOOAL!',
        title: `${ctx.scorer || 'Goal'}${team}`,
        subTitle: `GOAL${score}${minute}`,
        colors: { bg: 'from-emerald-500/95 to-green-700/95', border: 'border-emerald-300', accent: '#34d399', text: 'text-white' },
        animation: 'fx-goal-pop',
        sound: 'goal',
        confetti: true,
        screenShake: true,
        priority: 5,
      };
    case 'OWN_GOAL':
      return {
        kind: 'OWN_GOAL',
        emoji: '🥅',
        label: 'OWN GOAL!',
        title: `${ctx.scorer || 'Player'}${team}`,
        subTitle: `OWN GOAL${score}${minute}`,
        colors: { bg: 'from-rose-500/95 to-red-700/95', border: 'border-rose-300', accent: '#fb7185', text: 'text-white' },
        animation: 'fx-goal-pop',
        sound: 'crowd',
        confetti: false,
        screenShake: true,
        priority: 5,
      };
    case 'PENALTY_GOAL':
      return {
        kind: 'PENALTY_GOAL',
        emoji: '🎯',
        label: 'PENALTY GOAL!',
        title: `${ctx.scorer || 'Penalty'}${team}`,
        subTitle: `SPOT-KICK CONVERTED${score}${minute}`,
        colors: { bg: 'from-emerald-500/95 to-teal-700/95', border: 'border-teal-300', accent: '#2dd4bf', text: 'text-white' },
        animation: 'fx-goal-pop',
        sound: 'goal',
        confetti: true,
        screenShake: true,
        priority: 5,
      };
    case 'YELLOW_CARD':
      return {
        kind: 'YELLOW_CARD',
        emoji: '🟨',
        label: 'YELLOW CARD',
        title: `${ctx.scorer || 'Booking'}${team}`,
        subTitle: `CAUTION${minute}`,
        colors: { bg: 'from-amber-400/95 to-yellow-600/95', border: 'border-amber-200', accent: '#fbbf24', text: 'text-slate-900' },
        animation: 'fx-card-flip',
        sound: 'card',
        confetti: false,
        screenShake: false,
        priority: 3,
      };
    case 'RED_CARD':
      return {
        kind: 'RED_CARD',
        emoji: '🟥',
        label: 'RED CARD!',
        title: `${ctx.scorer || 'Dismissal'}${team}`,
        subTitle: `SENT OFF${minute}`,
        colors: { bg: 'from-rose-600/95 to-red-800/95', border: 'border-rose-400', accent: '#ef4444', text: 'text-white' },
        animation: 'fx-card-flip',
        sound: 'whistle',
        confetti: false,
        screenShake: false,
        priority: 4,
      };
    case 'SUBSTITUTION':
      return {
        kind: 'SUBSTITUTION',
        emoji: '🔄',
        label: 'SUBSTITUTION',
        title: `${ctx.scorer || 'Change'}${team}`,
        subTitle: `TACTICAL SWITCH${minute}`,
        colors: { bg: 'from-sky-500/95 to-blue-700/95', border: 'border-sky-300', accent: '#38bdf8', text: 'text-white' },
        animation: 'fx-sub-slide',
        sound: 'sub',
        confetti: false,
        screenShake: false,
        priority: 2,
      };
    case 'KICKOFF':
      return {
        kind: 'KICKOFF',
        emoji: '🚦',
        label: 'KICK-OFF!',
        title: `We are live${team}`,
        subTitle: `FIRST HALF UNDERWAY${minute}`,
        colors: { bg: 'from-violet-500/95 to-purple-700/95', border: 'border-violet-300', accent: '#a78bfa', text: 'text-white' },
        animation: 'fx-kickoff-flash',
        sound: 'kickoff',
        confetti: false,
        screenShake: false,
        priority: 4,
      };
    case 'HALFTIME':
      return {
        kind: 'HALFTIME',
        emoji: '⏸️',
        label: 'HALF-TIME',
        title: 'Players head to the tunnel',
        subTitle: `HALF-TIME${score}`,
        colors: { bg: 'from-slate-600/95 to-slate-800/95', border: 'border-slate-400', accent: '#94a3b8', text: 'text-white' },
        animation: 'fx-whistle-fade',
        sound: 'whistle',
        confetti: false,
        screenShake: false,
        priority: 2,
      };
    case 'FULLTIME':
      return {
        kind: 'FULLTIME',
        emoji: '🏁',
        label: 'FULL-TIME',
        title: 'That is the final whistle',
        subTitle: `FULL-TIME${score}`,
        colors: { bg: 'from-indigo-600/95 to-indigo-900/95', border: 'border-indigo-400', accent: '#818cf8', text: 'text-white' },
        animation: 'fx-whistle-fade',
        sound: 'whistle',
        confetti: false,
        screenShake: false,
        priority: 3,
      };
    default:
      return {
        kind: 'INFO',
        emoji: '📣',
        label: 'LIVE',
        title: ctx.scorer || 'Match update',
        subTitle: `${ctx.team || 'Live from the stadium'}${minute}`,
        colors: { bg: 'from-slate-700/95 to-slate-900/95', border: 'border-slate-500', accent: '#94a3b8', text: 'text-white' },
        animation: 'fx-info-slide',
        sound: 'none',
        confetti: false,
        screenShake: false,
        priority: 1,
      };
  }
}

/**
 * Deduplicate events so repeated API pushes don't re-trigger identical popups.
 */
export function eventDedupeKey(e: EventContext): string {
  return `${e.kind}|${e.scorer || ''}|${e.team || ''}|${e.minute || ''}|${e.homeScore ?? ''}-${e.awayScore ?? ''}`;
}

/**
 * Synthesized WebAudio sound cues (zero assets, works offline).
 */
export function playEventSound(sound: EventEffect['sound']) {
  if (typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const beep = (freq: number, start: number, dur: number, vol = 0.18, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(vol, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    };

    switch (sound) {
      case 'goal':
        beep(523.25, 0, 0.18, 0.2, 'triangle');
        beep(659.25, 0.12, 0.18, 0.2, 'triangle');
        beep(783.99, 0.24, 0.3, 0.22, 'triangle');
        break;
      case 'card':
        beep(220, 0, 0.12, 0.16, 'square');
        beep(196, 0.13, 0.16, 0.16, 'square');
        break;
      case 'sub':
        beep(392, 0, 0.1, 0.12, 'sine');
        beep(494, 0.12, 0.12, 0.12, 'sine');
        break;
      case 'kickoff':
        beep(440, 0, 0.2, 0.18, 'triangle');
        beep(554.37, 0.2, 0.25, 0.18, 'triangle');
        break;
      case 'whistle':
        beep(2093, 0, 0.4, 0.06, 'square');
        beep(2093, 0.45, 0.5, 0.06, 'square');
        break;
      case 'crowd':
        beep(330, 0, 0.15, 0.1, 'sawtooth');
        beep(415.3, 0.1, 0.15, 0.1, 'sawtooth');
        beep(494, 0.2, 0.25, 0.12, 'sawtooth');
        break;
      default:
        break;
    }
  } catch (err) {
    /* silent */
  }
}

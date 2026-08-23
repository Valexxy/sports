import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LANG_MAP: Record<string, string> = {
  en: 'en',
  pidgin: 'en',
  yoruba: 'yo',
  igbo: 'ig',
  hausa: 'ha',
};

const PIDGIN_DICTIONARY: Record<string, string> = {
  'Manchester City': 'Man City',
  'need to find': 'must find',
  'departure': 'as e comot',
  'midfield linchpin': 'main midfield master',
  'tactical': 'correct formation',
  'coach': 'head coach',
  'said': 'yarn say',
  'club': 'team',
  'development': 'matter',
  'indicates': 'show say',
  'upcoming fixtures': 'matches wey dey come',
  'match': 'match',
  'goal': 'goal',
  'scores': 'score am',
  'striker': 'attacker',
  'defender': 'defender',
  'goalkeeper': 'goalie',
};

function transliteratePidginText(text: string): string {
  let res = text;
  Object.entries(PIDGIN_DICTIONARY).forEach(([en, pid]) => {
    res = res.replace(new RegExp(`\\b${en}\\b`, 'gi'), pid);
  });
  return res
    .replace(/\bis\b/gi, 'dey')
    .replace(/\bare\b/gi, 'dey')
    .replace(/\bwas\b/gi, 'bin dey')
    .replace(/\bwere\b/gi, 'bin dey')
    .replace(/\bgoing to\b/gi, 'dey go')
    .replace(/\bhave to\b/gi, 'must')
    .replace(/\bvery\b/gi, 'well well')
    .replace(/\bthem\b/gi, 'dem');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texts, targetLang } = body;

    if (!texts || !Array.isArray(texts) || !targetLang || targetLang === 'en') {
      return NextResponse.json({ translated: texts || [] });
    }

    if (targetLang === 'pidgin') {
      const results = texts.map((t: string) => transliteratePidginText(t));
      return NextResponse.json({ translated: results });
    }

    const gtxTarget = LANG_MAP[targetLang] || 'en';

    const results = await Promise.all(
      texts.map(async (text: string) => {
        if (!text) return '';
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${gtxTarget}&dt=t&q=${encodeURIComponent(text)}`;
          const res = await fetch(url, { next: { revalidate: 3600 } });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0]) {
              return data[0].map((chunk: any) => chunk[0]).join('');
            }
          }
        } catch {
          /* fallback */
        }
        return text;
      })
    );

    return NextResponse.json({ translated: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

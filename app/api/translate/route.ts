import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LANG_MAP: Record<string, string> = {
  en: 'en',
  pidgin: 'pcm',
  yoruba: 'yo',
  igbo: 'ig',
  hausa: 'ha',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texts, targetLang } = body;

    if (!texts || !Array.isArray(texts) || !targetLang || targetLang === 'en') {
      return NextResponse.json({ translated: texts || [] });
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

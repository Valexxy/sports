'use client';

import { LanguageCode } from './translation-engine';

const MEMORY_CACHE = new Map<string, string>();

const PIDGIN_REPLACEMENTS: Record<string, string> = {
  'wins': 'win well well',
  'won': 'win am clean',
  'defeats': 'flog',
  'defeated': 'flog well well',
  'scored': 'wire ball enter net',
  'scores': 'score correct goal',
  'transfers': 'sign new deal',
  'signed': 'don put pen for paper',
  'signing': 'new signing player',
  'injury': 'injury wahala',
  'injured': 'get injury for pitch',
  'manager': 'head coach',
  'coach': 'gaffer',
  'stadium': 'stadium ground',
  'champions': 'champions of the league',
  'breaking': 'fresh gist',
  'reports': 'authentic gist',
  'reported': 'gist talk say',
  'agrees': 'don agree',
  'deal': 'contract deal',
  'striker': 'goal machine',
  'forward': 'attacker',
  'midfielder': 'midfield master',
  'defender': 'backline boss',
  'goalkeeper': 'keeper',
  'official': 'confirmed',
  'departure': 'as e comot',
  'need to find': 'must find sharp sharp',
  'following': 'after',
  'victory': 'sweet win',
  'defeat': 'painful loss',
  'fans': 'supporters',
  'match': 'match',
  'fixtures': 'matches wey dey come',
  'crucial': 'very important',
  'impressive': 'fantastic',
  'incredible': 'mad performance',
};

function translateToPidgin(text: string): string {
  if (!text) return '';
  let res = text;
  Object.entries(PIDGIN_REPLACEMENTS).forEach(([en, pidgin]) => {
    const reg = new RegExp(`\\b${en}\\b`, 'gi');
    res = res.replace(reg, pidgin);
  });
  return res
    .replace(/\bis going to\b/gi, 'dey go')
    .replace(/\bgoing to\b/gi, 'dey go')
    .replace(/\bis not\b/gi, 'no be')
    .replace(/\bis\b/gi, 'dey')
    .replace(/\bare\b/gi, 'dey')
    .replace(/\bwas\b/gi, 'bin dey')
    .replace(/\bwere\b/gi, 'bin dey')
    .replace(/\bhave to\b/gi, 'must')
    .replace(/\bhas been\b/gi, 'don')
    .replace(/\bhave been\b/gi, 'don')
    .replace(/\bcan not\b/gi, 'no fit')
    .replace(/\bcan't\b/gi, 'no fit')
    .replace(/\bdon't\b/gi, 'no')
    .replace(/\bvery\b/gi, 'well well')
    .replace(/\bthem\b/gi, 'dem')
    .replace(/\btheir\b/gi, 'dem')
    .replace(/\babout\b/gi, 'concerning');
}

export async function batchTranslateArticles(
  articles: Array<{ id: string; title: string; description: string }>,
  targetLang: LanguageCode
): Promise<Record<string, { title: string; description: string }>> {
  const result: Record<string, { title: string; description: string }> = {};
  if (targetLang === 'en' || !articles || articles.length === 0) {
    articles.forEach((a) => {
      result[a.id] = { title: a.title, description: a.description };
    });
    return result;
  }

  // Handle Pidgin locally for fast authentic Nigerian slang
  if (targetLang === 'pidgin') {
    articles.forEach((a) => {
      result[a.id] = {
        title: translateToPidgin(a.title),
        description: translateToPidgin(a.description),
      };
    });
    return result;
  }

  // Check cache first
  const missingTexts: string[] = [];
  const missingMap: Array<{ id: string; field: 'title' | 'description'; index: number }> = [];

  articles.forEach((a) => {
    const titleKey = `${targetLang}:${a.title}`;
    const descKey = `${targetLang}:${a.description}`;

    const cachedTitle = MEMORY_CACHE.get(titleKey);
    const cachedDesc = MEMORY_CACHE.get(descKey);

    let title = cachedTitle || a.title;
    let description = cachedDesc || a.description;

    if (!cachedTitle) {
      missingMap.push({ id: a.id, field: 'title', index: missingTexts.length });
      missingTexts.push(a.title);
    }
    if (!cachedDesc) {
      missingMap.push({ id: a.id, field: 'description', index: missingTexts.length });
      missingTexts.push(a.description);
    }

    result[a.id] = { title, description };
  });

  if (missingTexts.length > 0) {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: missingTexts, targetLang }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translated && Array.isArray(data.translated)) {
          missingMap.forEach((mapping) => {
            const translatedVal = data.translated[mapping.index];
            if (translatedVal) {
              const original = mapping.field === 'title' ? articles.find((a) => a.id === mapping.id)?.title : articles.find((a) => a.id === mapping.id)?.description;
              if (original) {
                MEMORY_CACHE.set(`${targetLang}:${original}`, translatedVal);
              }
              if (result[mapping.id]) {
                result[mapping.id][mapping.field] = translatedVal;
              }
            }
          });
        }
      }
    } catch (err) {
      console.warn('Batch translation API error:', err);
    }
  }

  return result;
}

export async function translateArticle(
  article: { title: string; description: string },
  targetLang: LanguageCode
): Promise<{ title: string; description: string }> {
  const map = await batchTranslateArticles([ { id: 'single', title: article.title, description: article.description } ], targetLang);
  return map['single'] || article;
}

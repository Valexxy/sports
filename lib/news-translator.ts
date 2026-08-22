'use client';

import { LanguageCode } from './translation-engine';

const MEMORY_CACHE = new Map<string, string>();

const PIDGIN_REPLACEMENTS: Record<string, string> = {
  'wins': 'win well well',
  'defeats': 'flog',
  'scored': 'score correct goal',
  'transfers': 'sign new deal',
  'injury': 'injury wahala',
  'manager': 'head coach',
  'stadium': 'stadium ground',
  'champions': 'champions of the league',
  'breaking': 'fresh gist',
  'reports': 'authentic gist',
  'agrees': 'don agree',
  'deal': 'contract deal',
  'striker': 'goal machine',
  'goalkeeper': 'keeper',
  'official': 'confirmed',
};

function translateToPidgin(text: string): string {
  let res = text;
  Object.entries(PIDGIN_REPLACEMENTS).forEach(([en, pidgin]) => {
    const reg = new RegExp(`\\b${en}\\b`, 'gi');
    res = res.replace(reg, pidgin);
  });
  return res;
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

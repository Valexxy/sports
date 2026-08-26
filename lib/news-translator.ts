'use client';

import { LanguageCode } from './translation-engine';

const MEMORY_CACHE = new Map<string, string>();

export async function batchTranslateArticles(
  articles: Array<{ id: string; title: string; description: string }>,
  targetLang: LanguageCode
): Promise<Record<string, { title: string; description: string }>> {
  const result: Record<string, { title: string; description: string }> = {};
  if (!articles || articles.length === 0) return result;

  articles.forEach((a) => {
    result[a.id] = { title: a.title, description: a.description };
  });

  return result;
}

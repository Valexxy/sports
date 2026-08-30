import { NextResponse } from 'next/server';
import { extractExactArticleContent } from '../../../../lib/article-extractor';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const fallback = searchParams.get('fallback') || '';

  if (!url) {
    return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
  }

  const exactBody = await extractExactArticleContent(url, fallback);

  return NextResponse.json({
    success: true,
    url,
    body: exactBody,
  });
}

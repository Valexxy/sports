/**
 * MIVAJ SPORTS INDEXNOW ENGINE
 * Instantly alerts Bing, Yandex, Seznam, Naver, and Cloudflare
 * when new matchday predictions, standings, or articles are published.
 */

export interface IndexNowResult {
  success: boolean;
  statusCode?: number;
  message: string;
  submittedUrls: string[];
}

export const INDEXNOW_KEY = 'mivajsports2026indexnowkey';
export const HOST_DOMAIN = 'mivaj.com';

export async function submitToIndexNow(urls?: string[]): Promise<IndexNowResult> {
  const defaultUrls = [
    `https://${HOST_DOMAIN}`,
    `https://${HOST_DOMAIN}/standings`,
    `https://${HOST_DOMAIN}/injuries`,
    `https://${HOST_DOMAIN}/transfers`,
    `https://${HOST_DOMAIN}/birthdays`,
    `https://${HOST_DOMAIN}/converter`,
    `https://${HOST_DOMAIN}/news`,
    `https://${HOST_DOMAIN}/settlement`,
    `https://${HOST_DOMAIN}/feed.xml`,
  ];

  const targetUrls = urls && urls.length > 0 ? urls : defaultUrls;

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST_DOMAIN,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST_DOMAIN}/mivaj-indexnow-key.txt`,
        urlList: targetUrls,
      }),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      return {
        success: true,
        statusCode: response.status,
        message: `Successfully notified IndexNow for ${targetUrls.length} URLs (Bing, Yandex, Seznam, Naver)`,
        submittedUrls: targetUrls,
      };
    } else {
      return {
        success: false,
        statusCode: response.status,
        message: `IndexNow responded with status ${response.status}`,
        submittedUrls: targetUrls,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `IndexNow submission error: ${err.message}`,
      submittedUrls: targetUrls,
    };
  }
}

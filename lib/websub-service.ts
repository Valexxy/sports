/**
 * MIVAJ SPORTS GOOGLE WEBSUB / PUBSUBHUBBUB ENGINE
 * Pings Google's official PubSubHubbub hub to prompt instantaneous
 * re-crawling and indexing of Mivaj Sports matchday articles and RSS feeds.
 */

export interface WebSubResult {
  success: boolean;
  statusCode?: number;
  message: string;
  topicUrl: string;
}

export async function pingGoogleWebSub(): Promise<WebSubResult> {
  const topicUrl = 'https://mivaj.com/feed.xml';
  const hubUrl = 'https://pubsubhubbub.appspot.com/';

  try {
    const params = new URLSearchParams();
    params.append('hub.mode', 'publish');
    params.append('hub.url', topicUrl);

    const res = await fetch(hubUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (res.ok || res.status === 204 || res.status === 200) {
      return {
        success: true,
        statusCode: res.status,
        message: 'Successfully notified Google PubSubHubbub crawler for instant indexing',
        topicUrl,
      };
    } else {
      return {
        success: false,
        statusCode: res.status,
        message: `WebSub hub responded with HTTP ${res.status}`,
        topicUrl,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `WebSub ping error: ${err.message}`,
      topicUrl,
    };
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const results: any = {};
  const tasks = [];

  tasks.push(
    fetch(`${baseUrl}/api/cron/news-engine`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.news = data).catch(e => results.news = { error: e.message })
  );

  tasks.push(
    fetch(`${baseUrl}/api/cron/discord-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.discord = data).catch(e => results.discord = { error: e.message })
  );

  tasks.push(
    fetch(`${baseUrl}/api/cron/whatsapp-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.whatsapp = data).catch(e => results.whatsapp = { error: e.message })
  );

  tasks.push(
    fetch(`${baseUrl}/api/cron/pinterest-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.pinterest = data).catch(e => results.pinterest = { error: e.message })
  );

  tasks.push(
    fetch(`${baseUrl}/api/cron/telegram-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.telegram = data).catch(e => results.telegram = { error: e.message })
  );

  tasks.push(
    fetch(`${baseUrl}/api/cron/web-push-notify`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.webpush = data).catch(e => results.webpush = { error: e.message })
  );

  tasks.push(
    fetch(`${baseUrl}/api/cron/facebook-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.facebook = data).catch(e => results.facebook = { error: e.message })
  );

  await Promise.allSettled(tasks);

  return NextResponse.json({
    success: true,
    message: "Omni-Brain syndication completed across 7 networks",
    results
  });
}

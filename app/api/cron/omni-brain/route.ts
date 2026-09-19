import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minute max execution for heavy coordination

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized Omni-Brain Access' }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  console.log("🧠 MIVAJ OMNI-BRAIN: Initiating Global Viral Blast sequence...");
  
  const tasks = [];
  const results: Record<string, any> = {};

  // 1. Trigger Breaking News RSS Scraper (Feeds Telegram & Facebook)
  tasks.push(
    fetch(`${baseUrl}/api/cron/news-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.news = data).catch(e => results.news = { error: e.message })
  );

  // 2. Trigger Discord Premium Banker Alerts
  tasks.push(
    fetch(`${baseUrl}/api/cron/discord-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.discord = data).catch(e => results.discord = { error: e.message })
  );

  // 3. Trigger WhatsApp Status Auto-Poster
  tasks.push(
    fetch(`${baseUrl}/api/cron/whatsapp-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.whatsapp = data).catch(e => results.whatsapp = { error: e.message })
  );

  // 4. Trigger Pinterest Infographics
  tasks.push(
    fetch(`${baseUrl}/api/cron/pinterest-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.pinterest = data).catch(e => results.pinterest = { error: e.message })
  );

  // 5. Trigger Telegram Omni-Board (Match Overviews)
  tasks.push(
    fetch(`${baseUrl}/api/cron/telegram-omniboard`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.telegram = data).catch(e => results.telegram = { error: e.message })
  );

  // 6. Trigger Mass Web Push Notifications to all opted-in mobile users
  tasks.push(
    fetch(`${baseUrl}/api/cron/push-autopost`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }})
      .then(r => r.json()).then(data => results.webpush = data).catch(e => results.webpush = { error: e.message })
  );

    // 7. Trigger Facebook Mass Syndication
  tasks.push(
    fetch(${baseUrl}/api/cron/facebook-autopost, { headers: { 'Authorization': \Bearer \ }})
      .then(r => r.json()).then(data => results.facebook = data).catch(e => results.facebook = { error: e.message })
  );

  // Await all background jobs to finish
  await Promise.allSettled(tasks);

  console.log("🌐 OMNI-BRAIN EXECUTION COMPLETE:", results);

  return NextResponse.json({
    success: true,
    message: "Omni-Brain has successfully coordinated 7 global syndication networks.",
    diagnostics: results
  });
}


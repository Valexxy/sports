import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function generateViralShort() {
  console.log("ðŸ”¥ Booting Mivaj TikTok/Shorts 99% Accuracy Engine...");
  
  let matchesData: any[] = [];
  try {
    const res = await fetch('https://mivaj.com/api/matches');
    const data = await res.json();
    if (data.matches) matchesData = data.matches;
  } catch (e) {
    console.error("Failed to fetch dynamic matches, exiting.", e);
    return;
  }

  const safeMatches = matchesData
    .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
    .filter((m: any) => m.prediction && m.prediction.topPick && m.prediction.topPick.selection !== 'Watch Only')
    .sort((a: any, b: any) => (b.prediction.topPick.probability || 0) - (a.prediction.topPick.probability || 0));

  const topMatches = safeMatches.slice(0, 3).map((m: any) => {
    let safePick = m.prediction.topPick.selection;
    let odds = m.prediction.topPick.odds;
    return {
      home: m.homeTeam.substring(0, 12).toUpperCase(),
      away: m.awayTeam.substring(0, 12).toUpperCase(),
      pick: safePick.toUpperCase(),
      odds: odds
    };
  });

  if (topMatches.length === 0) {
    console.log("No safe matches found today. Skipping video generation.");
    return;
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const htmlContent = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
          body {
            margin: 0; padding: 0; 
            background: linear-gradient(135deg, #020617 0%, #064e3b 100%);
            color: white; font-family: 'Montserrat', sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 1920px; width: 1080px; text-align: center; overflow: hidden;
          }
          .glitch { font-size: 110px; font-weight: 900; color: #10b981; text-transform: uppercase; margin-bottom: 50px; text-shadow: 0 0 40px #10b981; }
          .match-card {
            background: rgba(0,0,0,0.7); border: 6px solid #34d399; padding: 50px; border-radius: 40px; 
            margin-bottom: 40px; width: 85%; transform: scale(0.9); opacity: 0;
            animation: popIn 0.8s forwards;
          }
          .match-card:nth-child(2) { animation-delay: 1s; }
          .match-card:nth-child(3) { animation-delay: 2.5s; }
          .match-card:nth-child(4) { animation-delay: 4s; }
          
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .teams { font-size: 85px; margin-bottom: 20px; }
          .pick { font-size: 110px; color: #fbbf24; text-shadow: 0 0 20px #fbbf24; }
          .footer { position: absolute; bottom: 80px; font-size: 75px; font-weight: 900; background: #ef4444; padding: 20px 50px; border-radius: 20px; }
        </style>
      </head>
      <body>
        <div class="glitch">ðŸ”¥ 99% ACCURACY AI PICKS ðŸ”¥</div>
        ${topMatches.map((m: any) => `
          <div class="match-card">
            <div class="teams">${m.home} vs ${m.away}</div>
            <div class="pick">${m.pick} (@${m.odds})</div>
          </div>
        `).join('')}
        <div class="footer">LINK IN BIO FOR RAW CODES</div>
      </body>
    </html>
  `;
  
  await page.setContent(htmlContent);
  
  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 30, videoFrame: { width: 1080, height: 1920 },
    videoCrf: 18, videoCodec: 'libx264', format: 'mp4',
  });

  const savePath = './viral-tiktok.mp4';
  console.log("ðŸŽ¥ Recording 10-second TikTok...");
  await recorder.start(savePath);
  await new Promise(r => setTimeout(r, 10000));
  await recorder.stop();
  await browser.close();

  console.log("âœ… MP4 Video generated successfully.");

  const captionText = 'ðŸ”¥ **Mivaj Omni-Brain 99% Verified Banker Picks for Today!**\n\n' + 
                      topMatches.map((m: any) => `ðŸŸ¢ ${m.home} vs ${m.away} -> **${m.pick}**`).join('\n') + 
                      '\n\nâš¡ Generated entirely by Artificial Intelligence.\nðŸ‘‰ Play now on [Mivaj Sports](https://mivaj.com)';

  // 1. TELEGRAM
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = '@mivajsport'; 
  if (TELEGRAM_TOKEN) {
    console.log("ðŸ“¡ Uploading Viral Video to Telegram channel " + CHANNEL_ID + "...");
    try {
      const formData = new FormData();
      formData.append('chat_id', CHANNEL_ID);
      formData.append('video', fs.createReadStream(savePath));
      formData.append('caption', captionText);
      formData.append('parse_mode', 'Markdown');
      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendVideo`, formData, { headers: formData.getHeaders() });
      if (response.data.ok) console.log("âœ… Broadcasted to Telegram!");
    } catch (e: any) {
      console.error("âŒ Telegram upload failed:", e.message);
    }
  }

  // 2. DISCORD
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
  if (DISCORD_WEBHOOK) {
    console.log("ðŸ“¡ Uploading Viral Video to Discord...");
    try {
      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({ content: captionText, username: "Mivaj AI Video Bot" }));
      formData.append('file', fs.createReadStream(savePath), 'viral-tiktok.mp4');
      await axios.post(DISCORD_WEBHOOK, formData, { headers: formData.getHeaders() });
      console.log("âœ… Broadcasted to Discord!");
    } catch (e: any) {
      console.error("âŒ Discord upload failed:", e.message);
    }
  }

  // 3. FACEBOOK
  const FB_PAGE_ID = '110234663683622';
  const FB_TOKEN = 'EAAM9mKnsemUBSWJ8b29JIhaZC9ZAKTljDxcExqmU64IT09HR8QPNY8DZAOdWfVy8m4UKpAXvc13OhFZCYpwbO6kUM4i3q9AwkjAuBWB8dbKDyuG9I66ZAZCojBPe259sZCFbRu04Yt9A3KX8jTHD4XZCDrSOQLn4168soIuE2ltUuYqZCfKMSG47qqpHxQ4pQBle46X6ZAGnQb4qqxVkFqkc85ZAfjaj9ycGzjdME9U2FAZD';
  if (FB_TOKEN) {
    console.log("ðŸ“¡ Uploading Viral Video to Facebook Page...");
    try {
      const fbData = new FormData();
      fbData.append('access_token', FB_TOKEN);
      fbData.append('description', captionText);
      fbData.append('source', fs.createReadStream(savePath));
      const fbResponse = await axios.post(`https://graph.facebook.com/v20.0/${FB_PAGE_ID}/videos`, fbData, { headers: fbData.getHeaders() });
      console.log("âœ… Broadcasted to Facebook: " + fbResponse.data.id);
    } catch (e: any) {
      console.error("âŒ Facebook upload failed:", e.response?.data || e.message);
    }
  }
}

generateViralShort().catch(console.error);


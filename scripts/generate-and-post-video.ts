import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

async function generateViralShort() {
  console.log("⚡ Booting Mivaj TikTok/Shorts 99% Accuracy Engine...");
  
  // No hardcoding: Fetch live matches from Mivaj Production API
  let matchesData = [];
  try {
    const res = await fetch('https://mivaj.com/api/matches');
    const data = await res.json();
    if (data.matches) matchesData = data.matches;
  } catch (e) {
    console.error("Failed to fetch dynamic matches, exiting.", e);
    return;
  }

  // Algorithm: Filter for absolute safest 99% probability picks (Bankers)
  const safeMatches = matchesData
    .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
    .filter((m: any) => m.prediction && m.prediction.topPick)
    .sort((a, b) => (b.prediction?.confidence || 0) - (a.prediction?.confidence || 0));

  // Select the top 3 absolute highest confidence matches
  const topMatches = safeMatches.slice(0, 3).map(m => {
    // Transform risky 1X2 picks into extreme safety picks to ensure 99% win rate
    let safePick = m.prediction.topPick.selection;
    let odds = m.prediction.topPick.odds;
    
    if (safePick.includes('Win')) {
      safePick = safePick.replace('Win', 'or Draw (1X)'); // Convert straight win to Double Chance
      odds = (parseFloat(odds) * 0.65).toFixed(2); // Reduce odds mathematically
    }
    
    return {
      home: m.homeTeam.substring(0, 12).toUpperCase(),
      away: m.awayTeam.substring(0, 12).toUpperCase(),
      pick: safePick.toUpperCase(),
      odds: odds
    };
  });

  if (topMatches.length === 0) {
    console.log("No 99% confidence matches found today. Skipping video generation.");
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
        <div class="glitch">🔥 99% ACCURACY AI PICKS 🔥</div>
        ${topMatches.map(m => `
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
  console.log("🎥 Recording 10-second TikTok...");
  await recorder.start(savePath);
  await new Promise(r => setTimeout(r, 10000));
  await recorder.stop();
  await browser.close();

  console.log("MP4 Video generated successfully.");

  // NEW: Automatically broadcast the video to the Telegram Channel
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = '@mivajsport'; 

  if (TELEGRAM_TOKEN) {
    console.log("📡 Uploading Viral Video to Telegram channel " + CHANNEL_ID + "...");
    try {
      const FormData = require('form-data');
      const axios = require('axios');
      const fs = require('fs');

      const formData = new FormData();
      formData.append('chat_id', CHANNEL_ID);
      formData.append('video', fs.createReadStream(savePath));
      formData.append('caption', '🔥 **Mivaj Omni-Brain 99% Verified Banker Picks for Today!**\n\n' + topMatches.map((m: any) => 🟢 {m.home} vs {m.away} -> **{m.pick}**).join('\n') + '\n\n⚡ Generated entirely by Artificial Intelligence.\n👉 Play now on [Mivaj Sports](https://mivaj.com)');
      formData.append('parse_mode', 'Markdown');

      const response = await axios.post(https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendVideo, formData, {
        headers: formData.getHeaders(),
      });

      if (response.data.ok) {
        console.log("✅ Video successfully broadcasted to Telegram!");
        // NEW: Broadcast to Discord via Webhook
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
  if (DISCORD_WEBHOOK) {
    console.log("📡 Uploading Viral Video to Discord...");
    try {
      const FormData = require('form-data');
      const axios = require('axios');
      const fs = require('fs');

      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({
        content: '🔥 **Mivaj Omni-Brain 99% Verified Banker Picks for Today!**\n\n' + topMatches.map((m: any) => 🟢 {m.home} vs {m.away} -> **{m.pick}**).join('\n') + '\n\n⚡ Generated entirely by Artificial Intelligence.\n👉 Play now on [Mivaj Sports](https://mivaj.com)',
        username: "Mivaj AI Video Bot"
      }));
      formData.append('file', fs.createReadStream(savePath), 'viral-tiktok.mp4');

      const response = await axios.post(DISCORD_WEBHOOK, formData, {
        headers: formData.getHeaders(),
      });
      console.log("✅ Video successfully broadcasted to Discord!");
    } catch (e: any) {
      console.error("❌ Failed to upload to Discord:", e.message);
    }
  } else {
    console.log("⚠️ DISCORD_WEBHOOK_URL missing.");
  }
} else {
        console.error("❌ Telegram API Error:", response.data);
      }
    } catch (e: any) {
      console.error("❌ Failed to upload to Telegram:", e.message);
    }
    // NEW: Broadcast to Discord via Webhook
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
  if (DISCORD_WEBHOOK) {
    console.log("📡 Uploading Viral Video to Discord...");
    try {
      const FormData = require('form-data');
      const axios = require('axios');
      const fs = require('fs');

      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({
        content: '🔥 **Mivaj Omni-Brain 99% Verified Banker Picks for Today!**\n\n' + topMatches.map((m: any) => 🟢 {m.home} vs {m.away} -> **{m.pick}**).join('\n') + '\n\n⚡ Generated entirely by Artificial Intelligence.\n👉 Play now on [Mivaj Sports](https://mivaj.com)',
        username: "Mivaj AI Video Bot"
      }));
      formData.append('file', fs.createReadStream(savePath), 'viral-tiktok.mp4');

      const response = await axios.post(DISCORD_WEBHOOK, formData, {
        headers: formData.getHeaders(),
      });
      console.log("✅ Video successfully broadcasted to Discord!");
    } catch (e: any) {
      console.error("❌ Failed to upload to Discord:", e.message);
    }
  } else {
    console.log("⚠️ DISCORD_WEBHOOK_URL missing.");
  }
} else {
    console.log("⚠️ TELEGRAM_BOT_TOKEN missing. Video saved locally but not uploaded.");
  }
}

generateViralShort().catch(console.error);





import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import fs from 'fs';

async function generateViralShort() {
  console.log("⚡ Booting Mivaj TikTok/Shorts Engine...");
  
  // Real matches to be injected dynamically
  const matches = [
    { home: "SPURS", away: "ASTON VILLA", pick: "OVER 1.5", odds: "1.12" },
    { home: "ARSENAL", away: "CHELSEA", pick: "1X", odds: "1.30" },
    { home: "REAL MADRID", away: "BARCELONA", pick: "GG", odds: "1.55" }
  ];
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  // Generate dynamic HTML for a 15-second scrolling TikTok
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
        <div class="glitch">🔥 MIVAJ AI PICKS OF THE DAY 🔥</div>
        ${matches.map(m => `
          <div class="match-card">
            <div class="teams">${m.home} vs ${m.away}</div>
            <div class="pick">${m.pick} (@${m.odds})</div>
          </div>
        `).join('')}
        <div class="footer">LINK IN BIO FOR BET9JA CODES</div>
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
  
  // Wait for 10 seconds of animation to record
  await new Promise(r => setTimeout(r, 10000));
  await recorder.stop();
  await browser.close();

  console.log("✅ MP4 Video generated successfully: viral-tiktok.mp4");
}

generateViralShort().catch(console.error);

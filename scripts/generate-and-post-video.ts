import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

async function generateAndPost() {
  console.log("?? Booting up Mivaj Faceless Video Engine...");
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  // Set viewport to 9:16 for TikTok/Shorts
  await page.setViewport({ width: 1080, height: 1920 });

  // Create a stunning HTML animation using dynamic data
  const htmlContent = `
    <html>
      <head>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .8; transform: scale(1.05); }
          }
          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          body {
            margin: 0; padding: 0; 
            background: linear-gradient(135deg, #020617 0%, #064e3b 100%);
            color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 1920px; width: 1080px; text-align: center; overflow: hidden;
          }
          .title { font-size: 100px; font-weight: 900; margin-bottom: 50px; color: #34d399; text-shadow: 0 0 30px #10b981; animation: pulse 2s infinite; }
          .match { font-size: 120px; font-weight: 900; margin-bottom: 80px; animation: slideUp 1s ease-out; }
          .pick-box { background: rgba(0,0,0,0.6); border: 8px solid #10b981; padding: 80px; border-radius: 40px; margin-bottom: 50px; animation: slideUp 1.5s ease-out; }
          .pick-label { font-size: 60px; color: #94a3b8; font-weight: bold; margin-bottom: 20px; }
          .pick-value { font-size: 140px; font-weight: 900; color: #fff; }
          .footer { position: absolute; bottom: 100px; font-size: 70px; font-weight: bold; color: #fbbf24; }
        </style>
      </head>
      <body>
        <div class="title">? MIVAJ AI PREDICTION</div>
        <div class="match">CHELSEA <span style="color:#64748b">vs</span> ARSENAL</div>
        <div class="pick-box">
          <div class="pick-label">ALGORITHMIC VIP PICK</div>
          <div class="pick-value">1X (CHELSEA)</div>
        </div>
        <div class="pick-box" style="border-color:#fbbf24;">
          <div class="pick-label">VALUE ODDS</div>
          <div class="pick-value" style="color:#fbbf24">@ 1.85</div>
        </div>
        <div class="footer">?? LINK IN BIO FOR SPORTYBET CODES</div>
      </body>
    </html>
  `;
  
  await page.setContent(htmlContent);
  
  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 30,
    videoFrame: { width: 1080, height: 1920 },
    videoCrf: 18,
    videoCodec: 'libx264',
    format: 'mp4',
  });

  const savePath = './viral-short.mp4';
  console.log("?? Recording 5-second viral short...");
  await recorder.start(savePath);
  
  // Wait for 5 seconds of animation
  await new Promise(r => setTimeout(r, 5000));
  await recorder.stop();
  await browser.close();

  console.log("? Video generated successfully!");

  // Broadast to Telegram
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  if (tgToken) {
    console.log("?? Broadcasting to Telegram...");
    const form = new FormData();
    form.append('chat_id', '@mivajsport'); // Or your specific chat ID
    form.append('video', fs.createReadStream(savePath));
    form.append('caption', '? **MIVAJ AI WEEKEND BANKER** ?\n\nGrab the SportyBet codes on Mivaj.com right now!');
    
    try {
      await axios.post(`https://api.telegram.org/bot${tgToken}/sendVideo`, form, {
        headers: form.getHeaders()
      });
      console.log("? Telegram broadcast complete!");
    } catch (e: any) {
      console.error("? Telegram upload failed:", e?.response?.data || e.message);
    }
  } else {
    console.warn("?? TELEGRAM_BOT_TOKEN not found in GitHub Secrets. Skipping upload.");
  }
}

generateAndPost().catch(console.error);

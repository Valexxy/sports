const { OpenAI } = require('openai');

async function testAPIs() {
  console.log("🧪 Booting up Multi-AI API Diagnostic Engine...\n");

  // 1. GROQ
  try {
    const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    const res = await groq.chat.completions.create({ model: "llama3-8b-8192", messages: [{role: "user", content: "Say 'Groq Active'"}] });
    console.log("✅ GROQ API: ONLINE ->", res.choices[0].message.content);
  } catch (e) {
    console.log("❌ GROQ API: FAILED ->", e.message);
  }

  // 2. OPENAI
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{role: "user", content: "Say 'OpenAI Active'"}] });
    console.log("✅ OPENAI API: ONLINE ->", res.choices[0].message.content);
  } catch (e) {
    console.log("❌ OPENAI API: FAILED ->", e.message);
  }

  // 3. DEEPSEEK
  try {
    const deepseek = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/beta" });
    const res = await deepseek.chat.completions.create({ model: "deepseek-chat", messages: [{role: "user", content: "Say 'DeepSeek Active'"}] });
    console.log("✅ DEEPSEEK API: ONLINE ->", res.choices[0].message.content);
  } catch (e) {
    console.log("❌ DEEPSEEK API: FAILED ->", e.message);
  }

  // 4. GEMINI (via REST)
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Say 'Gemini Active'" }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    console.log("✅ GEMINI API: ONLINE ->", data.candidates[0].content.parts[0].text.trim());
  } catch (e) {
    console.log("❌ GEMINI API: FAILED ->", e.message);
  }
}

testAPIs();

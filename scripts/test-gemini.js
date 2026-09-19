async function testGemini() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Say 'Gemini Active'" }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    console.log("✅ GEMINI API: ONLINE ->", data.candidates[0].content.parts[0].text.trim());
  } catch (e) {
    console.log("❌ GEMINI API: FAILED ->", e.message);
  }
}
testGemini();

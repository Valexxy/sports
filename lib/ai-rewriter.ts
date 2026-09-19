import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function rewriteNewsWithAI(title: string, content: string, league: string): Promise<{ title: string; content: string }> {
  try {
    const prompt = `
You are Mivaj AI, a hyper-intelligent, ruthless sports tactical analyst. 
Rewrite the following football news article to make it extremely viral, engaging, and authoritative. 
Use a premium, data-driven tone. Add emojis where appropriate. Keep it concise but punchy.
Format the output as a JSON object with two keys: "title" (the viral headline) and "content" (the rewritten body in Markdown).

Original Title: ${title}
Original Content: ${content}
League: ${league}
    `;

    const response = await openai.chat.completions.create({
      model: 'qwen/qwen3.8-27b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      title: result.title || title,
      content: result.content || content,
    };
  } catch (error) {
    console.error('AI Rewriter Error:', error);
    return { title, content }; // fallback
  }
}

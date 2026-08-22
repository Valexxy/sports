import os
from groq import Groq

def get_groq_key():
    if os.environ.get("GROQ_API_KEY"):
        return os.environ.get("GROQ_API_KEY")
    try:
        with open(".env.local", "r") as f:
            for line in f:
                if line.startswith("GROQ_API_KEY="):
                    return line.strip().split("=", 1)[1].strip('"\'')
    except Exception:
        pass
    return None

api_key = get_groq_key()
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment or .env.local!")

client = Groq(api_key=api_key)

def run_agent_task(prompt: str):
    print(f"🤖 Agent executing task: {prompt}\n")
    
    # Using Groq's active GPT-OSS 120b production model
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are an expert autonomous software engineer assistant. Provide precise, production-ready code."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=2048
    )
    
    return response.choices[0].message.content

if __name__ == "__main__":
    task_prompt = "Write a robust error-handling wrapper for Supabase client requests in TypeScript."
    result = run_agent_task(task_prompt)
    
    print("--- Agent Output ---\n")
    print(result)
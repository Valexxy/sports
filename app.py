import os
import gradio as gr
from groq import Groq

# 1. Securely grab the Groq API key
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
    raise ValueError("GROQ_API_KEY not found in .env.local!")

client = Groq(api_key=api_key)

# 2. Define the core chat function compatible with Gradio ChatInterface
def predict(message, history):
    # Convert Gradio history format into Groq messages payload
    messages = [
        {
            "role": "system",
            "content": "You are an expert autonomous software engineer assistant. Provide precise, production-ready code."
        }
    ]
    
    # Append past conversation turns
    for human_msg, ai_msg in history:
        messages.append({"role": "user", "content": human_msg})
        messages.append({"role": "assistant", "content": ai_msg})
        
    # Append the current user prompt
    messages.append({"role": "user", "content": message})
    
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.2,
            max_tokens=2048
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error communicating with Groq API: {str(e)}"

# 3. Build a robust Gradio UI
demo = gr.ChatInterface(
    fn=predict,
    title="AuraScore AI - Developer Interface",
    description="Direct, high-speed agentic chat interface powered by your Groq API key.",
    theme="soft"
)

if __name__ == "__main__":
    demo.launch(server_name="127.0.0.1", server_port=7860)
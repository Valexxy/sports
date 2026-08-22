import os
from groq import Groq

# Initialize cleanly using your active environment key
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Hello Groq! Confirm you are ready for agentic workflows.",
        }
    ],
    model="llama-3.1-8b-instant",
)

print(chat_completion.choices[0].message.content)
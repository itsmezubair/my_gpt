from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

def ask_agent(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
        )

        # Debugging ke liye pura object print karte hain
        print("🔹 RAW RESPONSE:", response)

        # Naye OpenAI client me choices[0].message.content hota hai
        return response.choices[0].message.content

    except Exception as e:
        print("⚠️ ERROR in ask_agent:", str(e))
        return f"⚠️ Error: {str(e)}"

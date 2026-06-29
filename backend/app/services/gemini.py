import os
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

from app.schemas.words import ExampleSentence
from app.services.romaji import to_romaji

class GeminiExample(BaseModel):
    japanese: str
    english: str

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise RuntimeError("GOOGLE_API_KEY not found in environment variables.")

client = genai.Client(api_key=api_key)

def fetch_example(word: str) -> ExampleSentence | None:

    prompt = f"""
You are a Japanese language teacher.

Generate exactly ONE natural Japanese sentence containing the word "{word}".

Rules:
- The sentence must naturally contain the exact word "{word}".
- Difficulty should be approximately JLPT N5-N4.
- Provide an accurate English translation.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": GeminiExample,
        },
    )

    data = response.parsed

    return ExampleSentence(
        japanese=data.japanese,
        romaji=to_romaji(data.japanese),
        english=data.english,
    )
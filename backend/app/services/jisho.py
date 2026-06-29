import requests
from fastapi import HTTPException
from app.schemas.words import WordResponse, ExampleSentence
from app.services.romaji import to_romaji
from app.services.gemini import fetch_example
def fetch_from_jisho(query:str):
    url="https://jisho.org/api/v1/search/words"
    response= requests.get(
        url,
        params={
            "keyword":query
        }
    )
    data=response.json()
    if not data["data"]:
        raise HTTPException(
            status_code=404,
            detail="No matching word found"
        )
    return data["data"][0]

def parse_word(entry):
    japanese=entry["japanese"][0]
    senses=entry["senses"][0]

    return {
        "word":japanese.get("word",japanese["reading"]),
        "reading":japanese["reading"],
        "meaning":senses["english_definitions"][0]
    }

def parse_jlpt(entry):
    jlpt = entry.get("jlpt", [])

    if not jlpt:
        return None

    return jlpt[0].replace("jlpt-", "").upper()

def build_response(
    word,
    reading,
    romaji,
    meaning,
    jlpt,
    
    example
):
    return WordResponse(
        word=word,
        reading=reading,
        romaji=romaji,
        meaning=meaning,
        jlpt=jlpt,
       
        example=example
    )
def search_word(query:str):
    
    entry=fetch_from_jisho(query)

    parsed=parse_word(entry)
    
    romaji=to_romaji(parsed["reading"])

    jlpt=parse_jlpt(entry)
    try:
        example= fetch_example(parsed["word"])
    except requests.RequestException:
        example = None

    
    
    return build_response(
        word=parsed["word"],
        reading=parsed["reading"],
        romaji=romaji,
        meaning=parsed["meaning"],
        jlpt=jlpt,
        example=example
    )
    
    
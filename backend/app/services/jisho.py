import requests
from fastapi import HTTPException
from app.schemas.words import WordResponse, ExampleSentence
from app.services.romaji import to_romaji
from app.services.gemini import fetch_example


def select_best_entry(entries, query: str):
    best_entry = None
    best_score = float("-inf")

    query = query.lower().strip()

    for entry in entries:
        score = 0

        # ---------- Common words (heavily weighted - this is the #1 signal) ----------
        if entry.get("is_common"):
            score += 200

        # ---------- JLPT ----------
        if entry.get("jlpt"):
            score += 60

        # ---------- Japanese ----------
        japanese = entry["japanese"][0]
        expression = japanese.get("word", "")
        reading = japanese.get("reading", "")

        if expression:
            # Prefer shorter kanji expressions, but cap the bonus
            # so it doesn't compete with is_common/jlpt signals
            score += max(0, 10 - len(expression))

            if len(expression) == 1:
                score += 15
        else:
            score -= 20

        # ---------- Sense ----------
        sense = entry["senses"][0]

        definitions = [
            d.lower()
            for d in sense.get("english_definitions", [])
        ]

        parts = sense.get("parts_of_speech", [])
        tags = sense.get("tags", [])
        info = sense.get("info", [])

        # ---------- Parts of speech ----------
        if "Expressions (phrases, clauses, etc.)" in parts:
            score -= 80

        if "Noun" in parts:
            score += 10

        # ---------- Tags ----------
        undesirable_tags = {
            "Slang",
            "Obsolete term",
            "Rare term",
            "Archaism",
            "Usually written using kana alone",
            "Derogatory",
            "Children's language",
            "Colloquial",
        }

        for tag in tags:
            if tag in undesirable_tags:
                score -= 40

        # ---------- Info ----------
        undesirable_info = {
            "rare",
            "obsolete",
            "archaism",
        }

        for item in info:
            text = item.lower()
            if any(word in text for word in undesirable_info):
                score -= 30

        # ---------- English definitions ----------
        # Strip parenthetical content for matching, e.g.
        # "dog (Canis (lupus) familiaris)" -> "dog"
        def strip_parens(s):
            depth = 0
            out = []
            for ch in s:
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    depth = max(0, depth - 1)
                elif depth == 0:
                    out.append(ch)
            return "".join(out).strip()

        if definitions:
            first_raw = definitions[0]
            first_clean = strip_parens(first_raw)

            if first_clean == query or first_raw == query:
                score += 150  # reduced from 400 — strong signal, not a trump card
            elif first_clean.startswith(query) or first_raw.startswith(query):
                score += 30

            for definition in definitions[1:]:
                def_clean = strip_parens(definition)
                if def_clean == query or definition == query:
                    score += 40
                elif query in definition:
                    score += 10

        if score > best_score:
            best_score = score
            best_entry = entry

    return best_entry

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
    return select_best_entry(
        data["data"],
        query,
    )

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
    except Exception:
        example = None

    
    
    return build_response(
        word=parsed["word"],
        reading=parsed["reading"],
        romaji=romaji,
        meaning=parsed["meaning"],
        jlpt=jlpt,
        example=example
    )
    
    
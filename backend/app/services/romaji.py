from fugashi import Tagger
from pykakasi import kakasi

tagger = Tagger()
kks = kakasi()

PARTICLE_ROMAJI = {
    "は": "wa",
    "へ": "e",
    "を": "o",
}
PUNCTUATION = {
    "。", "、",
    "！", "？",
    "「", "」",
    "（", "）"
}


def token_to_romaji(text: str) -> str:
    result = kks.convert(text)
    return "".join(item["hepburn"] for item in result)


def convert_token(token) -> str:
    surface = token.surface

    if token.surface in PUNCTUATION:
        return ""

    if token.feature.pos1 == "助詞":
        return PARTICLE_ROMAJI.get(
            surface,
            token_to_romaji(surface)
        )

    return token_to_romaji(surface)


def to_romaji(text: str) -> str:
    words = []

    for token in tagger(text):
        romaji = convert_token(token)

        if romaji:
            words.append(romaji)

    return " ".join(words).capitalize()
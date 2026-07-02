import re

from app.schemas.search import QueryType, SearchQuery


KANJI_RE = re.compile(r"[\u4E00-\u9FFF]")
HIRAGANA_RE = re.compile(r"^[\u3040-\u309F]+$")
KATAKANA_RE = re.compile(r"^[\u30A0-\u30FF]+$")
LATIN_RE = re.compile(r"^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$")


def detect_script(query: str) -> SearchQuery:
    query = query.strip()

    if KANJI_RE.search(query):
        return SearchQuery(
            original=query,
            normalized=query,
            query_type=QueryType.KANJI,
        )

    if HIRAGANA_RE.fullmatch(query):
        return SearchQuery(
            original=query,
            normalized=query,
            query_type=QueryType.HIRAGANA,
        )

    if KATAKANA_RE.fullmatch(query):
        return SearchQuery(
            original=query,
            normalized=query,
            query_type=QueryType.KATAKANA,
        )

    if LATIN_RE.fullmatch(query):
        normalized = " ".join(query.lower().split())
        return SearchQuery(
            original=query,
            normalized=normalized,
            query_type=QueryType.LATIN,
        )

    return SearchQuery(
        original=query,
        normalized=query,
        query_type=QueryType.UNKNOWN,
    )
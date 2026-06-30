from enum import Enum

from pydantic import BaseModel


class QueryType(str, Enum):
    KANJI = "kanji"
    HIRAGANA = "hiragana"
    KATAKANA = "katakana"
    LATIN = "latin"
    UNKNOWN = "unknown"


class SearchQuery(BaseModel):
    original: str
    normalized: str
    query_type: QueryType

class SearchMode(str, Enum):
    AUTO = "auto"
    ENGLISH = "english"
    ROMAJI = "romaji"
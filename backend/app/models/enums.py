
from __future__ import annotations
from enum import Enum



class JLPTLevel(str, Enum):
    N5 = "N5"
    N4 = "N4"
    N3 = "N3"
    N2 = "N2"
    N1 = "N1"


class CardType(str, Enum):
    VOCABULARY = "Vocabulary"
    KANJI = "Kanji"
    GRAMMAR = "Grammar"
    EXPRESSION = "Expression"
    KANA = "Kana"
    
class ReviewRating(str, Enum):
    AGAIN = "Again"
    HARD = "Hard"
    GOOD = "Good"
    EASY = "Easy"
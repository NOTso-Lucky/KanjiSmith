from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.crud import crud_flashcard
from app.schemas.search import QueryType
from app.services.script_detector import detect_script
from app.models.flashcard import Flashcard
from app.models.enums import CardType, JLPTLevel
from app.services.jisho import search_word
from app.schemas.words import WordResponse
class SearchService:

    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        query: str,
    ):
        
            detected = detect_script(query)

            match detected.query_type:

                case QueryType.KANJI:
                    return self.search_by_expression(detected.normalized)

                case QueryType.HIRAGANA:
                    return self.search_by_reading(detected.normalized)

                case QueryType.KATAKANA:
                    return self.search_by_reading(detected.normalized)

                case QueryType.LATIN:
                    return self.search_by_latin(detected.normalized)

                case _:
                    raise HTTPException(
                        status_code=400,
                        detail="Unsupported query type",
                    )
            
    def search_by_reading(self, reading: str):

        card = crud_flashcard.get_official_by_reading(
            db=self.db,
            reading=reading,
        )

        if card:
            return card

        word = self.resolve_query(reading)

        card = crud_flashcard.get_official_by_expression(
            db=self.db,
            expression=word.word,
        )

        if card:
            return card

        flashcard = self.build_flashcard(word)

        return crud_flashcard.create_official_flashcard(
            db=self.db,
            flashcard=flashcard,
        )

    def search_by_expression(self, expression: str):

        card = crud_flashcard.get_official_by_expression(
            db=self.db,
            expression=expression,
        )

        if card:
            return card

        word = self.resolve_query(expression)

        card = crud_flashcard.get_official_by_expression(
            db=self.db,
            expression=word.word,
        )

        if card:
            return card

        flashcard = self.build_flashcard(word)

        return crud_flashcard.create_official_flashcard(
            db=self.db,
            flashcard=flashcard,
        )

    def search_by_latin(self, query: str):

        return self.search_by_resolved_query(query)

    def resolve_query(self, query: str):
        return search_word(query)
    
    def build_flashcard(self, word: WordResponse) -> Flashcard:
        jlpt_level = (
        JLPTLevel(word.jlpt)
        if word.jlpt
        else None
        )

        return Flashcard(
            owner_id=None,
            expression=word.word,
            reading=word.reading,
            meaning=word.meaning,
            example_sentence=(
                word.example.japanese
                if word.example
                else None
            ),
            example_translation=(
                word.example.english
                if word.example
                else None
            ),
            notes=None,
            jlpt_level=jlpt_level,
            card_type=CardType.VOCABULARY,
    )
    def search_by_resolved_query(self, query: str):
        word = self.resolve_query(query)

        card = crud_flashcard.get_official_by_expression(
            db=self.db,
            expression=word.word,
        )

        if card:
            return card

        flashcard = self.build_flashcard(word)

        return crud_flashcard.create_official_flashcard(
            db=self.db,
            flashcard=flashcard,
        )
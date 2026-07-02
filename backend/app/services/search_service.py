from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.crud import crud_flashcard
from app.schemas.search import QueryType
from app.services.script_detector import detect_script
from app.models.flashcard import Flashcard
from app.models.enums import CardType, JLPTLevel
from app.services.jisho import search_word
from app.services.romaji import to_romaji
from app.schemas.words import WordResponse
from app.schemas.flashcard import FlashcardResponse


class SearchService:

    def __init__(self, db: Session):
        self.db = db

    def search(self, query: str):
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
        card = crud_flashcard.get_official_by_reading(db=self.db, reading=reading)
        if card:
            return self._to_response(card)

        word = self.resolve_query(reading)

        card = crud_flashcard.get_official_by_expression(db=self.db, expression=word.word)
        if card:
            return self._to_response(card)

        flashcard = self.build_flashcard(word)
        card = crud_flashcard.create_official_flashcard(db=self.db, flashcard=flashcard)
        return self._to_response(card)

    def search_by_expression(self, expression: str):
        card = crud_flashcard.get_official_by_expression(db=self.db, expression=expression)
        if card:
            return self._to_response(card)

        word = self.resolve_query(expression)

        card = crud_flashcard.get_official_by_expression(db=self.db, expression=word.word)
        if card:
            return self._to_response(card)

        flashcard = self.build_flashcard(word)
        card = crud_flashcard.create_official_flashcard(db=self.db, flashcard=flashcard)
        return self._to_response(card)

    def search_by_latin(self, query: str):
        card = crud_flashcard.get_official_by_meaning(db=self.db, query=query)
        if card:
            print(f"[DEBUG] matched by meaning: {card.expression} ({card.meaning})")
            return self._to_response(card)

        card = crud_flashcard.get_official_by_romaji(db=self.db, query=query)
        if card:
            print(f"[DEBUG] matched by romaji: {card.expression} ({card.reading_romaji})")
            return self._to_response(card)

        print(f"[DEBUG] no DB match, falling through to Jisho for: {query}")
        return self.search_by_resolved_query(query)

    def resolve_query(self, query: str):
        return search_word(query)

    def build_flashcard(self, word: WordResponse) -> Flashcard:
        jlpt_level = JLPTLevel(word.jlpt) if word.jlpt else None

        return Flashcard(
            owner_id=None,
            expression=word.word,
            reading=word.reading,
            reading_romaji=word.romaji,
            meaning=word.meaning,
            example_sentence=(word.example.japanese if word.example else None),
            example_romaji=(word.example.romaji if word.example else None),
            example_translation=(word.example.english if word.example else None),
            notes=None,
            jlpt_level=jlpt_level,
            card_type=CardType.VOCABULARY,
        )

    def search_by_resolved_query(self, query: str):
        word = self.resolve_query(query)

        card = crud_flashcard.get_official_by_expression(db=self.db, expression=word.word)
        if card:
            return self._to_response(card)

        flashcard = self.build_flashcard(word)
        card = crud_flashcard.create_official_flashcard(db=self.db, flashcard=flashcard)
        return self._to_response(card)

    def _to_response(self, card: Flashcard) -> FlashcardResponse:
        """
        Normalizes any Flashcard row into FlashcardResponse.
        Backfills romaji for any legacy rows that are missing it.
        """
        print(f"[DEBUG] reading_romaji={card.reading_romaji!r}, example_romaji={card.example_romaji!r}")
        dirty = False

        if not card.reading_romaji:
            card.reading_romaji = to_romaji(card.reading)
            dirty = True

        if card.example_sentence and not card.example_romaji:
            card.example_romaji = to_romaji(card.example_sentence)
            dirty = True

        if dirty:
            self.db.commit()
            self.db.refresh(card)

        return FlashcardResponse.model_validate(card)
from pydantic import ConfigDict
from pydantic import BaseModel, Field
from typing import Literal
from app.models.enums import CardType, JLPTLevel


class FlashcardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int | None
    source_flashcard_id: int | None

    expression: str
    reading: str
    reading_romaji: str | None
    meaning: str

    example_sentence: str | None
    example_romaji: str | None
    example_translation: str | None
    notes: str | None

    jlpt_level: JLPTLevel | None
    card_type: CardType


class FlashcardCreate(BaseModel):
    expression: str = Field(min_length=1, max_length=255)
    reading: str = Field(min_length=1, max_length=255)
    reading_romaji: str | None = None
    meaning: str = Field(min_length=1)

    example_sentence: str | None = None
    example_romaji: str | None = None
    example_translation: str | None = None
    notes: str | None = None

    jlpt_level: JLPTLevel | None = None
    card_type: CardType


class FlashcardUpdate(BaseModel):
    expression: str | None = Field(default=None, min_length=1, max_length=255)
    reading: str | None = Field(default=None, min_length=1, max_length=255)
    reading_romaji: str | None = None
    meaning: str | None = Field(default=None, min_length=1)

    example_sentence: str | None = None
    example_romaji: str | None = None
    example_translation: str | None = None
    notes: str | None = None

    jlpt_level: JLPTLevel | None = None
    card_type: CardType | None = None




class FlashcardEditRequest(BaseModel):
    updates: FlashcardUpdate
    mode: Literal["replace", "add_to_deck", "add_to_other_deck"] = "replace"
    target_deck_id: int | None = None
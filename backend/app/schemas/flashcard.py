from pydantic import ConfigDict
from pydantic import BaseModel, Field

from app.models.enums import CardType, JLPTLevel


class FlashcardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int | None
    source_flashcard_id: int | None

    expression: str
    reading: str
    meaning: str

    example_sentence: str | None
    example_translation: str | None
    notes: str | None

    jlpt_level: JLPTLevel | None
    card_type: CardType


class FlashcardCreate(BaseModel):
    expression: str = Field(min_length=1, max_length=255)
    reading: str = Field(min_length=1, max_length=255)
    meaning: str = Field(min_length=1)

    example_sentence: str | None = None
    example_translation: str | None = None
    notes: str | None = None

    jlpt_level: JLPTLevel | None = None
    card_type: CardType


class FlashcardUpdate(BaseModel):
    expression: str | None = Field(default=None, min_length=1, max_length=255)
    reading: str | None = Field(default=None, min_length=1, max_length=255)
    meaning: str | None = Field(default=None, min_length=1)

    example_sentence: str | None = None
    example_translation: str | None = None
    notes: str | None = None

    jlpt_level: JLPTLevel | None = None
    card_type: CardType | None = None
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.flashcard import FlashcardResponse


class DeckCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )
    description: str | None = None


class DeckUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    description: str | None = None


class DeckResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int | None

    title: str
    description: str | None

    created_at: datetime
    updated_at: datetime


class DeckFlashcardCreate(BaseModel):
    flashcard_id: int


class DeckFlashcardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    flashcard_id: int
    position: int
    added_at: datetime

    flashcard: FlashcardResponse


class DeckDetailResponse(DeckResponse):
    flashcards: list[DeckFlashcardResponse] = []
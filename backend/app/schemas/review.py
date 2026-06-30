from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ReviewRating
from app.schemas.flashcard import FlashcardResponse


class ReviewSubmit(BaseModel):
    rating: ReviewRating
    response_time_ms: int | None = Field(default=None, ge=0)


class UserFlashcardState(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    mastery_score: int
    ease_factor: float
    repetitions: int
    interval_days: int
    next_review: datetime | None
    last_review: datetime | None
    correct_count: int
    wrong_count: int


class ReviewResult(BaseModel):
    flashcard_id: int
    state: UserFlashcardState


class QueueResponse(BaseModel):
    cards: list[FlashcardResponse]
    count: int


class DueCountResponse(BaseModel):
    due_reviews: int
    new_cards: int
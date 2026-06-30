from sqlalchemy.orm import Session

from app.models.enums import ReviewRating
from app.models.review_history import ReviewHistory


def create_review(
    db: Session,
    user_id: int,
    flashcard_id: int,
    rating: ReviewRating,
    response_time_ms: int | None = None,
) -> ReviewHistory:

    entry = ReviewHistory(
        user_id=user_id,
        flashcard_id=flashcard_id,
        rating=rating,
        response_time_ms=response_time_ms,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry
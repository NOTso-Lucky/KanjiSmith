from sqlalchemy.orm import Session

from app.models.flashcard import Flashcard
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


def get_recent_for_user(
    db: Session,
    user_id: int,
    limit: int = 5,
) -> list[ReviewHistory]:
    """
    Returns the most recent review_history rows for a user,
    most recent first, with flashcard data eagerly loaded.
    Deduplicates by flashcard_id — only the latest review
    per card is returned so the same card doesn't appear twice.
    """
    from sqlalchemy import func

    # Subquery: latest reviewed_at per flashcard for this user
    latest = (
        db.query(
            ReviewHistory.flashcard_id,
            func.max(ReviewHistory.reviewed_at).label("latest_at"),
        )
        .filter(ReviewHistory.user_id == user_id)
        .group_by(ReviewHistory.flashcard_id)
        .subquery()
    )

    return (
        db.query(ReviewHistory)
        .join(
            latest,
            (ReviewHistory.flashcard_id == latest.c.flashcard_id)
            & (ReviewHistory.reviewed_at == latest.c.latest_at),
        )
        .filter(ReviewHistory.user_id == user_id)
        .order_by(ReviewHistory.reviewed_at.desc())
        .limit(limit)
        .all()
    )
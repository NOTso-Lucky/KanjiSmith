from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.user_flashcard import UserFlashcard


def get_entry(
    db: Session,
    user_id: int,
    flashcard_id: int,
) -> UserFlashcard | None:

    return (
        db.query(UserFlashcard)
        .filter(
            UserFlashcard.user_id == user_id,
            UserFlashcard.flashcard_id == flashcard_id,
        )
        .first()
    )


def create_entry(
    db: Session,
    user_id: int,
    flashcard_id: int,
) -> UserFlashcard:

    entry = UserFlashcard(
        user_id=user_id,
        flashcard_id=flashcard_id,
        next_review=datetime.now(timezone.utc),
        last_review=None,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


def get_or_create_entry(
    db: Session,
    user_id: int,
    flashcard_id: int,
) -> UserFlashcard:

    existing = get_entry(db, user_id, flashcard_id)

    if existing:
        return existing

    return create_entry(db, user_id, flashcard_id)
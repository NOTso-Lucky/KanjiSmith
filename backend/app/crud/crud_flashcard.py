from sqlalchemy.orm import Session

from app.models.flashcard import Flashcard


def get_official_by_expression(
    db: Session,
    expression: str,
) -> Flashcard | None:

    return (
        db.query(Flashcard)
        .filter(
            Flashcard.owner_id.is_(None),
            Flashcard.expression == expression,
        )
        .first()
    )

def get_official_by_reading(
    db: Session,
    reading: str,
) -> Flashcard | None:

    return (
        db.query(Flashcard)
        .filter(
            Flashcard.owner_id.is_(None),
            Flashcard.reading == reading,
        )
        .first()
    )

def create_official_flashcard(
    db: Session,
    flashcard: Flashcard,
    ) -> Flashcard:

    db.add(flashcard)
    db.commit()
    db.refresh(flashcard)

    return flashcard

def get_by_id(
    db: Session,
    flashcard_id: int,
) -> Flashcard | None:

    return db.get(Flashcard, flashcard_id)


def create_flashcard(
    db: Session,
    flashcard: Flashcard,
) -> Flashcard:

    db.add(flashcard)
    db.commit()
    db.refresh(flashcard)

    return flashcard
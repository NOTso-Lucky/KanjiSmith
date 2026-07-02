from sqlalchemy.orm import Session
import re
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

def get_readable_by_id(db: Session, flashcard_id: int, user_id: int) -> Flashcard | None:
    """A flashcard the user is allowed to view: official, or their own."""
    return (
        db.query(Flashcard)
        .filter(
            Flashcard.id == flashcard_id,
            (Flashcard.owner_id.is_(None)) | (Flashcard.owner_id == user_id),
        )
        .first()
    )




def get_official_by_meaning(db: Session, query: str) -> Flashcard | None:
    query = query.strip().lower()
    if not query:
        return None

    pattern = re.compile(rf"\b{re.escape(query)}\b", re.IGNORECASE)

    candidates = (
        db.query(Flashcard)
        .filter(
            Flashcard.owner_id.is_(None),
            Flashcard.meaning.ilike(f"%{query}%"),
        )
        .all()
    )

    for card in candidates:
        if pattern.search(card.meaning):
            return card

    return None


def get_official_by_romaji(db: Session, query: str) -> Flashcard | None:
    query = query.strip().lower()
    if not query:
        return None

    pattern = re.compile(rf"\b{re.escape(query)}\b", re.IGNORECASE)

    candidates = (
        db.query(Flashcard)
        .filter(
            Flashcard.owner_id.is_(None),
            Flashcard.reading_romaji.ilike(f"%{query}%"),
        )
        .all()
    )

    for card in candidates:
        if card.reading_romaji and pattern.search(card.reading_romaji):
            return card

    return None
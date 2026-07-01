from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.deck_flashcard import DeckFlashcard


def get_entry(
    db: Session,
    deck_id: int,
    flashcard_id: int,
) -> DeckFlashcard | None:

    return (
        db.query(DeckFlashcard)
        .filter(
            DeckFlashcard.deck_id == deck_id,
            DeckFlashcard.flashcard_id == flashcard_id,
        )
        .first()
    )


def get_next_position(
    db: Session,
    deck_id: int,
) -> int:

    max_position = (
        db.query(func.max(DeckFlashcard.position))
        .filter(DeckFlashcard.deck_id == deck_id)
        .scalar()
    )

    return (max_position or 0) + 1


def list_flashcards_in_deck(
    db: Session,
    deck_id: int,
) -> list[DeckFlashcard]:

    return (
        db.query(DeckFlashcard)
        .options(joinedload(DeckFlashcard.flashcard))
        .filter(DeckFlashcard.deck_id == deck_id)
        .order_by(DeckFlashcard.position)
        .all()
    )


def add_flashcard_to_deck(
    db: Session,
    entry: DeckFlashcard,
) -> DeckFlashcard:

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


def bulk_add_flashcards(
    db: Session,
    deck_id: int,
    flashcard_ids: list[int],
) -> list[DeckFlashcard]:
    """
    Inserts many DeckFlashcard rows for a deck in one commit, preserving
    the given order as position 1..N. Used when cloning an official deck,
    where we're copying an existing, already-ordered set of flashcard ids.
    """

    entries = [
        DeckFlashcard(
            deck_id=deck_id,
            flashcard_id=flashcard_id,
            position=index + 1,
        )
        for index, flashcard_id in enumerate(flashcard_ids)
    ]

    db.add_all(entries)
    db.commit()

    for entry in entries:
        db.refresh(entry)

    return entries


def remove_flashcard_from_deck(
    db: Session,
    entry: DeckFlashcard,
) -> None:

    db.delete(entry)
    db.commit()
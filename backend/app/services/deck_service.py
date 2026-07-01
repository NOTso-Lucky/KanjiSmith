from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import crud_deck, crud_deck_flashcard, crud_user_flashcard
from app.models.deck import Deck
from app.models.deck_flashcard import DeckFlashcard
from app.models.flashcard import Flashcard
from app.models.user import User
from app.schemas.deck import DeckCreate, DeckUpdate


def _ensure_owned(deck: Deck | None, user: User) -> Deck:
    """Raise if the deck doesn't exist or isn't owned by the user.

    Official decks (owner_id=None) are never editable through this path —
    only admin/seed scripts manage those directly.
    """

    if deck is None:
        raise HTTPException(
            status_code=404,
            detail="Deck not found",
        )

    if deck.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to modify this deck",
        )

    return deck


def list_decks(db: Session, user: User) -> list[Deck]:
    return crud_deck.list_decks_for_user(db, user.id)


def list_official_decks(db: Session) -> list[Deck]:
    return crud_deck.list_official_decks(db)


def get_deck(db: Session, deck_id: int, user: User) -> Deck:
    deck = crud_deck.get_deck_by_id(db, deck_id)

    if deck is None:
        raise HTTPException(
            status_code=404,
            detail="Deck not found",
        )

    if deck.owner_id is not None and deck.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to view this deck",
        )

    return deck


def create_deck(db: Session, payload: DeckCreate, user: User) -> Deck:
    existing = crud_deck.get_owned_by_title(db, user.id, payload.title)

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already have a deck with this title",
        )

    deck = Deck(
        owner_id=user.id,
        title=payload.title,
        description=payload.description,
    )

    return crud_deck.create_deck(db, deck)


def update_deck(
    db: Session,
    deck_id: int,
    payload: DeckUpdate,
    user: User,
) -> Deck:
    deck = _ensure_owned(crud_deck.get_deck_by_id(db, deck_id), user)

    if payload.title is not None:
        deck.title = payload.title

    if payload.description is not None:
        deck.description = payload.description

    return crud_deck.update_deck(db, deck)


def delete_deck(db: Session, deck_id: int, user: User) -> None:
    deck = _ensure_owned(crud_deck.get_deck_by_id(db, deck_id), user)

    crud_deck.delete_deck(db, deck)


def list_flashcards(db: Session, deck_id: int, user: User) -> list[DeckFlashcard]:
    # get_deck already enforces the view permission (own deck or official).
    get_deck(db, deck_id, user)

    return crud_deck_flashcard.list_flashcards_in_deck(db, deck_id)


def add_flashcard_to_deck(
    db: Session,
    deck_id: int,
    flashcard_id: int,
    user: User,
) -> DeckFlashcard:
    deck = _ensure_owned(crud_deck.get_deck_by_id(db, deck_id), user)

    flashcard = db.get(Flashcard, flashcard_id)

    if flashcard is None:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found",
        )

    existing_entry = crud_deck_flashcard.get_entry(db, deck.id, flashcard_id)

    if existing_entry:
        raise HTTPException(
            status_code=409,
            detail="This flashcard is already in the deck",
        )

    position = crud_deck_flashcard.get_next_position(db, deck.id)

    entry = DeckFlashcard(
        deck_id=deck.id,
        flashcard_id=flashcard_id,
        position=position,
    )

    created_entry = crud_deck_flashcard.add_flashcard_to_deck(db, entry)

    crud_user_flashcard.get_or_create_entry(db, user.id, flashcard_id)

    return created_entry

def update_flashcard_in_deck(
    db: Session,
    deck_id: int,
    flashcard_id: int,
    updates: dict,
    user: User,
    mode: str = "replace",
    target_deck_id: int | None = None,
) -> Flashcard:
    deck = _ensure_owned(crud_deck.get_deck_by_id(db, deck_id), user)

    entry = crud_deck_flashcard.get_entry(db, deck.id, flashcard_id)

    if entry is None:
        raise HTTPException(
            status_code=404,
            detail="This flashcard is not in the deck",
        )

    flashcard = db.get(Flashcard, flashcard_id)

    if flashcard is None:
        raise HTTPException(
            status_code=404,
            detail="Flashcard not found",
        )

    was_owned = flashcard.owner_id == user.id

    result = fork_flashcard_for_edit(db, flashcard, user, updates)

    if not was_owned:
        crud_user_flashcard.get_or_create_entry(db, user.id, result.id)

        if mode == "replace":
            entry.flashcard_id = result.id
            db.commit()
            db.refresh(entry)

        elif mode == "add_to_deck":
            position = crud_deck_flashcard.get_next_position(db, deck.id)
            new_entry = DeckFlashcard(
                deck_id=deck.id,
                flashcard_id=result.id,
                position=position,
            )
            crud_deck_flashcard.add_flashcard_to_deck(db, new_entry)

        elif mode == "add_to_other_deck":
            if target_deck_id is None:
                raise HTTPException(
                    status_code=400,
                    detail="target_deck_id is required for this mode",
                )

            target_deck = _ensure_owned(
                crud_deck.get_deck_by_id(db, target_deck_id), user
            )

            existing = crud_deck_flashcard.get_entry(db, target_deck.id, result.id)
            if existing is None:
                position = crud_deck_flashcard.get_next_position(db, target_deck.id)
                new_entry = DeckFlashcard(
                    deck_id=target_deck.id,
                    flashcard_id=result.id,
                    position=position,
                )
                crud_deck_flashcard.add_flashcard_to_deck(db, new_entry)

    return result

def remove_flashcard_from_deck(
    db: Session,
    deck_id: int,
    flashcard_id: int,
    user: User,
) -> None:
    deck = _ensure_owned(crud_deck.get_deck_by_id(db, deck_id), user)

    entry = crud_deck_flashcard.get_entry(db, deck.id, flashcard_id)

    if entry is None:
        raise HTTPException(
            status_code=404,
            detail="This flashcard is not in the deck",
        )

    crud_deck_flashcard.remove_flashcard_from_deck(db, entry)


def fork_flashcard_for_edit(
    db: Session,
    flashcard: Flashcard,
    user: User,
    updates: dict,
) -> Flashcard:
    """Return a flashcard the user can safely edit.

    If the flashcard is already owned by the user, apply updates in place.
    If it's official (or owned by someone else), create a personal copy
    linked back to the original via source_flashcard_id, with the given
    updates already applied, and leave the original untouched.
    """

    if flashcard.owner_id == user.id:
        for field, value in updates.items():
            setattr(flashcard, field, value)

        db.commit()
        db.refresh(flashcard)

        return flashcard

    base_fields = {
        "expression": flashcard.expression,
        "reading": flashcard.reading,
        "meaning": flashcard.meaning,
        "example_sentence": flashcard.example_sentence,
        "example_translation": flashcard.example_translation,
        "notes": flashcard.notes,
        "jlpt_level": flashcard.jlpt_level,
        "card_type": flashcard.card_type,
    }
    base_fields.update(updates)

    forked = Flashcard(
        owner_id=user.id,
        source_flashcard_id=flashcard.id,
        **base_fields,
    )

    db.add(forked)
    db.commit()
    db.refresh(forked)

    return forked


def clone_deck(
    db: Session,
    deck_id: int,
    user: User,
) -> Deck:
    """
    Clones an official deck into the user's own decks: a new Deck row
    owned by the user, plus DeckFlashcard rows pointing at the same
    flashcard ids as the original (no flashcard duplication — the
    flashcard content stays shared, only the deck "shell" and its
    membership links are copied), preserving original ordering.
    """

    source_deck = crud_deck.get_deck_by_id(db, deck_id)

    if source_deck is None:
        raise HTTPException(
            status_code=404,
            detail="Deck not found",
        )

    if source_deck.owner_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Only official decks can be added this way",
        )

    if crud_deck.get_owned_by_title(db, user.id, source_deck.title):
        raise HTTPException(
            status_code=409,
            detail="You already have this deck in My Decks",
        )

    new_deck = Deck(
        owner_id=user.id,
        title=source_deck.title,
        description=source_deck.description,
    )

    new_deck = crud_deck.create_deck(db, new_deck)

    entries = crud_deck_flashcard.list_flashcards_in_deck(db, source_deck.id)
    flashcard_ids = [entry.flashcard_id for entry in entries]

    if flashcard_ids:
        crud_deck_flashcard.bulk_add_flashcards(db, new_deck.id, flashcard_ids)

    return new_deck
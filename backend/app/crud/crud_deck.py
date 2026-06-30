from sqlalchemy.orm import Session

from app.models.deck import Deck


def get_deck_by_id(
    db: Session,
    deck_id: int,
) -> Deck | None:

    return db.get(Deck, deck_id)


def get_owned_by_title(
    db: Session,
    owner_id: int,
    title: str,
) -> Deck | None:

    return (
        db.query(Deck)
        .filter(
            Deck.owner_id == owner_id,
            Deck.title == title,
        )
        .first()
    )


def list_decks_for_user(
    db: Session,
    user_id: int,
) -> list[Deck]:

    return (
        db.query(Deck)
        .filter(
            (Deck.owner_id == user_id) | (Deck.owner_id.is_(None)),
        )
        .order_by(Deck.created_at.desc())
        .all()
    )


def create_deck(
    db: Session,
    deck: Deck,
) -> Deck:

    db.add(deck)
    db.commit()
    db.refresh(deck)

    return deck


def update_deck(
    db: Session,
    deck: Deck,
) -> Deck:

    db.commit()
    db.refresh(deck)

    return deck


def delete_deck(
    db: Session,
    deck: Deck,
) -> None:

    db.delete(deck)
    db.commit()
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import and_, exists, func, not_, or_
from sqlalchemy.orm import Session, joinedload
from app.db.database import SessionLocal
from app.services.gemini import fetch_example
from app.crud import crud_daily_progress, crud_deck, crud_review_history, crud_user_flashcard, crud_user_settings
from app.models.deck_flashcard import DeckFlashcard
from app.models.enums import ReviewRating
from app.models.flashcard import Flashcard
from app.models.user import User
from app.models.user_flashcard import UserFlashcard
from app.services import srs_service


def _visible_deck_ids(db: Session, user: User, deck_id: int | None) -> list[int] | None:
    """
    Returns the list of deck ids the queue should pull from, or None to mean
    "no deck restriction" (only valid when deck_id wasn't specified, i.e. a
    global queue across every deck the user can see).
    """
    if deck_id is None:
        return None

    deck = crud_deck.get_deck_by_id(db, deck_id)

    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")

    if deck.owner_id is not None and deck.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to study this deck",
        )

    return [deck_id]


def _due_review_flashcard_ids(
    db: Session,
    user: User,
    deck_ids: list[int] | None,
) -> list[int]:
    now = datetime.now(timezone.utc)

    query = (
        db.query(UserFlashcard.flashcard_id)
        .filter(
            UserFlashcard.user_id == user.id,
            UserFlashcard.next_review <= now,
            not_(
                and_(
                    UserFlashcard.repetitions == 0,
                    UserFlashcard.last_review.is_(None),
                )
            ),
        )
    )

    if deck_ids is not None:
        query = query.filter(
            UserFlashcard.flashcard_id.in_(
                db.query(DeckFlashcard.flashcard_id).filter(
                    DeckFlashcard.deck_id.in_(deck_ids)
                )
            )
        )

    return [row[0] for row in query.all()]


def _new_flashcard_ids(
    db: Session,
    user: User,
    deck_ids: list[int] | None,
    max_count: int,
) -> list[int]:
    if max_count <= 0:
        return []

    touched_subquery = (
        db.query(UserFlashcard.flashcard_id)
        .filter(
            UserFlashcard.user_id == user.id,
            or_(
                UserFlashcard.repetitions > 0,
                UserFlashcard.last_review.isnot(None),
            ),
        )
        .subquery()
    )

    query = db.query(Flashcard.id).filter(Flashcard.id.notin_(touched_subquery))

    if deck_ids is not None:
        query = query.join(
            DeckFlashcard, DeckFlashcard.flashcard_id == Flashcard.id
        ).filter(DeckFlashcard.deck_id.in_(deck_ids))
    else:
        # Global queue: restrict to flashcards in decks the user can see
        # (their own decks + official decks), same visibility rule as
        # deck_service. Otherwise every official+other-user flashcard in
        # the DB would leak into a "new cards" pool the user never opted into.
        visible_deck_ids = (
            db.query(DeckFlashcard.deck_id)
            .join(DeckFlashcard.deck)
            .filter(
                (DeckFlashcard.deck.has(owner_id=user.id))
                | (DeckFlashcard.deck.has(owner_id=None))
            )
        )
        query = query.join(
            DeckFlashcard, DeckFlashcard.flashcard_id == Flashcard.id
        ).filter(DeckFlashcard.deck_id.in_(visible_deck_ids))

    distinct_ids = query.distinct().subquery()

    randomized = (
        db.query(distinct_ids.c.id)
        .order_by(func.random())
        .limit(max_count)
        .all()
    )

    return [row[0] for row in randomized]


def get_due_queue(
    db: Session,
    user: User,
    deck_id: int | None = None,
    limit: int = 20,
) -> list[Flashcard]:
    deck_ids = _visible_deck_ids(db, user, deck_id)

    today_progress = crud_daily_progress.get_or_create_for_date(
        db, user.id, datetime.now(timezone.utc).date()
    )
    user_settings = crud_user_settings.get_or_create_for_user(db, user.id)
    new_cards_remaining = max(
        0, user_settings.new_cards_per_day - today_progress.cards_learned
    )

    review_ids = _due_review_flashcard_ids(db, user, deck_ids)
    new_ids = _new_flashcard_ids(db, user, deck_ids, new_cards_remaining)

    # Anki-style interleave: alternate review/new so new cards aren't all
    # front-loaded or all dumped at the end of a session.
    interleaved: list[int] = []
    i = j = 0
    while i < len(review_ids) or j < len(new_ids):
        if i < len(review_ids):
            interleaved.append(review_ids[i])
            i += 1
        if j < len(new_ids):
            interleaved.append(new_ids[j])
            j += 1

    interleaved = interleaved[:limit]

    if not interleaved:
        return []

    flashcards = (
        db.query(Flashcard)
        .filter(Flashcard.id.in_(interleaved))
        .all()
    )
    order = {fid: idx for idx, fid in enumerate(interleaved)}
    flashcards.sort(key=lambda f: order[f.id])

    return flashcards


def get_due_count(
    db: Session,
    user: User,
    deck_id: int | None = None,
) -> dict[str, int]:
    deck_ids = _visible_deck_ids(db, user, deck_id)

    today_progress = crud_daily_progress.get_or_create_for_date(
        db, user.id, datetime.now(timezone.utc).date()
    )
    user_settings = crud_user_settings.get_or_create_for_user(db, user.id)
    new_cards_remaining = max(
        0, user_settings.new_cards_per_day - today_progress.cards_learned
    )

    review_count = len(_due_review_flashcard_ids(db, user, deck_ids))
    new_count = len(_new_flashcard_ids(db, user, deck_ids, new_cards_remaining))

    return {"due_reviews": review_count, "new_cards": new_count}


def process_review(
    db: Session,
    user: User,
    flashcard_id: int,
    rating: ReviewRating,
    response_time_ms: int | None = None,
) -> UserFlashcard:
    flashcard = db.get(Flashcard, flashcard_id)

    if flashcard is None:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    entry = crud_user_flashcard.get_or_create_entry(db, user.id, flashcard_id)

    # Must capture this before apply_review mutates last_review.
    is_new_card = entry.last_review is None

    srs_service.apply_review(entry, rating, response_time_ms)
    db.commit()
    db.refresh(entry)

    crud_review_history.create_review(
        db, user.id, flashcard_id, rating, response_time_ms
    )

    is_correct = rating != ReviewRating.AGAIN
    study_time_minutes = (response_time_ms / 60000) if response_time_ms else 0

    crud_daily_progress.record_review(
        db,
        user.id,
        datetime.now(timezone.utc).date(),
        is_correct=is_correct,
        is_new_card=is_new_card,
        study_time_minutes=study_time_minutes,
    )

    return entry

def backfill_missing_examples(flashcard_ids: list[int]) -> None:
    """
    Runs as a FastAPI BackgroundTask, after the queue response has already
    been sent — so it must open its own DB session rather than reusing the
    request's, since the request's session may already be closed by the
    time this runs.

    For each flashcard, generates one example sentence via Gemini and
    saves it permanently. Re-checks example_sentence is still None right
    before writing, in case another request already backfilled it in the
    meantime. Each card is wrapped in its own try/except so one failure
    (a flaky Gemini call, a rate limit hit) doesn't stop the rest of the
    batch from being processed.
    """
    db = SessionLocal()

    try:
        for flashcard_id in flashcard_ids:
            try:
                flashcard = db.get(Flashcard, flashcard_id)

                if flashcard is None or flashcard.example_sentence is not None:
                    continue

                example = fetch_example(flashcard.expression)

                if example is None:
                    continue

                flashcard.example_sentence = example.japanese
                flashcard.example_romaji = example.romaji
                flashcard.example_translation = example.english

                db.commit()

            except Exception as exc:
                db.rollback()
                print(f"[backfill] failed for flashcard {flashcard_id}: {exc}")
    finally:
        db.close()
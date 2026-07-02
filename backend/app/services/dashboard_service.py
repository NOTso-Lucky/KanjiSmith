from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.crud import crud_daily_progress, crud_user_settings
from app.models.daily_progress import DailyProgress
from app.models.deck import Deck
from app.models.deck_flashcard import DeckFlashcard
from app.models.flashcard import Flashcard
from app.models.review_history import ReviewHistory
from app.models.user import User
from app.models.user_flashcard import UserFlashcard

def _compute_streaks(
    rows: list[DailyProgress],
    daily_goal: int,
    today: date,
) -> tuple[int, int]:
    """
    Returns (activity_streak, goal_streak).

    Walks backward from today through daily_progress rows.
    A missing day breaks both streaks.
    If today has no row yet (user hasn't reviewed yet today), we start
    counting from yesterday so an unstarted day doesn't zero out the streak.
    """
    if not rows:
        return 0, 0
    # If today hasn't been reviewed yet, start counting from yesterday.
    # We check reviews_completed rather than row existence because
    # get_or_create_for_date eagerly creates a zero row on first access.
    by_date = {row.date: row for row in rows}
    today_row = by_date.get(today)
    cursor = today if (today_row and today_row.reviews_completed > 0) else today - timedelta(days=1)

    activity_streak = 0
    goal_streak = 0
    activity_broken = False
    goal_broken = False

    while True:
        row = by_date.get(cursor)

        if row is None or row.reviews_completed == 0:
            # Missing day or zero reviews — both streaks are done
            break

        if not activity_broken:
            activity_streak += 1

        if not goal_broken:
            if row.reviews_completed >= daily_goal:
                goal_streak += 1
            else:
                goal_broken = True

        cursor -= timedelta(days=1)

    return activity_streak, goal_streak


def get_summary(db: Session, user: User) -> dict:
    today = datetime.now(timezone.utc).date()

    user_settings = crud_user_settings.get_or_create_for_user(db, user.id)

    today_progress = crud_daily_progress.get_or_create_for_date(db, user.id, today)

    recent_rows = crud_daily_progress.get_recent_for_user(db, user.id)
    activity_streak, goal_streak = _compute_streaks(
        recent_rows, user_settings.daily_goal, today
    )

    return {
        "today": {
            "reviews_completed": today_progress.reviews_completed,
            "correct_answers": today_progress.correct_answers,
            "wrong_answers": today_progress.wrong_answers,
            "cards_learned": today_progress.cards_learned,
            "study_time_minutes": today_progress.study_time_minutes,
        },
        "daily_goal": user_settings.daily_goal,
        "goal_progress_pct": min(
            100,
            round(today_progress.reviews_completed / user_settings.daily_goal * 100)
            if user_settings.daily_goal > 0
            else 0,
        ),
        "activity_streak": activity_streak,
        "goal_streak": goal_streak,
    }


def get_deck_stats(db: Session, user: User) -> list[dict]:
    today = datetime.now(timezone.utc)
    now = today

    # Only decks the user actually owns (their own decks + clones of
    # official decks). Official decks themselves are browsed separately
    # and aren't "My Decks" until cloned — this avoids the same content
    # showing up twice (once as the official original, once as the clone)
    # once a user has touched shared flashcards in both.
    decks = (
        db.query(Deck)
        .filter(Deck.owner_id == user.id)
        .all()
    )

    results = []

    for deck in decks:
        flashcard_ids = [
            df.flashcard_id for df in deck.deck_flashcards
        ]
        total_cards = len(flashcard_ids)

        if total_cards == 0:
            results.append({
                "deck_id": deck.id,
                "title": deck.title,
                "total_cards": 0,
                "cards_learned": 0,
                "cards_due": 0,
                "cards_new": 0,
                "avg_mastery_score": 0,
            })
            continue

        user_cards = (
            db.query(UserFlashcard)
            .filter(
                UserFlashcard.user_id == user.id,
                UserFlashcard.flashcard_id.in_(flashcard_ids),
            )
            .all()
        )

        uc_by_id = {uc.flashcard_id: uc for uc in user_cards}

        cards_due = 0
        cards_new = 0
        cards_learned = 0
        mastery_scores = []

        for fid in flashcard_ids:
            uc = uc_by_id.get(fid)

            if uc is None or (uc.repetitions == 0 and uc.last_review is None):
                # Never touched — counts as new
                cards_new += 1
            elif uc.next_review and uc.next_review <= now:
                cards_due += 1
                mastery_scores.append(uc.mastery_score)
            else:
                cards_learned += 1
                mastery_scores.append(uc.mastery_score)

        avg_mastery = round(sum(mastery_scores) / len(mastery_scores)) if mastery_scores else 0

        results.append({
            "deck_id": deck.id,
            "title": deck.title,
            "total_cards": total_cards,
            "cards_learned": cards_learned,
            "cards_due": cards_due,
            "cards_new": cards_new,
            "avg_mastery_score": avg_mastery,
        })

    return results

def get_recent_activity(db: Session, user: User, limit: int = 8) -> list[dict]:
    """
    Merges three real event sources into one feed, most recent first:
      - reviews completed (review_history)
      - decks added to "My Decks" (created OR cloned from official —
        cloning just creates a normal owned Deck row, so this covers both)
      - flashcards the user created themselves (excludes forked/edited
        copies of official cards, since those aren't really "new" cards)
    """

    review_rows = (
        db.query(ReviewHistory)
        .options(joinedload(ReviewHistory.flashcard))
        .filter(ReviewHistory.user_id == user.id)
        .order_by(ReviewHistory.reviewed_at.desc())
        .limit(limit)
        .all()
    )

    deck_rows = (
        db.query(Deck)
        .filter(Deck.owner_id == user.id)
        .order_by(Deck.created_at.desc())
        .limit(limit)
        .all()
    )

    flashcard_rows = (
        db.query(Flashcard)
        .filter(
            Flashcard.owner_id == user.id,
            Flashcard.source_flashcard_id.is_(None),
        )
        .order_by(Flashcard.created_at.desc())
        .limit(limit)
        .all()
    )

    events = []

    for review in review_rows:
        events.append({
            "type": "review",
            "text": f"Reviewed {review.flashcard.expression}",
            "timestamp": review.reviewed_at,
        })

    for deck in deck_rows:
        events.append({
            "type": "deck_added",
            "text": f'Added "{deck.title}" deck',
            "timestamp": deck.created_at,
        })

    for flashcard in flashcard_rows:
        events.append({
            "type": "flashcard_added",
            "text": f"Added {flashcard.expression}",
            "timestamp": flashcard.created_at,
        })

    events.sort(key=lambda e: e["timestamp"], reverse=True)

    return events[:limit]
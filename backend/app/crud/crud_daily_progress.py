from datetime import date

from sqlalchemy.orm import Session

from app.models.daily_progress import DailyProgress


def get_for_date(
    db: Session,
    user_id: int,
    target_date: date,
) -> DailyProgress | None:

    return (
        db.query(DailyProgress)
        .filter(
            DailyProgress.user_id == user_id,
            DailyProgress.date == target_date,
        )
        .first()
    )


def get_or_create_for_date(
    db: Session,
    user_id: int,
    target_date: date,
) -> DailyProgress:

    existing = get_for_date(db, user_id, target_date)

    if existing:
        return existing

    entry = DailyProgress(
        user_id=user_id,
        date=target_date,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


def record_review(
    db: Session,
    user_id: int,
    target_date: date,
    is_correct: bool,
    is_new_card: bool,
    study_time_minutes: float = 0,
) -> DailyProgress:
    """
    Increments today's aggregate counters for a single review event.
    Caller decides is_correct (False only for "Again") and is_new_card
    (True if this was the card's very first repetition).
    """
    entry = get_or_create_for_date(db, user_id, target_date)

    entry.reviews_completed += 1

    if is_correct:
        entry.correct_answers += 1
    else:
        entry.wrong_answers += 1

    if is_new_card:
        entry.cards_learned += 1

    entry.study_time_minutes += study_time_minutes

    db.commit()
    db.refresh(entry)

    return entry

def get_recent_for_user(
    db: Session,
    user_id: int,
    limit: int = 400,
) -> list[DailyProgress]:
    """
    Returns the user's daily_progress rows, most recent first, capped at
    `limit` days back. Used for streak calculation — 400 is comfortably
    more than a year, so a streak calculation will never silently truncate
    in practice.
    """
    return (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == user_id)
        .order_by(DailyProgress.date.desc())
        .limit(limit)
        .all()
    )
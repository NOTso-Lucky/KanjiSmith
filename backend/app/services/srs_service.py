from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.models.enums import ReviewRating
from app.models.user_flashcard import UserFlashcard

# Minimum ease factor SM-2 allows; below this cards become unmanageably hard.
MIN_EASE_FACTOR = 1.3

# Step used when a card is failed ("Again") — short relearning gap, not a
# full day, so the card resurfaces again soon within the same study session.
RELEARNING_STEP_MINUTES = 10


def _compute_mastery_score(repetitions: int, correct_count: int, wrong_count: int) -> int:
    """
    Derived 0-100 display stat. Not used by the scheduler.

    - repetitions contributes up to 70 points (capped at 8 successful reps).
    - accuracy (correct / total) contributes up to 30 points.
    """
    repetition_component = min(repetitions / 8, 1.0) * 70

    total = correct_count + wrong_count
    accuracy = (correct_count / total) if total > 0 else 0.0
    accuracy_component = accuracy * 30

    return round(min(100, repetition_component + accuracy_component))


def apply_review(
    user_flashcard: UserFlashcard,
    rating: ReviewRating,
    response_time_ms: int | None = None,
) -> UserFlashcard:
    """
    Mutates and returns user_flashcard in place, applying the classic SM-2
    algorithm based on the given rating. Caller is responsible for
    committing the session.
    """
    now = datetime.now(timezone.utc)

    if rating == ReviewRating.AGAIN:
        user_flashcard.repetitions = 0
        user_flashcard.interval_days = 0
        user_flashcard.ease_factor = max(
            MIN_EASE_FACTOR, user_flashcard.ease_factor - 0.2
        )
        user_flashcard.wrong_count += 1
        user_flashcard.next_review = now + timedelta(minutes=RELEARNING_STEP_MINUTES)

    else:
        # Hard / Good / Easy all count as a successful recall for SM-2 purposes.
        user_flashcard.correct_count += 1

        if rating == ReviewRating.HARD:
            user_flashcard.ease_factor = max(
                MIN_EASE_FACTOR, user_flashcard.ease_factor - 0.15
            )
        elif rating == ReviewRating.EASY:
            user_flashcard.ease_factor = user_flashcard.ease_factor + 0.15

        # GOOD leaves ease_factor unchanged.

        user_flashcard.repetitions += 1

        if user_flashcard.repetitions == 1:
            interval = 1
        elif user_flashcard.repetitions == 2:
            interval = 6
        else:
            interval = round(user_flashcard.interval_days * user_flashcard.ease_factor)
            interval = max(interval, user_flashcard.interval_days + 1)

        if rating == ReviewRating.HARD:
            # Hard still advances, but more conservatively than the formula above.
            interval = max(1, round(interval * 0.7))
        elif rating == ReviewRating.EASY:
            interval = round(interval * 1.3)

        user_flashcard.interval_days = interval
        user_flashcard.next_review = now + timedelta(days=interval)

    user_flashcard.last_review = now
    user_flashcard.mastery_score = _compute_mastery_score(
        user_flashcard.repetitions,
        user_flashcard.correct_count,
        user_flashcard.wrong_count,
    )

    return user_flashcard
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.review import (
    DueCountResponse,
    QueueResponse,
    ReviewResult,
    ReviewSubmit,
)
from app.services import review_service

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)


@router.get("/queue", response_model=QueueResponse)
def get_queue(
    deck_id: int | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cards = review_service.get_due_queue(db, current_user, deck_id, limit)

    return QueueResponse(cards=cards, count=len(cards))


@router.get("/due-count", response_model=DueCountResponse)
def get_due_count(
    deck_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    counts = review_service.get_due_count(db, current_user, deck_id)

    return DueCountResponse(**counts)


@router.post("/{flashcard_id}", response_model=ReviewResult)
def submit_review(
    flashcard_id: int,
    payload: ReviewSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = review_service.process_review(
        db,
        current_user,
        flashcard_id,
        payload.rating,
        payload.response_time_ms,
    )

    return ReviewResult(flashcard_id=flashcard_id, state=entry)
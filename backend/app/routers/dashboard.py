from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.dashboard import ActivityListResponse, DeckStatsListResponse, SummaryResponse
from app.services import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary", response_model=SummaryResponse)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = dashboard_service.get_summary(db, current_user)
    return SummaryResponse(
        today=data["today"],
        daily_goal=data["daily_goal"],
        goal_progress_pct=data["goal_progress_pct"],
        activity_streak=data["activity_streak"],
        goal_streak=data["goal_streak"],
    )


@router.get("/decks", response_model=DeckStatsListResponse)
def get_deck_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    decks = dashboard_service.get_deck_stats(db, current_user)
    return DeckStatsListResponse(
        decks=decks,
        total_decks=len(decks),
    )


@router.get("/activity", response_model=ActivityListResponse)
def get_recent_activity(
    limit: int = Query(default=8, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activities = dashboard_service.get_recent_activity(db, current_user, limit)
    return ActivityListResponse(activities=activities)
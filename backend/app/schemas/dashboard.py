from datetime import datetime

from pydantic import BaseModel


class TodayStats(BaseModel):
    reviews_completed: int
    correct_answers: int
    wrong_answers: int
    cards_learned: int
    study_time_minutes: int


class SummaryResponse(BaseModel):
    today: TodayStats
    daily_goal: int
    goal_progress_pct: int
    activity_streak: int
    goal_streak: int


class DeckStatsResponse(BaseModel):
    deck_id: int
    title: str
    total_cards: int
    cards_learned: int
    cards_due: int
    cards_new: int
    avg_mastery_score: int


class DeckStatsListResponse(BaseModel):
    decks: list[DeckStatsResponse]
    total_decks: int


class ActivityItemResponse(BaseModel):
    type: str
    text: str
    timestamp: datetime


class ActivityListResponse(BaseModel):
    activities: list[ActivityItemResponse]
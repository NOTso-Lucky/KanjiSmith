from __future__ import annotations

from datetime import date

from sqlalchemy import Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class DailyProgress(Base, TimestampMixin):
    __tablename__ = "daily_progress"

    __table_args__ = (
        UniqueConstraint("user_id", "date",name="uq_user_date",),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    reviews_completed: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    cards_learned: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    correct_answers: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    wrong_answers: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    study_time_minutes: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="daily_progress",
    )
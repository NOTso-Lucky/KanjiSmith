from __future__ import annotations
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class UserFlashcard(Base, TimestampMixin):
    __tablename__ = "user_flashcards"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    flashcard_id: Mapped[int] = mapped_column(
        ForeignKey("flashcards.id", ondelete="CASCADE"),
        primary_key=True,
    )

    mastery_score: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    ease_factor: Mapped[float] = mapped_column(
        default=2.5,
        nullable=False,
    )

    repetitions: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    interval_days: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    next_review: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    last_review: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    correct_count: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    wrong_count: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="user_flashcards",
    )

    flashcard: Mapped["Flashcard"] = relationship(
        back_populates="user_flashcards",
    )
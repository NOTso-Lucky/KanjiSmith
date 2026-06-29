from __future__ import annotations
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    username: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    decks: Mapped[list["Deck"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    flashcards: Mapped[list["Flashcard"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    user_flashcards: Mapped[list["UserFlashcard"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    reviews: Mapped[list["ReviewHistory"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    daily_progress: Mapped[list["DailyProgress"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    settings: Mapped["UserSettings"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
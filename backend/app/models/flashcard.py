from __future__ import annotations
from sqlalchemy import Enum, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import JLPTLevel, CardType


class Flashcard(Base, TimestampMixin):
    __tablename__ = "flashcards"
    __table_args__ = (
    UniqueConstraint(
        "owner_id",
        "expression",
        "reading",
        name="uq_owner_expression_reading",
    ),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    owner_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    expression: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    reading: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    meaning: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    example_sentence: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    example_translation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    jlpt_level: Mapped[JLPTLevel | None] = mapped_column(
        Enum(JLPTLevel),
        nullable=True,
    )

    card_type: Mapped[CardType] = mapped_column(
        Enum(CardType),
        nullable=False,
    )

    # Relationships

    owner: Mapped["User | None"] = relationship(
        back_populates="flashcards",
    )

    deck_flashcards: Mapped[list["DeckFlashcard"]] = relationship(
        back_populates="flashcard",
        cascade="all, delete-orphan",
    )

    user_flashcards: Mapped[list["UserFlashcard"]] = relationship(
        back_populates="flashcard",
        cascade="all, delete-orphan",
    )

    reviews: Mapped[list["ReviewHistory"]] = relationship(
        back_populates="flashcard",
        cascade="all, delete-orphan",
    )
from __future__ import annotations
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class DeckFlashcard(Base):
    __tablename__ = "deck_flashcards"

    deck_id: Mapped[int] = mapped_column(
        ForeignKey("decks.id", ondelete="CASCADE"),
        primary_key=True,
    )

    flashcard_id: Mapped[int] = mapped_column(
        ForeignKey("flashcards.id", ondelete="CASCADE"),
        primary_key=True,
    )

    position: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )

    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships

    deck: Mapped["Deck"] = relationship(
        back_populates="deck_flashcards",
    )

    flashcard: Mapped["Flashcard"] = relationship(
        back_populates="deck_flashcards",
    )
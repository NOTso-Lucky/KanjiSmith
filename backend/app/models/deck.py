from __future__ import annotations
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from sqlalchemy import UniqueConstraint

class Deck(Base, TimestampMixin):


    __tablename__ = "decks"

    __table_args__ = (
    UniqueConstraint("owner_id", "title",name="uq_owner_title",),
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

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    

    # Relationships

    owner: Mapped["User | None"] = relationship(
        back_populates="decks",
    )

    deck_flashcards: Mapped[list["DeckFlashcard"]] = relationship(
        back_populates="deck",
        cascade="all, delete-orphan",
    )
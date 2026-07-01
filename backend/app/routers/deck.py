from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.deck import (
    DeckCreate,
    DeckFlashcardCreate,
    DeckFlashcardResponse,
    DeckResponse,
    DeckUpdate,
)
from app.schemas.flashcard import FlashcardEditRequest, FlashcardResponse
from app.services import deck_service

router = APIRouter(
    prefix="/decks",
    tags=["Decks"],
)


@router.get("", response_model=list[DeckResponse])
def list_decks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.list_decks(db, current_user)


@router.get("/official", response_model=list[DeckResponse])
def list_official_decks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.list_official_decks(db)


@router.post("", response_model=DeckResponse, status_code=status.HTTP_201_CREATED)
def create_deck(
    payload: DeckCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.create_deck(db, payload, current_user)


@router.post("/{deck_id}/clone", response_model=DeckResponse, status_code=status.HTTP_201_CREATED)
def clone_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.clone_deck(db, deck_id, current_user)


@router.get("/{deck_id}", response_model=DeckResponse)
def get_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.get_deck(db, deck_id, current_user)


@router.patch("/{deck_id}", response_model=DeckResponse)
def update_deck(
    deck_id: int,
    payload: DeckUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.update_deck(db, deck_id, payload, current_user)


@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deck_service.delete_deck(db, deck_id, current_user)


@router.get("/{deck_id}/flashcards", response_model=list[DeckFlashcardResponse])
def list_flashcards(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.list_flashcards(db, deck_id, current_user)


@router.post(
    "/{deck_id}/flashcards",
    response_model=DeckFlashcardResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_flashcard_to_deck(
    deck_id: int,
    payload: DeckFlashcardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deck_service.add_flashcard_to_deck(
        db,
        deck_id,
        payload.flashcard_id,
        current_user,
    )

@router.patch(
    "/{deck_id}/flashcards/{flashcard_id}",
    response_model=FlashcardResponse,
)
def update_flashcard_in_deck(
    deck_id: int,
    flashcard_id: int,
    payload: FlashcardEditRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = payload.updates.model_dump(exclude_unset=True)

    return deck_service.update_flashcard_in_deck(
        db,
        deck_id,
        flashcard_id,
        updates,
        current_user,
        mode=payload.mode,
        target_deck_id=payload.target_deck_id,
    )
@router.delete(
    "/{deck_id}/flashcards/{flashcard_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_flashcard_from_deck(
    deck_id: int,
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deck_service.remove_flashcard_from_deck(db, deck_id, flashcard_id, current_user)
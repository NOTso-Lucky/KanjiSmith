from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.crud import crud_flashcard
from app.db.database import get_db
from app.models.flashcard import Flashcard
from app.models.user import User
from app.schemas.flashcard import FlashcardCreate, FlashcardResponse

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"],
)


@router.post("", response_model=FlashcardResponse, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    payload: FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    flashcard = Flashcard(
        owner_id=current_user.id,
        **payload.model_dump(),
    )

    return crud_flashcard.create_flashcard(db, flashcard)
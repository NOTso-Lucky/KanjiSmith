from fastapi import APIRouter, Depends
from app.services.search_service import SearchService
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.flashcard import FlashcardResponse

router = APIRouter(prefix="/words", tags=["Words"])

@router.get("/search", response_model=FlashcardResponse)
def search(query: str, db: Session = Depends(get_db)):
    service = SearchService(db)
    return service.search(query)
from fastapi import APIRouter
from app.services.jisho import search_word
router= APIRouter(
    prefix="/words",
    tags=["Words"]
)

@router.get("/search")
def search(query:str):
    return search_word(query)
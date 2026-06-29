from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import RegisterRequest, RegisterResponse
from app.services.users import create_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register",response_model=RegisterResponse)

def register(user: RegisterRequest, db: Session = Depends(get_db)):
    created_user = create_user(db, user)

    return {
        "message": "User created successfully",
        "username": created_user.username
    }
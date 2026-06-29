from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth import login
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

@router.post("/login",response_model=TokenResponse)

def login_user(
    request:LoginRequest,
    db:Session=Depends(get_db)
):
    return login(db,request)


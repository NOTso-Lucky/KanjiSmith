from app.core.security import verify_password
from app.services.users import get_user_by_email
from app.services.jwt import create_access_token
from app.schemas.auth import LoginRequest,TokenResponse
from fastapi import HTTPException
from sqlalchemy.orm import Session

def login(db:Session, request:LoginRequest):
    user=get_user_by_email(db,request.email)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
        status_code=401,
        detail="Invalid email or password"
        )
    
    token=create_access_token({
        "sub":str(user.id)
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer"
    )

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.jwt import verify_access_token
from app.services.users import get_user_by_id
from fastapi import HTTPException

oauth2_scheme=OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def get_current_user(db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):

    payload=verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
            )
    
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
            )   

    user=get_user_by_id(db,user_id)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
            )

    return user


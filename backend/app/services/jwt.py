from datetime import datetime, timedelta, timezone
from jose import jwt,JWTError

from app.core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

def create_access_token(data: dict):
    
    to_encode=data.copy()

    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp":expire
    })
    
    encodede_jwt=jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return encodede_jwt

def verify_access_token(token:str):

    try:
        payload=jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
        )

        user_id=payload.get("sub")

        if user_id is None:
            raise JWTError("Invalid Token")
    
        return payload
    
    except JWTError:
        return None



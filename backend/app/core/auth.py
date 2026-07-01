from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.jwt import verify_access_token
from app.services.users import get_user_by_id
from fastapi import HTTPException

bearer_scheme = HTTPBearer()

def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    token = credentials.credentials
    print(f"[DEBUG] token received: {token}")

    payload = verify_access_token(token)
    print(f"[DEBUG] payload: {payload}")

    if payload is None:
        print("[DEBUG] FAILED at: payload is None (decode/signature/expiry failed)")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
            )

    user_id = payload.get("sub")
    print(f"[DEBUG] user_id from payload: {user_id!r}")

    if user_id is None:
        print("[DEBUG] FAILED at: user_id is None")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
            )

    user = get_user_by_id(db, user_id)
    print(f"[DEBUG] user lookup result: {user}")

    if user is None:
        print("[DEBUG] FAILED at: get_user_by_id returned None")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
            )

    return user
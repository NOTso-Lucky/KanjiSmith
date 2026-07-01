from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password
from sqlalchemy import select
from fastapi import HTTPException
from app.models.user_settings import UserSettings


def get_user_by_id(db:Session,user_id:int):
    return db.get(User,user_id)

def get_user_by_username(db: Session,username:str):
    return db.execute(
        select(User).where(User.username==username)
    ).scalar_one_or_none()

def get_user_by_email(db: Session,email: str):
    return db.execute(
        select(User).where(
            User.email == email
        )
    ).scalar_one_or_none()

def create_user(db:Session,user:RegisterRequest):

    existing_user=get_user_by_username(db,user.username)


    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists."
        )
    
    existing_email=get_user_by_email(db,user.email)
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password),
        settings=UserSettings(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
from app.core.security import hash_password, verify_password

def update_user(db: Session, current_user: User, username: str | None, email: str | None, current_password: str) -> User:

    if not verify_password(current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if username and username != current_user.username:
        existing = get_user_by_username(db, username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists.")
        current_user.username = username

    if email and email != current_user.email:
        existing = get_user_by_email(db, email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists.")
        current_user.email = email

    db.commit()
    db.refresh(current_user)
    return current_user


def update_password(db: Session, current_user: User, current_password: str, new_password: str) -> User:

    if not verify_password(current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if current_password == new_password:
        raise HTTPException(status_code=400, detail="New password must be different from current password.")

    current_user.password_hash = hash_password(new_password)

    db.commit()
    db.refresh(current_user)
    return current_user
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password
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
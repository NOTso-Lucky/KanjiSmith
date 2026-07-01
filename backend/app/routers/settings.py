from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.crud import crud_user_settings
from app.db.database import get_db
from app.models.user import User
from app.schemas.user_settings import UserSettingsResponse, UserSettingsUpdate
from app.schemas.user import UserResponse, UserUpdate, PasswordUpdate
from app.services import users as user_service

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get("", response_model=UserSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud_user_settings.get_or_create_for_user(db, current_user.id)


@router.patch("", response_model=UserSettingsResponse)
def update_settings(
    payload: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = payload.model_dump(exclude_unset=True)
    return crud_user_settings.update_for_user(db, current_user.id, updates)




@router.patch("/account", response_model=UserResponse)
def update_account(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.update_user(
        db,
        current_user,
        username=payload.username,
        email=payload.email,
        current_password=payload.current_password,
    )


@router.patch("/password", response_model=UserResponse)
def update_password(
    payload: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.update_password(
        db,
        current_user,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
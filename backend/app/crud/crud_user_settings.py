from sqlalchemy.orm import Session

from app.models.user_settings import UserSettings


def get_for_user(
    db: Session,
    user_id: int,
) -> UserSettings | None:

    return db.get(UserSettings, user_id)


def get_or_create_for_user(
    db: Session,
    user_id: int,
) -> UserSettings:

    existing = get_for_user(db, user_id)

    if existing:
        return existing

    settings = UserSettings(user_id=user_id)

    db.add(settings)
    db.commit()
    db.refresh(settings)

    return settings

def update_for_user(
    db: Session,
    user_id: int,
    updates: dict,
) -> UserSettings:

    settings = get_or_create_for_user(db, user_id)

    for field, value in updates.items():
        if value is not None:
            setattr(settings, field, value)

    db.commit()
    db.refresh(settings)

    return settings
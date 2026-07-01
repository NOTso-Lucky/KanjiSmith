from pydantic import BaseModel, ConfigDict, Field


class UserSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    daily_goal: int
    new_cards_per_day: int


class UserSettingsUpdate(BaseModel):
    daily_goal: int | None = Field(default=None, ge=1, le=500)
    new_cards_per_day: int | None = Field(default=None, ge=1, le=500)
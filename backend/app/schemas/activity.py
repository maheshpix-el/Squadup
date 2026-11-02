from datetime import datetime

from datetime import datetime, timezone

from pydantic import BaseModel, Field, field_validator


# ============================================================
# CREATE ACTIVITY
# ============================================================

class ActivityCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=150
    )

    sport: str = Field(
        min_length=2,
        max_length=50
    )

    description: str | None = None

    location: str = Field(
        min_length=2,
        max_length=255
    )

    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180
    )

    activity_date: datetime

    max_players: int = Field(
        ge=2,
        le=100
    )

    @field_validator("activity_date")
    @classmethod
    def normalize_activity_date(cls, value: datetime) -> datetime:
        if value.tzinfo is not None:
            return value.astimezone(timezone.utc).replace(tzinfo=None)
        return value


# ============================================================
# UPDATE ACTIVITY
# ============================================================

class ActivityUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=150
    )

    sport: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    description: str | None = None

    location: str | None = Field(
        default=None,
        min_length=2,
        max_length=255
    )

    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180
    )

    activity_date: datetime | None = None

    max_players: int | None = Field(
        default=None,
        ge=2,
        le=100
    )

    @field_validator("activity_date")
    @classmethod
    def normalize_activity_date(cls, value: datetime | None) -> datetime | None:
        if value is not None and value.tzinfo is not None:
            return value.astimezone(timezone.utc).replace(tzinfo=None)
        return value


# ============================================================
# ACTIVITY RESPONSE
# ============================================================

class ActivityResponse(BaseModel):
    id: int

    title: str

    sport: str

    description: str | None

    location: str

    latitude: float | None

    longitude: float | None

    activity_date: datetime

    max_players: int

    current_players: int

    available_slots: int

    created_by: int

    status: str

    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# PAGINATED ACTIVITY RESPONSE
# ============================================================

class ActivityListResponse(BaseModel):
    items: list[ActivityResponse]

    page: int

    limit: int

    total: int

    pages: int
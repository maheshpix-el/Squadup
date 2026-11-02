from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str | None = Field(
        default=None,
        min_length=10,
        max_length=15
    )

    password: str = Field(
        min_length=8,
        max_length=128
    )


class UserUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    phone: str | None = Field(
        default=None,
        min_length=10,
        max_length=15
    )


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None
    is_verified: bool

    class Config:
        from_attributes = True


class UserProfileBase(BaseModel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_.-]+$")
    bio: str | None = Field(default=None, max_length=500)
    preferred_radius: int | None = Field(default=None, ge=1, le=15)
    preferred_play_time: str | None = Field(default=None, max_length=50)


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_.-]+$")
    bio: str | None = Field(default=None, max_length=500)
    preferred_radius: int | None = Field(default=None, ge=1, le=15)
    preferred_play_time: str | None = Field(default=None, max_length=50)


class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
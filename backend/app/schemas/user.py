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
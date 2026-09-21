from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.security import hash_password
from app.database import get_db
from app.models.user import User
from app.models.activity import Activity
from app.models.participant import Participant
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse
)
from app.schemas.activity import ActivityResponse


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


# ============================================================
# CREATE USER
# ============================================================

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists"
        )

    if user_data.phone:
        existing_phone = db.query(User).filter(
            User.phone == user_data.phone
        ).first()

        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this phone number already exists"
            )

    password_hash = hash_password(
        user_data.password
    )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=password_hash
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ============================================================
# GET MY PROFILE
# ============================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


# ============================================================
# UPDATE MY PROFILE
# ============================================================

@router.put(
    "/me",
    response_model=UserResponse
)
def update_my_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update_data = user_data.model_dump(
        exclude_unset=True
    )

    if "phone" in update_data and update_data["phone"]:
        existing_phone = db.query(User).filter(
            User.phone == update_data["phone"],
            User.id != current_user.id
        ).first()

        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this phone number already exists"
            )

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user


# ============================================================
# GET MY CREATED ACTIVITIES
# ============================================================

@router.get(
    "/me/activities/created",
    response_model=list[ActivityResponse]
)
def get_my_created_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activities = db.query(Activity).filter(
        Activity.created_by == current_user.id
    ).order_by(
        Activity.activity_date.asc()
    ).all()

    return activities


# ============================================================
# GET MY JOINED ACTIVITIES
# ============================================================

@router.get(
    "/me/activities/joined",
    response_model=list[ActivityResponse]
)
def get_my_joined_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activities = db.query(Activity).join(
        Participant,
        Participant.activity_id == Activity.id
    ).filter(
        Participant.user_id == current_user.id
    ).order_by(
        Activity.activity_date.asc()
    ).all()

    return activities


# ============================================================
# GET USER BY ID
# ============================================================

@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user
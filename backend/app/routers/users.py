from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, aliased

from app.auth.dependencies import get_current_user
from app.auth.security import hash_password
from app.database import get_db
from app.models.user import User
from app.models.user_profile import UserProfile
from app.services import activity_counts
from app.models.activity import Activity
from app.models.participant import Participant
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse
)
from app.schemas.activity import ActivityResponse
from app.schemas.user import UserProfileCreate, UserProfileResponse, UserProfileUpdate


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


# ============================================================
# EXPIRED ACTIVITY CLEANUP
# ============================================================

# ============================================================
# ACTIVITY RESPONSE HELPER
# ============================================================

def _activity_response_data(
    activity: Activity,
    participant_count: int
):
    counts = activity_counts(activity, participant_count)

    return {
        "id": activity.id,
        "title": activity.title,
        "sport": activity.sport,
        "description": activity.description,
        "activity_date": activity.activity_date,
        "location": activity.location,
        "latitude": activity.latitude,
        "longitude": activity.longitude,
        "max_players": activity.max_players,
        "current_players": counts["current_players"],
        "available_slots": counts["available_slots"],
        "created_by": activity.created_by,
        "status": counts["status"],
        "created_at": activity.created_at
    }

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


@router.get("/me/profile", response_model=UserProfileResponse | None)
def get_my_detail_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()


@router.post("/me/profile", response_model=UserProfileResponse, status_code=201)
def create_my_detail_profile(
    profile_data: UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first():
        raise HTTPException(status_code=409, detail="Profile already exists")
    if db.query(UserProfile).filter(UserProfile.username == profile_data.username).first():
        raise HTTPException(status_code=409, detail="Username is already taken")
    profile = UserProfile(user_id=current_user.id, **profile_data.model_dump())
    db.add(profile)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Profile or username already exists")
    db.refresh(profile)
    return profile


@router.put("/me/profile", response_model=UserProfileResponse)
def update_my_detail_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).with_for_update().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    update_data = profile_data.model_dump(exclude_unset=True)
    if "username" in update_data:
        existing = db.query(UserProfile).filter(
            UserProfile.username == update_data["username"],
            UserProfile.user_id != current_user.id,
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="Username is already taken")
    for field, value in update_data.items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


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
    results = db.query(
        Activity,
        func.count(Participant.id).label("participant_count")
    ).outerjoin(
        Participant,
        Participant.activity_id == Activity.id
    ).filter(
        Activity.created_by == current_user.id
    ).group_by(
        Activity.id
    ).order_by(
        Activity.activity_date.asc()
    ).all()

    return [
        _activity_response_data(
            activity,
            participant_count
        )
        for activity, participant_count in results
    ]


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
    current_user_participant = aliased(Participant)
    all_participants = aliased(Participant)

    results = db.query(
        Activity,
        func.count(all_participants.id).label("participant_count")
    ).join(
        current_user_participant,
        current_user_participant.activity_id == Activity.id
    ).outerjoin(
        all_participants,
        all_participants.activity_id == Activity.id
    ).filter(
        current_user_participant.user_id == current_user.id
    ).group_by(
        Activity.id
    ).order_by(
        Activity.activity_date.asc()
    ).all()

    return [
        _activity_response_data(
            activity,
            participant_count
        )
        for activity, participant_count in results
    ]


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
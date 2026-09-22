from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.activity import Activity
from app.models.participant import Participant
from app.models.user import User
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse
)


router = APIRouter(
    prefix="/api/v1/activities",
    tags=["Activities"]
)


# ============================================================
# CREATE ACTIVITY
# ============================================================

@router.post(
    "/",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED
)
def create_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_activity = Activity(
        title=activity_data.title,
        sport=activity_data.sport,
        description=activity_data.description,
        location=activity_data.location,
        latitude=activity_data.latitude,
        longitude=activity_data.longitude,
        activity_date=activity_data.activity_date,
        max_players=activity_data.max_players,
        created_by=current_user.id
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity


# ============================================================
# GET / SEARCH ACTIVITIES
# ============================================================

@router.get(
    "/",
    response_model=list[ActivityResponse]
)
def get_activities(
    sport: str | None = Query(default=None),
    location: str | None = Query(default=None),
    status_filter: str | None = Query(
        default=None,
        alias="status"
    ),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)

    if sport:
        query = query.filter(
            Activity.sport.ilike(f"%{sport}%")
        )

    if location:
        query = query.filter(
            Activity.location.ilike(f"%{location}%")
        )

    if status_filter:
        query = query.filter(
            Activity.status == status_filter
        )

    return query.order_by(
        Activity.activity_date.asc()
    ).all()


# ============================================================
# GET NEARBY ACTIVITIES
# ============================================================

@router.get(
    "/nearby",
    response_model=list[ActivityResponse]
)
def get_nearby_activities(
    latitude: float = Query(
        ...,
        ge=-90,
        le=90
    ),
    longitude: float = Query(
        ...,
        ge=-180,
        le=180
    ),
    radius_km: float = Query(
        default=5,
        gt=0,
        le=15
    ),
    db: Session = Depends(get_db)
):
    activities = db.query(Activity).filter(
        Activity.latitude.isnot(None),
        Activity.longitude.isnot(None),
        Activity.activity_date >= datetime.now()
    ).all()

    nearby_activities = []

    lat1 = radians(latitude)
    lon1 = radians(longitude)

    for activity in activities:

        lat2 = radians(activity.latitude)
        lon2 = radians(activity.longitude)

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = (
            sin(dlat / 2) ** 2
            + cos(lat1)
            * cos(lat2)
            * sin(dlon / 2) ** 2
        )

        c = 2 * atan2(
            sqrt(a),
            sqrt(1 - a)
        )

        distance_km = 6371 * c

        if distance_km <= radius_km:
            nearby_activities.append(activity)

    nearby_activities.sort(
        key=lambda activity: activity.activity_date
    )

    return nearby_activities


# ============================================================
# UPDATE ACTIVITY
# ============================================================

@router.put(
    "/{activity_id}",
    response_model=ActivityResponse
)
def update_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).with_for_update().first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Only the creator can modify the activity
    if activity.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this activity"
        )

    update_data = activity_data.model_dump(
        exclude_unset=True
    )

    if "max_players" in update_data:
        current_players = db.query(Participant).filter(
            Participant.activity_id == activity_id
        ).count() + 1

        if update_data["max_players"] < current_players:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Maximum players cannot be lower than the "
                    "current squad size"
                )
            )

    for field, value in update_data.items():
        setattr(activity, field, value)

    if "max_players" in update_data:
        activity.status = (
            "full"
            if current_players >= activity.max_players
            else "open"
        )

    db.commit()
    db.refresh(activity)

    return activity


# ============================================================
# DELETE ACTIVITY
# ============================================================

@router.delete(
    "/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).with_for_update().first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Only the creator can delete the activity
    if activity.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this activity"
        )

    db.query(Participant).filter(
        Participant.activity_id == activity_id
    ).delete(synchronize_session=False)

    db.delete(activity)
    db.commit()

    return None


# ============================================================
# GET SINGLE ACTIVITY
# ============================================================

@router.get(
    "/{activity_id}",
    response_model=ActivityResponse
)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    return activity

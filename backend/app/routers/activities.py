from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.activity import Activity
from app.models.participant import Participant
from app.models.user import User
from app.services import activity_counts, activity_status, participant_count
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
# EXPIRED ACTIVITY CLEANUP
# ============================================================

def _activity_response_data(
    activity,
    participant_count
):
    counts = activity_counts(activity, participant_count)

    return {
        "id": activity.id,
        "title": activity.title,
        "sport": activity.sport,
        "description": activity.description,
        "location": activity.location,
        "latitude": activity.latitude,
        "longitude": activity.longitude,
        "activity_date": activity.activity_date,
        "max_players": activity.max_players,
        "current_players": counts["current_players"],
        "available_slots": counts["available_slots"],
        "created_by": activity.created_by,
        "status": counts["status"],
        "created_at": activity.created_at
    }


def _get_activity_with_count(
    db,
    activity_id
):
    result = (
        db.query(
            Activity,
            func.count(Participant.id)
        )
        .outerjoin(
            Participant,
            Participant.activity_id == Activity.id
        )
        .filter(
            Activity.id == activity_id
        )
        .group_by(Activity.id)
        .first()
    )

    return result


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

    return _activity_response_data(
        new_activity,
        0
    )


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
    query = (
        db.query(
            Activity,
            func.count(Participant.id)
        )
        .outerjoin(
            Participant,
            Participant.activity_id == Activity.id
        )
    )
    query = query.filter(
        Activity.activity_date >= datetime.now(),
        Activity.status != "cancelled",
    )

    if sport:
        query = query.filter(
            Activity.sport.ilike(
                f"%{sport}%"
            )
        )

    if location:
        query = query.filter(
            Activity.location.ilike(
                f"%{location}%"
            )
        )

    results = (
        query
        .group_by(Activity.id)
        .order_by(
            Activity.activity_date.asc()
        )
        .all()
    )

    activities = [
        _activity_response_data(
            activity,
            participant_count
        )
        for activity, participant_count in results
    ]
    if status_filter:
        normalized = status_filter.lower()
        if normalized not in {"open", "full"}:
            raise HTTPException(status_code=400, detail="Discovery status must be open or full")
        activities = [activity for activity in activities if activity["status"] == normalized]
    return activities


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
    results = (
        db.query(
            Activity,
            func.count(Participant.id)
        )
        .outerjoin(
            Participant,
            Participant.activity_id == Activity.id
        )
        .filter(
            Activity.latitude.isnot(None),
            Activity.longitude.isnot(None),
            Activity.activity_date >= datetime.now(),
            Activity.status != "cancelled",
        )
        .group_by(Activity.id)
        .all()
    )

    nearby_activities = []

    lat1 = radians(latitude)
    lon1 = radians(longitude)

    for activity, participant_count in results:

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
            nearby_activities.append(
                (
                    activity,
                    participant_count
                )
            )

    nearby_activities.sort(
        key=lambda item:
        item[0].activity_date
    )

    return [
        _activity_response_data(
            activity,
            participant_count
        )
        for activity, participant_count
        in nearby_activities
    ]


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
    activity = (
        db.query(Activity)
        .filter(
            Activity.id == activity_id
        )
        .with_for_update()
        .first()
    )

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Only the creator can modify the activity.
    if activity.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not allowed to modify "
                "this activity"
            )
        )

    update_data = activity_data.model_dump(
        exclude_unset=True
    )

    current_status = activity_status(
        activity,
        participant_count(db, activity_id),
    )
    if current_status in {"completed", "cancelled"}:
        raise HTTPException(
            status_code=400,
            detail="Completed or cancelled activities cannot be updated",
        )

    current_players = (
        db.query(Participant)
        .filter(
            Participant.activity_id == activity_id
        )
        .count()
        + 1
    )

    if "max_players" in update_data:
        if (
            update_data["max_players"]
            < current_players
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Maximum players cannot be "
                    "lower than the current "
                    "squad size"
                )
            )

    for field, value in update_data.items():
        setattr(
            activity,
            field,
            value
        )

    db.commit()
    db.refresh(activity)

    return _activity_response_data(
        activity,
        current_players - 1
    )


# ============================================================
# CANCEL ACTIVITY
# ============================================================

@router.delete(
    "/{activity_id}",
    response_model=ActivityResponse
)
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = (
        db.query(Activity)
        .filter(
            Activity.id == activity_id
        )
        .with_for_update()
        .first()
    )

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Only the creator can delete the activity.
    if activity.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not allowed to delete "
                "this activity"
            )
        )

    if activity.status == "cancelled":
        raise HTTPException(status_code=400, detail="Activity is already cancelled")
    if activity_status(activity, participant_count(db, activity_id)) == "completed":
        raise HTTPException(status_code=400, detail="Completed activities cannot be cancelled")
    activity.status = "cancelled"
    db.commit()
    db.refresh(activity)
    return _activity_response_data(activity, participant_count(db, activity_id))


@router.post("/{activity_id}/cancel", response_model=ActivityResponse)
def cancel_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = db.query(Activity).filter(Activity.id == activity_id).with_for_update().first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    if activity.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator can cancel this activity")
    if activity.status == "cancelled":
        raise HTTPException(status_code=400, detail="Activity is already cancelled")
    current_status = activity_status(activity, participant_count(db, activity_id))
    if current_status == "completed":
        raise HTTPException(status_code=400, detail="Completed activities cannot be cancelled")
    activity.status = "cancelled"
    db.commit()
    db.refresh(activity)
    return _activity_response_data(activity, participant_count(db, activity_id))


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
    result = _get_activity_with_count(
        db,
        activity_id
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    activity, participant_count = result

    return _activity_response_data(
        activity,
        participant_count
    )
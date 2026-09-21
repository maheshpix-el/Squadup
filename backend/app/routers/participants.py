from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.activity import Activity
from app.models.participant import Participant
from app.models.user import User
from app.schemas.participant import ParticipantResponse


router = APIRouter(
    prefix="/api/v1/activities",
    tags=["Participants"]
)


# ============================================================
# JOIN ACTIVITY
# ============================================================

@router.post(
    "/{activity_id}/join",
    response_model=ParticipantResponse,
    status_code=status.HTTP_201_CREATED
)
def join_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check activity
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Check activity status
    if activity.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activity is not open for joining"
        )

    # Check whether activity has already started
    activity_datetime = activity.activity_date

    if activity_datetime.tzinfo is None:
        current_time = datetime.now()
    else:
        current_time = datetime.now(timezone.utc)

    if activity_datetime <= current_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This activity has already started or expired"
        )

    # Creator does not need to join themselves
    if activity.created_by == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activity creator is already part of this activity"
        )

    # Check duplicate participation
    existing_participant = db.query(Participant).filter(
        Participant.activity_id == activity_id,
        Participant.user_id == current_user.id
    ).first()

    if existing_participant:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already joined this activity"
        )

    # Count participants
    participant_count = db.query(Participant).filter(
        Participant.activity_id == activity_id
    ).count()

    # Check capacity
    if participant_count >= activity.max_players:
        activity.status = "full"
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Activity is full"
        )

    # Create participant
    new_participant = Participant(
        activity_id=activity_id,
        user_id=current_user.id
    )

    db.add(new_participant)

    # New count after joining
    new_participant_count = participant_count + 1

    # Automatically mark activity as full
    if new_participant_count >= activity.max_players:
        activity.status = "full"

    db.commit()
    db.refresh(new_participant)

    return new_participant


# ============================================================
# LEAVE ACTIVITY
# ============================================================

@router.delete(
    "/{activity_id}/leave",
    status_code=status.HTTP_204_NO_CONTENT
)
def leave_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check activity
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Find participant
    participant = db.query(Participant).filter(
        Participant.activity_id == activity_id,
        Participant.user_id == current_user.id
    ).first()

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not a participant of this activity"
        )

    db.delete(participant)

    # If the activity was full, reopen it after someone leaves
    if activity.status == "full":
        activity.status = "open"

    db.commit()

    return None


# ============================================================
# GET ACTIVITY PARTICIPANTS
# ============================================================

@router.get(
    "/{activity_id}/participants",
    response_model=list[ParticipantResponse]
)
def get_activity_participants(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check activity
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    return db.query(Participant).filter(
        Participant.activity_id == activity_id
    ).all()


# ============================================================
# GET PARTICIPANT COUNT
# ============================================================

@router.get(
    "/{activity_id}/count"
)
def get_participant_count(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check activity
    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Count participants
    participant_count = db.query(Participant).filter(
        Participant.activity_id == activity_id
    ).count()

    available_slots = max(
        activity.max_players - participant_count,
        0
    )

    # Keep status synchronized
    if participant_count >= activity.max_players:
        if activity.status == "open":
            activity.status = "full"
            db.commit()
    elif activity.status == "full":
        activity.status = "open"
        db.commit()

    return {
        "activity_id": activity_id,
        "current_players": participant_count,
        "max_players": activity.max_players,
        "available_slots": available_slots,
        "status": activity.status
    }
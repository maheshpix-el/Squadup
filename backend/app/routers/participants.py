from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.activity import Activity
from app.models.participant import Participant
from app.models.user import User
from app.services import activity_status, participant_count
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
    ).with_for_update().first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Check activity status
    current_status = activity_status(activity, participant_count(db, activity_id))
    if current_status != "open":
        detail = "Activity is cancelled" if current_status == "cancelled" else \
            "Activity is already completed" if current_status == "completed" else \
            "Activity is full"
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )

    # Check whether activity has already started
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

    # The creator is always part of the squad, even though they do not
    # receive a participant record.
    existing_count = db.query(Participant).filter(
        Participant.activity_id == activity_id
    ).count()
    current_players = existing_count + 1

    # Check capacity
    if current_players >= activity.max_players:
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
    ).with_for_update().first()

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

    current_status = activity_status(activity, participant_count(db, activity_id))
    if current_status in {"completed", "cancelled"}:
        raise HTTPException(status_code=400, detail="Historical activities cannot be changed")
    db.delete(participant)
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

    # The creator is part of every squad but is not stored as a participant.
    counted_participants = db.query(Participant).filter(
        Participant.activity_id == activity_id
    ).count()
    current_players = counted_participants + 1

    available_slots = max(
        activity.max_players - current_players,
        0
    )

    current_status = activity_status(activity, current_players - 1)

    return {
        "activity_id": activity_id,
        "current_players": current_players,
        "max_players": activity.max_players,
        "available_slots": available_slots,
        "status": current_status
    }

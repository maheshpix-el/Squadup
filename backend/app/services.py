from datetime import datetime, timezone

from sqlalchemy import func

from app.models.activity import Activity
from app.models.participant import Participant


def _utc_naive(value: datetime) -> datetime:
    if value.tzinfo is not None:
        return value.astimezone(timezone.utc).replace(tzinfo=None)
    return value


def activity_status(activity: Activity, participant_count: int, now: datetime | None = None) -> str:
    if activity.status == "cancelled":
        return "cancelled"

    current_time = now or datetime.now(timezone.utc)
    scheduled_time = _utc_naive(activity.activity_date)
    current_time = _utc_naive(current_time)

    if scheduled_time <= current_time:
        return "completed"

    current_players = participant_count + 1
    if current_players >= activity.max_players:
        return "full"

    return "open"


def activity_counts(activity: Activity, participant_count: int) -> dict:
    current_players = participant_count + 1
    return {
        "current_players": current_players,
        "available_slots": max(activity.max_players - current_players, 0),
        "status": activity_status(activity, participant_count),
    }


def participant_count(db, activity_id: int) -> int:
    return db.query(func.count(Participant.id)).filter(
        Participant.activity_id == activity_id
    ).scalar() or 0

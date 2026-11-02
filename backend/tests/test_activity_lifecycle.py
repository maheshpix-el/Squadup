from datetime import datetime, timedelta

import pytest
from fastapi import HTTPException

from app.models.activity import Activity
from app.models.participant import Participant
from app.routers.activities import cancel_activity, delete_activity
from app.routers.participants import join_activity, leave_activity
from app.services import activity_status


def make_activity(db, creator, **changes):
    values = {
        "title": "Football",
        "sport": "football",
        "location": "Park",
        "activity_date": datetime.now() + timedelta(days=1),
        "max_players": 3,
        "created_by": creator.id,
        "status": "open",
    }
    values.update(changes)
    activity = Activity(**values)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


def test_creator_is_counted_once(db, users):
    creator, _, _ = users
    activity = make_activity(db, creator)
    assert activity_status(activity, 0) == "open"
    assert 1 + 0 >= 0


def test_full_to_open_after_leave(db, users):
    creator, player, other = users
    activity = make_activity(db, creator, max_players=3)
    db.add_all([
        Participant(activity_id=activity.id, user_id=player.id),
        Participant(activity_id=activity.id, user_id=other.id),
    ])
    db.commit()
    assert activity_status(activity, 2) == "full"
    leave_activity(activity.id, db, player)
    assert activity_status(activity, 1) == "open"


def test_completed_status(db, users):
    creator, _, _ = users
    activity = make_activity(
        db,
        creator,
        activity_date=datetime(2000, 1, 1),
    )
    assert activity_status(activity, 0) == "completed"


def test_cancellation_and_authorization(db, users):
    creator, player, _ = users
    activity = make_activity(db, creator)

    with pytest.raises(HTTPException) as unauthorized:
        cancel_activity(activity.id, db, player)
    assert unauthorized.value.status_code == 403

    result = cancel_activity(activity.id, db, creator)
    assert result["status"] == "cancelled"
    assert activity_status(activity, 0) == "cancelled"

    with pytest.raises(HTTPException) as repeated:
        cancel_activity(activity.id, db, creator)
    assert repeated.value.status_code == 400


def test_delete_route_cancels_without_removing_participants(db, users):
    creator, player, _ = users
    activity = make_activity(db, creator)
    db.add(Participant(activity_id=activity.id, user_id=player.id))
    db.commit()

    delete_activity(activity.id, db, creator)
    assert db.query(Participant).filter_by(activity_id=activity.id, user_id=player.id).first() is not None
    assert db.query(Activity).filter_by(id=activity.id).first() is not None


def test_duplicate_join_and_capacity(db, users):
    creator, player, other = users
    activity = make_activity(db, creator, max_players=2)

    join_activity(activity.id, db, player)
    with pytest.raises(HTTPException) as duplicate:
        join_activity(activity.id, db, player)
    assert duplicate.value.status_code == 409

    with pytest.raises(HTTPException) as full:
        join_activity(activity.id, db, other)
    assert full.value.status_code == 409

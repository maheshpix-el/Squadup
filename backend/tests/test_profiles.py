from fastapi import HTTPException
import pytest

from app.models.user_profile import UserProfile
from app.routers.users import create_my_detail_profile, update_my_detail_profile
from app.schemas.user import UserProfileCreate, UserProfileUpdate


def test_profile_create_update_and_uniqueness(db, users):
    creator, player, _ = users
    profile = create_my_detail_profile(
        UserProfileCreate(username="creator_player", bio="Hello", preferred_radius=15),
        db,
        creator,
    )
    assert profile.username == "creator_player"

    updated = update_my_detail_profile(
        UserProfileUpdate(bio="Updated"),
        db,
        creator,
    )
    assert updated.bio == "Updated"

    with pytest.raises(HTTPException) as duplicate:
        create_my_detail_profile(
            UserProfileCreate(username="creator_player"),
            db,
            player,
        )
    assert duplicate.value.status_code == 409


def test_one_profile_per_user(db, users):
    creator, _, _ = users
    create_my_detail_profile(UserProfileCreate(username="creator_one"), db, creator)
    with pytest.raises(HTTPException) as duplicate:
        create_my_detail_profile(UserProfileCreate(username="creator_two"), db, creator)
    assert duplicate.value.status_code == 409
    assert db.query(UserProfile).filter_by(user_id=creator.id).count() == 1

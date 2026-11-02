"""Concurrency checks that run only against SQUADUP_TEST_DATABASE_URL."""

import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from uuid import uuid4

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models.activity import Activity
from app.models.participant import Participant
from app.models.user import User
from app.routers.participants import join_activity, leave_activity
from fastapi import HTTPException


@pytest.fixture(scope="module")
def postgres_sessions():
    url = os.getenv("SQUADUP_TEST_DATABASE_URL")
    if not url:
        pytest.skip("SQUADUP_TEST_DATABASE_URL is not set")
    test_url = make_url(url)
    if test_url.get_backend_name() != "postgresql":
        pytest.fail("SQUADUP_TEST_DATABASE_URL must use PostgreSQL")
    database_name = test_url.database or ""
    if "test" not in database_name.lower():
        pytest.fail("SQUADUP_TEST_DATABASE_URL must point to a database whose name contains 'test'")
    schema = f"squadup_test_{uuid4().hex}"
    admin_engine = create_engine(url)
    with admin_engine.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    engine = create_engine(url, connect_args={"options": f"-csearch_path={schema}"})
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, expire_on_commit=False)
    yield factory
    engine.dispose()
    with admin_engine.begin() as connection:
        connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
    admin_engine.dispose()


@pytest.fixture()
def scenario(postgres_sessions):
    db = postgres_sessions()
    users = [User(name=f"U{i}", email=f"u{i}-{uuid4().hex}@test.invalid", password_hash="x") for i in range(8)]
    db.add_all(users)
    db.flush()
    activity = Activity(
        title="Concurrency", sport="football", location="Park",
        activity_date=datetime.now() + timedelta(days=1), max_players=3,
        created_by=users[0].id, status="open",
    )
    db.add(activity)
    db.commit()
    ids = [user.id for user in users]
    activity_id = activity.id
    db.close()
    return activity_id, ids


def attempt_join(factory, activity_id, user_id):
    session = factory()
    try:
        user = session.get(User, user_id)
        try:
            join_activity(activity_id, session, user)
            return "joined"
        except HTTPException as error:
            session.rollback()
            return error.status_code
    finally:
        session.close()


def test_two_users_race_for_last_slot_and_capacity_is_never_exceeded(postgres_sessions, scenario):
    activity_id, user_ids = scenario
    with ThreadPoolExecutor(max_workers=2) as pool:
        outcomes = list(pool.map(lambda user_id: attempt_join(postgres_sessions, activity_id, user_id), user_ids[1:3]))
    assert outcomes.count("joined") == 1
    session = postgres_sessions()
    try:
        assert session.query(Participant).filter_by(activity_id=activity_id).count() + 1 == 3
    finally:
        session.close()


def test_multiple_simultaneous_joins_never_exceed_capacity(postgres_sessions, scenario):
    activity_id, user_ids = scenario
    with ThreadPoolExecutor(max_workers=7) as pool:
        outcomes = list(pool.map(lambda user_id: attempt_join(postgres_sessions, activity_id, user_id), user_ids[1:]))
    assert outcomes.count("joined") == 2
    session = postgres_sessions()
    try:
        count = session.query(Participant).filter_by(activity_id=activity_id).count()
        assert count + 1 <= 3
    finally:
        session.close()


def test_duplicate_simultaneous_join_is_prevented(postgres_sessions, scenario):
    activity_id, user_ids = scenario
    with ThreadPoolExecutor(max_workers=4) as pool:
        outcomes = list(pool.map(lambda _: attempt_join(postgres_sessions, activity_id, user_ids[1]), range(4)))
    assert outcomes.count("joined") == 1
    session = postgres_sessions()
    try:
        assert session.query(Participant).filter_by(activity_id=activity_id, user_id=user_ids[1]).count() == 1
    finally:
        session.close()


def test_full_activity_reopens_after_leave_and_rollback(postgres_sessions, scenario):
    activity_id, user_ids = scenario
    assert attempt_join(postgres_sessions, activity_id, user_ids[1]) == "joined"
    assert attempt_join(postgres_sessions, activity_id, user_ids[2]) == "joined"
    assert attempt_join(postgres_sessions, activity_id, user_ids[3]) == 409
    session = postgres_sessions()
    try:
        leave_activity(activity_id, session, session.get(User, user_ids[1]))
    finally:
        session.close()
    assert attempt_join(postgres_sessions, activity_id, user_ids[3]) == "joined"

    session = postgres_sessions()
    try:
        session.begin()
        session.add(Participant(activity_id=activity_id, user_id=user_ids[4]))
        session.flush()
        session.rollback()
        assert session.query(Participant).filter_by(activity_id=activity_id, user_id=user_ids[4]).count() == 0
    finally:
        session.close()


def test_postgresql_compiles_select_for_update(postgres_sessions, scenario):
    activity_id, _ = scenario
    session = postgres_sessions()
    try:
        statement = session.query(Activity).filter(Activity.id == activity_id).with_for_update().statement
        sql = str(statement.compile(dialect=session.bind.dialect)).upper()
        assert "FOR UPDATE" in sql
    finally:
        session.close()

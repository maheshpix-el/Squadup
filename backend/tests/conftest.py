import os
import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient


BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))
os.environ["DATABASE_URL"] = "sqlite://"

from app.database import Base  # noqa: E402
from app.models.activity import Activity  # noqa: E402
from app.models.participant import Participant  # noqa: E402
from app.models.user import User  # noqa: E402
from app.models.user_profile import UserProfile  # noqa: E402


@pytest.fixture()
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def users(db):
    creator = User(name="Creator", email="creator@example.com", phone="1111111111", password_hash="hash")
    player = User(name="Player", email="player@example.com", phone="2222222222", password_hash="hash")
    other = User(name="Other", email="other@example.com", phone="3333333333", password_hash="hash")
    db.add_all([creator, player, other])
    db.commit()
    return creator, player, other


@pytest.fixture()
def api_client():
    from app.database import get_db
    from app.main import app

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        session = TestingSession()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def api_users(api_client):
    from app.database import SessionLocal
    from app.auth.security import create_access_token
    from app.models.user import User

    # Use the API's overridden database engine, not the application's configured DB.
    db_dependency = api_client.app.dependency_overrides
    get_db_override = next(iter(db_dependency.values()))
    session = next(get_db_override())
    records = [
        User(name=name, email=f"{name.lower()}@example.com", password_hash="test-hash")
        for name in ("Creator", "Player", "Other")
    ]
    session.add_all(records)
    session.commit()
    for user in records:
        session.refresh(user)
    tokens = {user.name: create_access_token({"sub": str(user.id)}) for user in records}
    ids = {user.name: user.id for user in records}
    session.close()
    return ids, tokens

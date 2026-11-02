from datetime import datetime, timedelta


def auth(tokens, name):
    return {"Authorization": f"Bearer {tokens[name]}"}


def create_activity(client, tokens, name="Creator", date=None):
    response = client.post(
        "/api/v1/activities/",
        headers=auth(tokens, name),
        json={
            "title": "Football",
            "sport": "football",
            "location": "Park",
            "activity_date": (date or datetime.now() + timedelta(days=1)).isoformat(),
            "max_players": 3,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_activity_cancellation_api_and_legacy_delete(api_client, api_users):
    _, tokens = api_users
    activity = create_activity(api_client, tokens)
    joined = api_client.post(
        f"/api/v1/activities/{activity['id']}/join", headers=auth(tokens, "Player")
    )
    assert joined.status_code == 201

    assert api_client.post(
        f"/api/v1/activities/{activity['id']}/cancel", headers=auth(tokens, "Player")
    ).status_code == 403
    cancelled = api_client.post(
        f"/api/v1/activities/{activity['id']}/cancel", headers=auth(tokens, "Creator")
    )
    assert cancelled.status_code == 200
    assert cancelled.json()["status"] == "cancelled"
    assert api_client.post(
        f"/api/v1/activities/{activity['id']}/cancel", headers=auth(tokens, "Creator")
    ).status_code == 400
    assert api_client.get(
        f"/api/v1/activities/{activity['id']}/participants", headers=auth(tokens, "Creator")
    ).json()[0]["user_id"] == api_users[0]["Player"]

    legacy = create_activity(api_client, tokens)
    legacy_join = api_client.post(
        f"/api/v1/activities/{legacy['id']}/join", headers=auth(tokens, "Player")
    )
    assert legacy_join.status_code == 201
    assert api_client.delete(
        f"/api/v1/activities/{legacy['id']}", headers=auth(tokens, "Player")
    ).status_code == 403
    assert api_client.delete(
        f"/api/v1/activities/{legacy['id']}", headers=auth(tokens, "Creator")
    ).status_code == 200
    assert api_client.get(
        f"/api/v1/activities/{legacy['id']}/participants", headers=auth(tokens, "Creator")
    ).json()[0]["user_id"] == api_users[0]["Player"]


def test_completed_activity_cannot_be_cancelled(api_client, api_users):
    _, tokens = api_users
    activity = create_activity(api_client, tokens, date=datetime(2000, 1, 1))
    response = api_client.post(
        f"/api/v1/activities/{activity['id']}/cancel", headers=auth(tokens, "Creator")
    )
    assert response.status_code == 400


def test_profile_api_auth_ownership_validation_and_missing(api_client, api_users):
    _, tokens = api_users
    url = "/api/v1/users/me/profile"
    assert api_client.get(url).status_code == 401
    assert api_client.post(url, json={"username": "nobody"}).status_code == 401
    assert api_client.put(url, json={"bio": "no auth"}).status_code == 401
    assert api_client.get(url, headers=auth(tokens, "Creator")).json() is None
    assert api_client.put(url, headers=auth(tokens, "Creator"), json={"bio": "missing"}).status_code == 404

    created = api_client.post(
        url, headers=auth(tokens, "Creator"),
        json={"username": "creator_user", "preferred_radius": 5},
    )
    assert created.status_code == 201
    assert api_client.get(url, headers=auth(tokens, "Creator")).json()["username"] == "creator_user"
    updated = api_client.put(url, headers=auth(tokens, "Creator"), json={"bio": "updated"})
    assert updated.status_code == 200 and updated.json()["bio"] == "updated"
    assert api_client.post(
        url, headers=auth(tokens, "Player"), json={"username": "creator_user"}
    ).status_code == 409
    assert api_client.post(
        url, headers=auth(tokens, "Player"), json={"username": "player_user", "preferred_radius": 16}
    ).status_code == 422
    # The URL is always scoped to the authenticated identity; no user ID is accepted.
    assert api_client.put(
        url, headers=auth(tokens, "Player"), json={"username": "hijack_creator"}
    ).status_code == 404

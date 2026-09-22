"""Add database-level activity participant cleanup for existing databases.

This migration changes only the activity_participants.activity_id foreign key.
It does not update activities, max_players values, users, or participant rows.

Historical activities keep their existing max_players values. Activities created
before max_players meant total squad size can therefore appear one player over
the new total-player interpretation until they are reviewed manually.
"""

from sqlalchemy import inspect, text

from app.database import engine


TABLE_NAME = "activity_participants"
CONSTRAINT_NAME = "activity_participants_activity_id_fkey"


def find_activity_foreign_key(inspector):
    for foreign_key in inspector.get_foreign_keys(TABLE_NAME):
        if (
            foreign_key["constrained_columns"] == ["activity_id"]
            and foreign_key["referred_table"] == "activities"
            and foreign_key["referred_columns"] == ["id"]
        ):
            return foreign_key

    return None


def migrate():
    with engine.begin() as connection:
        inspector = inspect(connection)
        foreign_key = find_activity_foreign_key(inspector)

        if foreign_key is None:
            raise RuntimeError(
                "The expected activity_participants.activity_id foreign key "
                "was not found; no changes were made."
            )

        if foreign_key["name"] != CONSTRAINT_NAME:
            raise RuntimeError(
                "The activity foreign key has an unexpected name; no changes "
                "were made."
            )

        foreign_key_options = foreign_key.get("options") or {}
        if foreign_key_options.get("ondelete", "").upper() == "CASCADE":
            print("Activity participant cascade is already configured.")
            return

        connection.execute(
            text(
                "ALTER TABLE activity_participants "
                "DROP CONSTRAINT activity_participants_activity_id_fkey"
            )
        )
        connection.execute(
            text(
                "ALTER TABLE activity_participants "
                "ADD CONSTRAINT activity_participants_activity_id_fkey "
                "FOREIGN KEY (activity_id) REFERENCES activities(id) "
                "ON DELETE CASCADE"
            )
        )

    print("Activity participant cascade migration completed.")


if __name__ == "__main__":
    migrate()

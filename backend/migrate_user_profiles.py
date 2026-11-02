"""Create or repair the user_profiles schema on PostgreSQL.

Safe to run repeatedly. Existing rows are preserved; conflicting legacy data
causes migration to stop before adding unique/FK constraints.
"""

from sqlalchemy import inspect, text

from app.database import engine


def migrate():
    if engine.dialect.name != "postgresql":
        raise RuntimeError("user_profiles migration requires PostgreSQL")

    with engine.begin() as connection:
        tables = inspect(connection).get_table_names()
        if "users" not in tables:
            raise RuntimeError("users table must exist before migrating user_profiles")

        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS user_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                username VARCHAR(30) NOT NULL,
                bio TEXT,
                preferred_radius INTEGER,
                preferred_play_time VARCHAR(50)
            )
        """))
        columns = {column["name"] for column in inspect(connection).get_columns("user_profiles")}
        additions = {
            "user_id": "INTEGER",
            "username": "VARCHAR(30)",
            "bio": "TEXT",
            "preferred_radius": "INTEGER",
            "preferred_play_time": "VARCHAR(50)",
        }
        for name, sql_type in additions.items():
            if name not in columns:
                connection.execute(text(f"ALTER TABLE user_profiles ADD COLUMN {name} {sql_type}"))

        if connection.execute(text("SELECT 1 FROM user_profiles WHERE user_id IS NULL OR username IS NULL LIMIT 1")).first():
            raise RuntimeError("user_profiles contains null user_id/username values; repair them before migration")
        if connection.execute(text("SELECT 1 FROM user_profiles GROUP BY user_id HAVING count(*) > 1 LIMIT 1")).first():
            raise RuntimeError("user_profiles contains multiple profiles for a user; resolve duplicates before migration")
        if connection.execute(text("SELECT 1 FROM user_profiles GROUP BY username HAVING count(*) > 1 LIMIT 1")).first():
            raise RuntimeError("user_profiles contains duplicate usernames; resolve them before migration")
        if connection.execute(text("""
            SELECT 1 FROM user_profiles p LEFT JOIN users u ON u.id = p.user_id
            WHERE u.id IS NULL LIMIT 1
        """)).first():
            raise RuntimeError("user_profiles contains orphan user_id values; repair them before migration")

        connection.execute(text("ALTER TABLE user_profiles ALTER COLUMN user_id SET NOT NULL"))
        connection.execute(text("ALTER TABLE user_profiles ALTER COLUMN username SET NOT NULL"))
        constraints = {item["name"] for item in inspect(connection).get_unique_constraints("user_profiles")}
        indexes = {item["name"]: item for item in inspect(connection).get_indexes("user_profiles")}
        if "uq_user_profiles_user_id" not in constraints:
            connection.execute(text("ALTER TABLE user_profiles ADD CONSTRAINT uq_user_profiles_user_id UNIQUE (user_id)"))
        has_unique_username_index = any(
            item.get("unique") and item.get("column_names") == ["username"]
            for item in indexes.values()
        )
        if "uq_user_profiles_username" not in constraints and not has_unique_username_index:
            connection.execute(text("ALTER TABLE user_profiles ADD CONSTRAINT uq_user_profiles_username UNIQUE (username)"))
        foreign_keys = inspect(connection).get_foreign_keys("user_profiles")
        user_id_foreign_keys = [
            fk for fk in foreign_keys if fk["constrained_columns"] == ["user_id"]
        ]
        has_cascading_user_fk = any(
            fk["referred_table"] == "users"
            and fk["referred_columns"] == ["id"]
            and (fk.get("options") or {}).get("ondelete", "").upper() == "CASCADE"
            for fk in user_id_foreign_keys
        )
        if not has_cascading_user_fk:
            preparer = connection.dialect.identifier_preparer
            for foreign_key in user_id_foreign_keys:
                connection.execute(text(
                    "ALTER TABLE user_profiles DROP CONSTRAINT "
                    + preparer.quote(foreign_key["name"])
                ))
            connection.execute(text("ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_user_id_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"))
        connection.execute(text("CREATE INDEX IF NOT EXISTS ix_user_profiles_id ON user_profiles (id)"))
        if not has_unique_username_index and "uq_user_profiles_username" in constraints:
            connection.execute(text("CREATE INDEX IF NOT EXISTS ix_user_profiles_username ON user_profiles (username)"))


def downgrade():
    """Drop only user_profiles; user and participant records remain untouched."""
    with engine.begin() as connection:
        connection.execute(text("DROP TABLE IF EXISTS user_profiles"))


if __name__ == "__main__":
    migrate()
    print("user_profiles migration completed")

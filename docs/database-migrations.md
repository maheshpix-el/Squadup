# Database migrations

The repository does not use Alembic revisions. `Base.metadata.create_all()` remains useful for fresh local databases, but does not update existing schemas. Deployments must run the targeted PostgreSQL migration before starting the updated API.

## Create or repair `user_profiles`

From the `backend` directory, configure `DATABASE_URL` for the target PostgreSQL database, then run:

```powershell
python -m pip install -r requirements.txt
python migrate_user_profiles.py
```

The migration is repeatable. It creates the table and required columns when missing, enforces the `users.id` cascading foreign key, one profile per user, and unique usernames, and creates the model indexes. It never changes user rows. Existing profile rows are kept; null keys, duplicate user IDs, duplicate usernames, or orphan user IDs stop the migration with an actionable error. Resolve such conflicts before retrying.

To remove only this table (for a deliberate rollback), run:

```powershell
python -c "from migrate_user_profiles import downgrade; downgrade()"
```

This drops all profile data, so take a backup and use only when rolling back the profile feature. User and participant records are not dropped.

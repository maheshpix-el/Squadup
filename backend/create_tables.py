from app.database import engine, Base
from app.models import Activity, Participant, User

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ Database tables created successfully!")

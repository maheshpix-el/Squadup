from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)
    sport = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    activity_date = Column(DateTime, nullable=False)

    max_players = Column(Integer, nullable=False)

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="open"
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )
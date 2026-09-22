from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func

from app.database import Base


class Participant(Base):
    __tablename__ = "activity_participants"

    id = Column(Integer, primary_key=True, index=True)

    activity_id = Column(
        Integer,
        ForeignKey("activities.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    joined_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "activity_id",
            "user_id",
            name="unique_activity_user"
        ),
    )

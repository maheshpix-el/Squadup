from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    username = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True
    )

    bio = Column(
        Text,
        nullable=True
    )

    preferred_radius = Column(
        Integer,
        nullable=True
    )

    preferred_play_time = Column(
        String(50),
        nullable=True
    )

    user = relationship("User", back_populates="profile")
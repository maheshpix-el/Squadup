from datetime import datetime

from pydantic import BaseModel


class ParticipantResponse(BaseModel):
    id: int
    activity_id: int
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True
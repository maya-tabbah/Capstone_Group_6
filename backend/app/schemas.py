from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    session_id: int

class Message(MessageBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatSessionBase(BaseModel):
    user_id: int

class ChatSession(ChatSessionBase):
    id: int
    start_time: datetime
    end_time: datetime
    is_expired: bool
    messages: List[Message] = []

    class Config:
        from_attributes = True

# Keep your existing User schemas below...
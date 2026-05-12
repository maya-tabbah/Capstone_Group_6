from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Message Schemas ---
class MessageBase(BaseModel):
    content: str
    sender_id: int

class MessageCreate(MessageBase):
    session_id: int

class Message(MessageBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Session Schemas ---
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
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- User Schemas ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    # Added to fix the AttributeError
    pass 

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# --- Message Schemas ---
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
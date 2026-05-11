from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(
        content=message.content,
        session_id=message.session_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def create_chat_session(db: Session, user_id: int, duration_seconds: int):
    expire_at = datetime.now(timezone.utc) + timedelta(seconds=duration_seconds)
    db_session = models.ChatSession(user_id=user_id, end_time=expire_at, is_expired=False)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def set_session_expired(db: Session, session_id: int):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if session:
        session.is_expired = True
        db.commit()
        db.refresh(session)
    return session
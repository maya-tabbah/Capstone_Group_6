from sqlalchemy.orm import Session
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_chat_session(db: Session, user_id: int):
    db_session = models.ChatSession(user_id=user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session
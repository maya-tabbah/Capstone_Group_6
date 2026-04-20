from app.database import SessionLocal, engine
from app import models

# 1. Create the tables if they don't exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # 2. Create a test user (required because ChatSession depends on a User)
    test_user = models.User(username="test_user_101")
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    print(f"✅ Created User with ID: {test_user.id}")

    # 3. Create a test session linked to that user
    test_session = models.ChatSession(user_id=test_user.id)
    db.add(test_session)
    db.commit()
    db.refresh(test_session)
    print(f"✅ Created Session with ID: {test_session.id}")

    print(f"\n🚀 SUCCESS: Use Session ID {test_session.id} for your WebSocket test!")
    print(f"Example URL: ws://127.0.0.1:8000/ws/{test_session.id}/101")

except Exception as e:
    print(f"❌ Error seeding database: {e}")
    db.rollback()
finally:
    db.close()
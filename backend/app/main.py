import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List, Dict, Optional
from . import models, schemas, crud
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Persona Backend is live with WebSockets"}

class ConnectionManager:
    def __init__(self):
        # Maps session_id -> list of WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # List of WebSockets waiting for a match
        self.waiting_room: List[Dict] = []

    async def add_to_waiting_room(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.waiting_room.append({"ws": websocket, "user_id": user_id})
        print(f"DEBUG: User {user_id} added to waiting room. Queue size: {len(self.waiting_room)}")

    async def try_match(self, db: SessionLocal):
        if len(self.waiting_room) >= 2:
            # Pop the first two users
            user1 = self.waiting_room.pop(0)
            user2 = self.waiting_room.pop(0)

            # Create a new session in SQL (Supabase)
            # You'll need to update your crud.py to handle this!
            new_session = crud.create_chat_session(db, user1['user_id']) # simplified
            session_id = new_session.id

            # Notify both users of their match and new session_id
            match_data = {"event": "matched", "session_id": session_id}
            await user1['ws'].send_json(match_data)
            await user2['ws'].send_json(match_data)
            
            # Start the 20-minute timer for this session
            asyncio.create_task(self.start_session_timer(session_id))
            return session_id
        return None

    async def start_session_timer(self, session_id: int):
        # Wait for 20 minutes
        await asyncio.sleep(120) # changed to 120s for testing
        await self.send_to_session("SESSION_EXPIRED", session_id)
        # Here you would call a crud function to mark the session as expired in SQL
        print(f"DEBUG: Session {session_id} has expired.")

    async def connect(self, websocket: WebSocket, session_id: int):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)
        # DEBUG: Check how many people are in the room
        print(f"DEBUG: User joined Session {session_id}. Total in room: {len(self.active_connections[session_id])}")

    def disconnect(self, websocket: WebSocket, session_id: int):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            print(f"DEBUG: User left Session {session_id}. Remaining: {len(self.active_connections[session_id])}")

    async def send_to_session(self, message: str, session_id: int):
        if session_id in self.active_connections:
            print(f"DEBUG: Broadcasting to {len(self.active_connections[session_id])} users in Session {session_id}")
            for connection in self.active_connections[session_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/match/{user_id}")
async def matchmaking_endpoint(websocket: WebSocket, user_id: int):
    db = SessionLocal()
    
    # Check if the user exists in the 'users' table
    db_user = crud.get_user(db, user_id=user_id)
    
    # If the user doesn't exist, create one
    if not db_user:
        username = f"User_{user_id}"
        db_user = crud.get_user_by_username(db, username=username)
        
        if not db_user:
            new_user_data = schemas.UserCreate(
                username=username,
                password="temporary_password_123"
            )
            db_user = crud.create_user(db, new_user_data)

    await manager.add_to_waiting_room(websocket, db_user.id)
    try:
        await manager.try_match(db)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.waiting_room = [u for u in manager.waiting_room if u['user_id'] != db_user.id]
    finally:
        db.close()

@app.websocket("/ws/{session_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: int, client_id: int):
    await manager.connect(websocket, session_id)
    db = SessionLocal()
    try:
        while True:
            data = await websocket.receive_text()
            
            # Save to Database
            new_msg = schemas.MessageCreate(content=data, session_id=session_id)
            crud.create_message(db, new_msg)
            
            # Broadcast to the room
            await manager.send_to_session(f"User {client_id}: {data}", session_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    finally:
        db.close()
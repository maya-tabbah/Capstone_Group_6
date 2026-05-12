import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List, Dict
from . import models, schemas, crud
from .database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "https://persona-chat-5tkv.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_DURATION = 180 

@app.get("/")
def read_root():
    return {"message": "Persona Backend is live with WebSockets"}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.waiting_room: List[Dict] = []

    async def add_to_waiting_room(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.waiting_room.append({"ws": websocket, "user_id": user_id})

    async def try_match(self, db: SessionLocal):
        if len(self.waiting_room) >= 2:
            user1 = self.waiting_room.pop(0)
            user2 = self.waiting_room.pop(0)
            new_session = crud.create_chat_session(db, user1['user_id'], SESSION_DURATION)
            session_id = new_session.id
            match_data = {"event": "matched", "session_id": session_id, "duration": SESSION_DURATION}
            await user1['ws'].send_json(match_data)
            await user2['ws'].send_json(match_data)
            asyncio.create_task(self.start_session_timer(session_id))
            return session_id
        return None

    async def start_session_timer(self, session_id: int):
        await asyncio.sleep(SESSION_DURATION) 
        db = SessionLocal()
        try:
            crud.set_session_expired(db, session_id)
            await self.send_to_session("SESSION_EXPIRED", session_id)
        finally:
            db.close()

    async def connect(self, websocket: WebSocket, session_id: int):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: int):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)

    async def send_to_session(self, message: str, session_id: int):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/match/{user_id}")
async def matchmaking_endpoint(websocket: WebSocket, user_id: int):
    db = SessionLocal()
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        username = f"User_{user_id}"
        db_user = crud.get_user_by_username(db, username=username)
        if not db_user:
            new_user_data = schemas.UserCreate(username=username, password="temporary_password_123")
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
        # Sync the timer on connection/refresh
        session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
        if session:
            now = datetime.now(timezone.utc)
            expiry = session.end_time.replace(tzinfo=timezone.utc)
            remaining = int((expiry - now).total_seconds())
            await websocket.send_json({"type": "timer_sync", "remaining_seconds": max(0, remaining)})

        while True:
            data = await websocket.receive_text()
            try:
                json_data = json.loads(data)
                message_text = json_data.get("content", data)
            except:
                message_text = data
            
            # Use client_id from URL as sender_id so history knows who sent what
            new_msg = schemas.MessageCreate(content=message_text, session_id=session_id, sender_id=client_id)
            crud.create_message(db, new_msg)
            await manager.send_to_session(data, session_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    finally:
        db.close()

@app.get("/sessions/{session_id}/messages", response_model=List[schemas.Message])
def get_session_messages(session_id: int):
    db = SessionLocal()
    try:
        return crud.get_messages_by_session(db, session_id)
    finally:
        db.close()
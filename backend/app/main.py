from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from . import models, schemas
from .database import engine

# This creates the tables in Supabase/Postgres
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        # Stores active websocket connections
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accepts a new connection and adds it to the list."""
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """Removes a connection when a user leaves."""
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        """Sends a message to everyone currently connected."""
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"message": "Persona Backend is live with WebSockets"}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    # Use the corrected 'connect' method here
    await manager.connect(websocket)
    try:
        while True:
            # Wait for a message from the client
            data = await websocket.receive_text()
            # Broadcast it to everyone
            await manager.broadcast(f"User {client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"User {client_id} has left the chat")
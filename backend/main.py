from fastapi import FastAPI
from . import models
from .database import engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI + SQLAlchemy backend is officially running"}
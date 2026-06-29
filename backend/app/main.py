from fastapi import FastAPI
from app.core.database import Base,engine
import app.models
from app.routers import words, auth,users
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KanjiSmith API",
    version="1.0.0"
)

app.include_router(words.router)
app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")

def home():
    return {
        "message":"Welcome to KanjiSmith"
    }
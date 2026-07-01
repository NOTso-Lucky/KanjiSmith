from fastapi import FastAPI
from app.db.database import Base, engine
import app.models
from app.routers import words, auth, users, deck, flashcard, review, dashboard, settings
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI(
    title="KanjiSmith API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(words.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(deck.router)
app.include_router(flashcard.router)
app.include_router(review.router)
app.include_router(dashboard.router)
app.include_router(settings.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to KanjiSmith"
    }
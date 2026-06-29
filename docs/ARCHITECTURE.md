# KanjiSmith - ARCHITECTURE.md

# System Overview

KanjiSmith follows a layered architecture.

React
↓
FastAPI
↓
Service Layer
↓
SQLAlchemy ORM
↓
PostgreSQL (Supabase)

---

# Folder Philosophy

backend/

app/
- core/
- models/
- schemas/
- routers/
- services/
- utils/

frontend/

src/
- pages/
- components/
- layouts/
- context/
- hooks/

---

# Authentication Flow

User
↓

POST /login

↓

Password Verification

↓

JWT Access Token

↓

Protected Route

↓

Current User

---

# Database Philosophy

Official flashcards are stored once.

Every user has independent progress.

Never duplicate flashcards.

---

# Planned Tables

## users

Stores account information.

---

## flashcards

Stores official and custom flashcards.

owner_id = NULL → official

owner_id != NULL → custom

---

## decks

Stores collections of flashcards.

Official decks have owner_id = NULL.

---

## deck_flashcards

Many-to-many relation between decks and flashcards.

Columns:
- deck_id
- flashcard_id
- position
- added_at

---

## user_flashcards

Stores SRS state.

Fields:
- mastery_score
- ease_factor
- repetitions
- interval_days
- next_review
- last_review
- correct_count
- wrong_count

---

## review_history

Stores every review event.

Useful for:
- analytics
- graphs
- streaks
- dashboard

---

## daily_progress

Daily statistics.

---

## user_settings

Stores preferences.

---

# Relationships

User
├── Decks
├── Flashcards
├── UserFlashcards
├── ReviewHistory
└── UserSettings

Deck
└── DeckFlashcards

Flashcard
├── DeckFlashcards
└── UserFlashcards

---

# Backend Rules

- Business logic belongs in services.
- Routers should remain thin.
- Schemas validate data.
- Models represent database entities.
- Utilities contain reusable helpers.

---

# Future Modules

- Shared Decks
- Achievements
- Browser Extension Sync
- Notifications
- AI Recommendations

---

# Deployment

Frontend
→ Vercel

Backend
→ Docker + Railway/Fly/Render

Database
→ Supabase PostgreSQL

---

# Coding Standards

- Type hints everywhere.
- Separate schemas and models.
- Keep routers lightweight.
- One responsibility per module.
- Use Alembic for every schema change.

---

This document should evolve alongside the project and reflect the current architecture.

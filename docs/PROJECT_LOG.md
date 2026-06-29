# KanjiSmith - PROJECT_LOG.md

## 2026-06-29 — Phase 2 Complete: Database Architecture & PostgreSQL Migration

### Major Milestone

Completed the entire KanjiSmith database layer and migrated from SQLite to PostgreSQL using Supabase.

### Completed

* Designed complete normalized relational database schema.
* Migrated project from SQLite to PostgreSQL.
* Connected FastAPI to Supabase PostgreSQL.
* Configured SQLAlchemy 2.0 with PostgreSQL.
* Created all database models.
* Implemented timestamp mixin for automatic auditing.
* Added enums for JLPT level, card type, and review ratings.
* Created Alembic migration system.
* Generated and applied initial migration.
* Verified schema using Supabase ER Diagram.

### Database Tables

* users
* decks
* flashcards
* deck_flashcards
* user_flashcards
* review_history
* daily_progress
* user_settings

### Architecture Decisions

* PostgreSQL selected over MongoDB.
* Official flashcards represented using `owner_id = NULL`.
* Composite primary keys used for join tables.
* Separate learning state (`user_flashcards`) from flashcard content.
* Review history stored independently for analytics.
* Daily progress stored separately for dashboard performance.
* One-to-one relationship between User and UserSettings.

### Current Status

Authentication: ✅ Complete
Database Design: ✅ Complete
PostgreSQL Migration: ✅ Complete
Alembic Migration: ✅ Complete

### Next Phase

Implement business logic:

1. Deck CRUD
2. Flashcard CRUD
3. Deck-Flashcard management
4. Review engine (SRS)
5. Dashboard statistics


## Initial Log
## Project Information
**Project Name:** KanjiSmith

**Status:** Active Development (Backend First)

## Vision
KanjiSmith is a Japanese learning platform centered around spaced repetition,
flashcards, and intelligent vocabulary management. The ecosystem will eventually
include:
- Web Application
- Browser Extension
- Android Application
- Shared backend

## Current Development Strategy
The backend is the primary focus. The frontend will only be completed after the
backend architecture and APIs are stable.

Development order:
1. Database Design
2. SQLAlchemy Models
3. Business Logic (Services)
4. REST APIs
5. Testing
6. Frontend Integration

---

# Current Stack

## Backend
- FastAPI
- SQLAlchemy
- Alembic
- JWT Authentication
- Passlib/Bcrypt
- PostgreSQL (moving to Supabase)

## Frontend
- React
- Vite
- Tailwind CSS
- React Router

---

# Completed Milestones

## Backend
- Project initialized
- Database connection
- JWT Authentication
- Register endpoint
- Login endpoint
- Protected routes
- Current user endpoint (/users/me)
- Password hashing
- Alembic configured

## Frontend
- Project initialized
- Authentication pages
- Protected routing
- Basic layouts

## Japanese Processing
- Furigana generation prototype
- Romaji conversion
- Tokenization
- Particle handling

---

# Current Sprint

Primary Goal:
Design and complete the backend architecture.

Tasks:
- Finalize database schema
- Move database to Supabase
- Create SQLAlchemy models
- Generate migrations
- Flashcard CRUD
- Deck CRUD
- SRS implementation

---

# Planned Database

- users
- flashcards
- decks
- deck_flashcards
- user_flashcards
- review_history
- daily_progress
- user_settings

---

# Development Philosophy

- Backend First
- Database First
- API Driven Development
- Keep business logic inside services
- Avoid duplicate data
- Design for scalability

---

# Long-Term Roadmap

Phase 1
- Authentication
- Database

Phase 2
- Flashcards

Phase 3
- Decks

Phase 4
- SRS

Phase 5
- Dashboard

Phase 6
- Dictionary

Phase 7
- Browser Extension

Phase 8
- Android Application

---

# Notes

- Official flashcards should exist only once.
- User learning progress belongs in user_flashcards.
- PostgreSQL is the chosen database because of relational data and future analytics.

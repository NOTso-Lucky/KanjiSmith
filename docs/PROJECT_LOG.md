# KanjiSmith - PROJECT_LOG.md

## 2026-06-30 

### Search System

* Implemented automatic script detection for search queries.
* Added separate search flow for:

  * Kanji
  * Hiragana
  * Katakana
  * Latin (English/Romaji)
* Refactored search logic into `SearchService`.

### Jisho Integration

* Integrated Jisho API as the fallback source for unknown words.
* Implemented parsing for:

  * Japanese expression
  * Reading
  * English meaning
  * JLPT level
* Added automatic romaji generation from Japanese readings.

### Intelligent Result Selection

* Designed and implemented `select_best_entry()` to choose the most suitable dictionary entry from Jisho results.
* Ranking considers:

  * Common vocabulary (`is_common`)
  * JLPT availability
  * Expression length
  * Parts of speech
  * Tags (slang, obsolete, children's language, etc.)
  * Additional information fields
  * English definition matching
* Improved English definition comparison by stripping parenthesized content before scoring.

### Flashcard Pipeline

* Added automatic creation of official flashcards when a searched word does not already exist in the database.
* Existing flashcards are returned directly without creating duplicates.
* Generated flashcards include:

  * Expression
  * Reading
  * Romaji
  * Meaning
  * JLPT level
  * Gemini-generated example sentence (when available)

### Files Added

* `app/services/search_service.py`

### Files Updated

* `app/routers/words.py`
* `app/services/jisho.py`
* `app/services/script_detector.py`
* `app/services/gemini.py`
* `app/crud/crud_flashcard.py`
* `app/schemas/words.py`
* `app/models/flashcard.py`
* Related files required to support the new search pipeline.

### Current Status

* Authentication completed.
* Intelligent flashcard search pipeline completed.
* Automatic flashcard caching implemented.

### Next Milestone

* Deck Management

  * Deck CRUD
  * Add/Remove Flashcards
  * Deck listing
  * Study workflow

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

# KanjiSmith - PROJECT_LOG.md

## 2026-07-01 — Settings (Backend + Frontend)

### Backend

* `app/schemas/user_settings.py` (new) — `UserSettingsResponse` and `UserSettingsUpdate` with validation (1–500 range on both fields).
* `app/schemas/user.py` — added `UserUpdate` (username, email, requires `current_password`) and `PasswordUpdate` (current + new password, min 8 chars).
* `app/crud/crud_user_settings.py` — added `update_for_user()`: reuses `get_or_create_for_user` as safety net, iterates over update dict and only sets provided fields (PATCH semantics).
* `app/services/users.py` — added `update_user()` (verifies current password, checks username/email uniqueness before updating) and `update_password()` (verifies current password, rejects same-as-current new password, hashes and stores new one).
* `app/routers/settings.py` (new) — four endpoints:
  * `GET /settings` — fetch study preferences
  * `PATCH /settings` — update daily_goal and/or new_cards_per_day
  * `PATCH /settings/account` — update username/email (current password required)
  * `PATCH /settings/password` — change password (current + new password required)
* `app/main.py` — registered settings router.

### Frontend

* `src/services/settings.js` (new) — `getSettings()`, `updateStudySettings()`, `updateAccount()`, `updatePassword()`.
* `src/pages/Settings.jsx` (new) — three independent sections, each with their own form, save state, and error handling:
  * Study Preferences — daily goal + new cards per day, pre-filled from `GET /settings` on mount.
  * Account — username + email, current password required, updates `AuthContext` user on success so navbar avatar initial reflects changes immediately.
  * Change Password — current + new + confirm, mismatch caught client-side before API call, "Saved!" checkmark auto-resets after 2.5s.
* `src/App.jsx` — added `/settings` protected route.

### Testing

* Study preferences: changed daily goal to 30, refreshed — pre-filled correctly.
* Account: changed username with correct password — navbar avatar updated immediately.
* Password: changed password, logged out, logged back in with new password — confirmed working.

### Current Status

* Authentication completed.
* Deck management completed.
* Flashcard CRUD completed.
* Review Engine (SRS) completed.
* Dashboard Statistics completed.
* Search frontend completed.
* Review session frontend completed.
* Dashboard wired to real API data.
* Decks page + Deck detail completed.
* Settings (study preferences + account + password) completed.

### Next Milestone

* `GET /review-history` backend endpoint + wire Recent Flashcards dashboard component.

## 2026-07-01 — Review Frontend + Dashboard Wiring + UI Polish

### Review Session Page (`/review`)

* `src/pages/Review.jsx` — full SRS review session, fully wired to the backend.
  * Fetches card queue from `GET /reviews/queue` on mount, supports `?deck_id=` param so "Study this deck" links work from any deck-scoped entry point.
  * Per-card flip animation: front shows expression + reading, back reveals meaning, romaji, and example sentence block. Click anywhere on the card to flip.
  * Four rating buttons (Again / Hard / Good / Easy) appear only after the card is flipped — enforcing the "think first, then rate" SRS flow.
  * Reviews fire-and-forget (`submitReview` not awaited) so the session advances immediately without waiting on the network — failed submissions are logged to console but don't interrupt the user.
  * Per-card response time tracked via `cardStartRef` and sent as `response_time_ms` on each submission.
  * Session stats (reviewed count, correct count, elapsed time) accumulated client-side and shown on the completion screen.
  * Four distinct states handled cleanly: loading, error, empty queue ("all caught up"), active session, and completion screen with accuracy % and session time.
  * "Study Again" on the completion screen re-fetches the queue (picks up any relearning cards that are now due after the 10-min relearning step).

* `src/components/ReviewCard.jsx` — 3D flip card with `rotateY` CSS transform, `backface-visibility: hidden` on both faces. Front shows large kanji + reading; back shows full detail (meaning, reading romaji, example sentence with romaji + translation). Renders `reading_romaji` and `example_romaji` from the new backend fields when present.

* `src/components/ReviewButtons.jsx` — four fixed-color rating buttons (red/orange/green/blue) with interval hint sublabels (`<10m`, `<1d`, `+1d`, `+4d`). Disabled during submission to prevent double-submissions.

* `src/services/review.js` — `getQueue(deckId, limit)`, `submitReview(flashcardId, rating, responseTimeMs)`, `getDueCount(deckId)`.

### Dashboard Wiring

* `src/components/dashboard/StatsGrid.jsx` — wired to real API data. Fetches `GET /dashboard/summary`, `GET /dashboard/decks`, and `GET /reviews/due-count` in parallel. Shows: Cards Due Today (due_reviews + new_cards), Learned Today, Decks, Activity Streak. Loading skeletons while fetching, `—` on error.
* `src/components/dashboard/TodayStudyCard.jsx` — wired to `GET /dashboard/summary`. Shows reviewed vs goal with circular progress, Reviewed/Remaining mini-cards, and a "Start Studying" / "Continue Studying" button navigating to `/review`.
* `src/components/dashboard/MyDecks.jsx` — wired to `GET /dashboard/decks`. Loading skeleton (2 placeholder cards), empty state with prompt to create first deck, maps real deck data to `DeckCard` components.
* `src/services/dashboard.js` — `getSummary()`, `getDecks()`, `getDueCount()`.

### UI Polish

* `src/components/Navbar.jsx` — added search icon button (authenticated only) navigating to `/search`, logo link goes to `/dashboard` when logged in, `/` when not.
* `src/components/UserMenu.jsx` — avatar dropdown with user info (username + email), Settings and Profile menu items, Logout at bottom. Closes on outside click via `useRef` + `mousedown` listener.
* `src/pages/Dashboard.jsx` — wrapped in `MainLayout` (was missing, so Navbar wasn't showing on dashboard), restructured layout to match reference design: WelcomeHeader → StatsGrid → TodayStudyCard + RecentActivity (side-by-side) → RecentFlashcards → MyDecks. Removed SearchHero and QuickActions from the main layout.
* `src/components/common/` — added `Button.jsx`, `Card.jsx`, `Input.jsx` as reusable primitive components.

### Known Issues / Deferred

* `RecentFlashcards` dashboard component still uses fake data — needs a `GET /review-history` endpoint on the backend before it can be wired.
* `study_time_minutes` float precision issue in `crud_daily_progress.py` — deferred from previous milestone.
* Search ranking favors katakana loanwords — deferred from previous milestone.

### Files Added

* `frontend/src/pages/Review.jsx`
* `frontend/src/components/ReviewCard.jsx`
* `frontend/src/components/ReviewButtons.jsx`
* `frontend/src/components/UserMenu.jsx`
* `frontend/src/components/common/Button.jsx`
* `frontend/src/components/common/Card.jsx`
* `frontend/src/components/common/Input.jsx`
* `frontend/src/services/review.js`

### Files Updated

* `frontend/src/pages/Dashboard.jsx` — MainLayout wrap + layout restructure
* `frontend/src/components/dashboard/StatsGrid.jsx` — real API data
* `frontend/src/components/dashboard/TodayStudyCard.jsx` — real API data
* `frontend/src/components/dashboard/MyDecks.jsx` — real API data
* `frontend/src/services/dashboard.js` — added getDueCount
* `frontend/src/components/Navbar.jsx` — search icon + auth-aware logo link
* `frontend/src/App.jsx` — added `/search` and `/review` protected routes

### Current Status

* Authentication completed.
* Deck management completed.
* Flashcard CRUD completed.
* Review Engine (SRS) completed.
* Dashboard Statistics completed.
* Search frontend completed.
* Review session frontend completed.
* Dashboard wired to real API data.

### Next Milestone

* Decks page (`/decks`) — list, create, delete decks
* Deck detail page (`/decks/:id`) — view cards, remove cards, "Study this deck" button

## 2026-07-01 — Search Frontend + Romaji Pipeline + Auth Fixes

### Romaji Storage (Backend)

* Added `reading_romaji` and `example_romaji` columns to the `flashcards` table via Alembic autogenerated migration.
* Updated `app/models/flashcard.py` and all three schemas in `app/schemas/flashcard.py` (`FlashcardResponse`, `FlashcardCreate`, `FlashcardUpdate`) to include both fields.
* Updated `app/services/search_service.py` to populate both fields in `build_flashcard()` from the already-computed `word.romaji` and `word.example.romaji` values returned by `jisho.py` and `gemini.py`.
* Added `_to_response()` helper to `SearchService` — normalizes every return path to `FlashcardResponse` and self-heals legacy rows missing romaji by computing it on first access via `to_romaji()` and writing it back. Pattern matches existing get-or-create safety nets in the codebase.
* Added `response_model=FlashcardResponse` to `GET /words/search` in `app/routers/words.py`.

### Search Frontend

* `src/services/search.js` — `searchWord(query)` hits `GET /words/search`.
* `src/services/deck.js` — `listDecks()` and `addFlashcardToDeck()` with auth headers.
* `src/components/SearchBar.jsx` — controlled input with Search button and Enter-key submit, loading spinner while in flight.
* `src/components/Flashcard.jsx` — search result card showing expression (large kanji), reading, reading romaji (italic), meaning, and example sentence block with romaji and English translation. JLPT badge top-left, Add to Deck button top-right.
* `src/components/AddToDeckMenu.jsx` — dropdown that lists the user's decks, adds the card to whichever is selected, shows checkmark on success, handles 409 (already in deck) gracefully as success rather than error.
* `src/pages/Search.jsx` — full search page with loading/error/empty states. Reads `?q=` query param on mount and auto-triggers search, so dashboard suggestion pills navigate directly to a result.

### Dashboard SearchHero

* Replaced the non-functional input in `SearchHero` with a click-to-navigate button that sends the user to `/search`. Suggestion pills now navigate to `/search?q=<word>` and trigger the search automatically on arrival.

### Auth Fixes

* `src/components/LoginCard.jsx` — `getCurrentUser()` was being called without a token argument after login, causing the frontend to send `Bearer undefined` on the next request. Fixed by passing `response.access_token` directly.
* `src/services/api.js` — added global 401 handler: any unauthorized response now clears the stale token from localStorage and fires an `auth:unauthorized` event, which `AuthContext` can listen to for automatic logout. Prevents users from getting stuck in a broken authenticated state after a token expires or a key rotation.
* `app/services/users.py` — `create_user()` now creates `UserSettings` alongside `User` in a single commit via the SQLAlchemy relationship, instead of two separate commits. Atomic by construction — both rows succeed or fail together.

### Security

* Rotated all leaked credentials (Google API key, Supabase DB password, JWT `SECRET_KEY`) after `.env` was found inside a committed `backend.zip`.
* Scrubbed `backend.zip` from all git history using `git filter-repo --path backend.zip --invert-paths --force` + force-push.
* Added `.gitignore` covering `.env`, `*.zip`, `*.db`, `__pycache__/`, `venv/`, `node_modules/`, `dist/`.

### Files Added

* `backend/alembic/versions/77cdc0fd0db6_add_reading_romaji_and_example_romaji_.py`
* `frontend/src/services/search.js`
* `frontend/src/services/deck.js`
* `frontend/src/components/SearchBar.jsx`
* `frontend/src/components/Flashcard.jsx`
* `frontend/src/components/AddToDeckMenu.jsx`

### Files Updated

* `backend/app/models/flashcard.py` — added `reading_romaji`, `example_romaji`
* `backend/app/schemas/flashcard.py` — added fields to all three schemas
* `backend/app/services/search_service.py` — romaji population + `_to_response()` + `FlashcardResponse` return type
* `backend/app/routers/words.py` — added `response_model`
* `backend/app/services/users.py` — single-commit user+settings creation
* `frontend/src/services/api.js` — global 401 handler
* `frontend/src/components/LoginCard.jsx` — token passed to `getCurrentUser`
* `frontend/src/components/dashboard/SearchHero.jsx` — replaced input with navigate button
* `frontend/src/pages/Search.jsx` — full implementation with `?q=` auto-search

### Known Issues / Deferred

* Search ranking favors katakana loanwords — `select_best_entry()` scoring needs a penalty for katakana-only entries when kanji alternatives exist. Deferred.
* `study_time_minutes` float precision issue in `crud_daily_progress.py` — accumulation rounding loss over many reviews. Deferred.

### Current Status

* Authentication completed.
* Deck management completed.
* Flashcard CRUD completed.
* Review Engine (SRS) completed.
* Search frontend completed (word lookup, romaji display, add to deck).
* Dashboard frontend completed.

### Next Milestone

* Review page frontend

## 2026-06-30 — Review Engine (SRS)

### SM-2 Scheduling

* Implemented classic SM-2 in `app/services/srs_service.py` via `apply_review()`.
* On `Again`: full reset — `repetitions = 0`, `interval_days = 0`, `ease_factor` reduced by 0.2 (floor 1.3), `next_review` set to a short relearning step (10 min out), `wrong_count` incremented.
* On `Hard` / `Good` / `Easy`: standard SM-2 progression — `repetitions` incremented, `correct_count` incremented. First successful repetition (`repetitions: 0 → 1`) hardcodes `interval_days = 1` regardless of ease, matching standard SM-2's special-cased first two intervals. `Hard` advances the interval more conservatively (×0.7) and `Easy` more aggressively (×1.3) than `Good`'s straight `interval × ease_factor` — this is Anki-style behavior layered on top of pure SM-2, which has no `Hard` rating.
* Added `mastery_score` as a derived 0–100 display stat (`repetitions` capped at 8 reps → up to 70 points, plus accuracy → up to 30 points). Not used by the scheduler, purely a UI stat (deck mastery %, dashboard).

### Review Queue

* Implemented in `app/services/review_service.py`.
* `get_due_queue()` pulls two pools — cards due for review and new cards — and interleaves them Anki-style (alternating) rather than reviews-first or new-first.
* New-card pool is capped per day via `user_settings.new_cards_per_day`, tracked against today's `daily_progress.cards_learned`.
* Supports both global queues (across all decks the user can see — own decks + official decks) and single-deck queues via `deck_id`, reusing the same ownership/visibility rule as `deck_service`.
* Relearning (cards failed earlier in the same session) is handled by giving failed cards a `next_review` a few minutes out, so they naturally resurface if the session keeps polling the queue — no server-side session state is tracked. Deliberate simplification, not full Anki-style in-session relearning steps.
* `process_review()` orchestrates a single answer: gets-or-creates the `user_flashcards` row, snapshots whether this was the card's first-ever repetition (for `cards_learned` accounting) before SM-2 mutates state, applies SM-2, writes a `review_history` row, and updates today's `daily_progress`.

### user_settings Creation

* `app/services/users.py` — `create_user()` now creates a `UserSettings` row alongside the `User` row in a single commit (via the relationship), instead of `user.settings` being `None` for every newly registered user. Existing users created before this change still won't have a row, so `review_service.py` uses `crud_user_settings.get_or_create_for_user()` as a safety net rather than assuming `user.settings` is populated.

### Swagger Auth

* Swapped `app/core/auth.py` from `OAuth2PasswordBearer` to `HTTPBearer`. The OAuth2 password-flow scheme expected a form-encoded `username`/`password` POST to the token URL, which doesn't match `/auth/login`'s actual JSON `email`/`password` contract — so Swagger's Authorize dialog could never complete the flow. `HTTPBearer` shows a single plain-text token field instead: paste the `access_token` from `/auth/login`, Authorize, every subsequent request carries the header automatically. No change to the actual login flow or token format.

### Bug Found & Fixed During Testing

* `crud_user_flashcard.create_entry()` seeds a `user_flashcards` row with `next_review = now()` the moment a card is added to a deck (or forked) — not at first review. `review_service._new_flashcard_ids()` originally defined "new" as *"no `user_flashcards` row exists,"* which meant a card almost always already had a row by the time it reached the queue, so it was misclassified as a "due review" instead of "new" — making the `new_cards_per_day` cap effectively dead code (everything ever added to a deck counted as due, uncapped, from day one).
* Fixed by redefining "new" as "no row, or a row that's never actually been reviewed" (`repetitions == 0` and `last_review IS NULL`), and excluding that same condition from the due-review query so a card isn't double-counted. Confirmed via manual testing: two pre-existing untouched cards moved from `due_reviews: 2` to `new_cards: 2` after the fix.

### Files Added

* `app/services/srs_service.py`
* `app/services/review_service.py`
* `app/crud/crud_review_history.py`
* `app/crud/crud_daily_progress.py`
* `app/crud/crud_user_settings.py`
* `app/schemas/review.py`
* `app/routers/review.py`

### Files Updated

* `app/models/user_settings.py` — added `new_cards_per_day`
* `app/services/users.py` — `create_user()` creates `UserSettings` alongside `User`
* `app/core/auth.py` — `OAuth2PasswordBearer` → `HTTPBearer`
* `app/main.py` — registered review router
* Alembic — autogenerated migration for `new_cards_per_day`

### Testing

* Manually verified via Swagger UI: registered test user, created a deck, searched and added a flashcard (id 4, 猫/ねこ) to the deck, confirmed it appeared as a "new" card in `/reviews/queue`.
* Submitted `Again` — confirmed `repetitions: 0`, `interval_days: 0`, `ease_factor: 2.5 → 2.3`, `next_review` exactly 10 minutes out, `wrong_count: 1`.
* Submitted `Good` on the same card — confirmed `repetitions: 0 → 1`, `interval_days: 1`, `next_review` exactly 24 hours out, `ease_factor` unchanged at 2.3, `correct_count: 1`, `mastery_score: 24` (matches formula exactly).
* Confirmed card dropped out of both `/reviews/queue` and `due_reviews` count after being scheduled ~24h out.
* Found and fixed the due/new misclassification bug above; re-verified `due-count` after the fix (`due_reviews: 0, new_cards: 2` for two previously-misclassified untouched cards).

### Current Status

* Authentication completed.
* Deck management completed.
* Flashcard CRUD completed.
* Review Engine (SRS) completed — SM-2 scheduling, queue building (due + new, deck-scoped or global, daily new-card cap), review submission, manually tested end to end.

### Next Milestone

* Dashboard Statistics

## 2026-06-30 — Flashcard CRUD

### Standalone Flashcard Creation

* Implemented `POST /flashcards` for creating a flashcard from scratch.
* Always sets `owner_id` to the current user; not deck-scoped.
* Frontend is expected to chain this with the existing add-to-deck endpoint if the card should go in a deck immediately (no combined create+attach endpoint).

### Deck-Scoped Flashcard Editing

* Implemented `PATCH /decks/{deck_id}/flashcards/{flashcard_id}`.
* Editing is deliberately deck-scoped, not global — editing a card "as it appears in this deck" must not change how it appears in other decks.
* If the flashcard is already owned by the user, it's edited in place.
* If it's official or owned by someone else, editing creates a personal fork (`source_flashcard_id` links back to the original) with the requested changes baked in directly, rather than copying then editing.
* On fork, only the triggering deck's `deck_flashcards` row is repointed to the new fork (same position, same deck). All other decks referencing the original flashcard — including the same user's other decks — are left untouched.
* Forked flashcards get a brand-new `user_flashcards` row at default state. SRS progress does not carry over from the original, since a fork can change any field (including expression/reading), so it may no longer represent the same word.
* `FlashcardUpdate` schema treats unsent fields as "don't touch," not "set to null" (`exclude_unset=True`), so partial edits are safe.
* No standalone `PATCH /flashcards/{id}` exists — even a freshly created, unattached flashcard must be added to a deck before it can be edited. Considered and deliberately rejected to avoid a second editing pathway.

### Files Added

* `app/routers/flashcard.py`

### Files Updated

* `app/schemas/flashcard.py` — added `FlashcardCreate`, `FlashcardUpdate`
* `app/crud/crud_flashcard.py` — added `get_by_id`, `create_flashcard`
* `app/services/deck_service.py` — reworked `fork_flashcard_for_edit` to accept and apply updates during forking instead of copying then editing; added `update_flashcard_in_deck`
* `app/routers/deck.py` — added `PATCH /{deck_id}/flashcards/{flashcard_id}`
* `app/main.py` — registered flashcard router

### Testing

* Manually verified via curl: standalone create, in-place edit confirmed unchanged id, fork-on-edit confirmed new id + correct `source_flashcard_id`, deck repointing confirmed (editing deck showed the fork, other deck still showed the original), independent `user_flashcards` rows confirmed in Supabase for original vs. fork.

### Current Status

* Authentication completed.
* Intelligent flashcard search pipeline completed.
* Deck management completed (CRUD + flashcard operations).
* Flashcard CRUD completed (standalone create, deck-scoped edit with fork-on-edit).

### Next Milestone

* Review Engine (SRS)
* Dashboard Statistics

## 2026-06-30 — Deck Management

### Deck CRUD

* Implemented full deck management API.
* Decks support create, read, update, delete.
* Official decks (`owner_id = NULL`) are seed/admin-only; no API path creates them.
* Duplicate deck titles per owner are rejected at creation time.

### Deck ↔ Flashcard Operations
## 2026-06-30 — Deck Management

### Deck CRUD

* Implemented full deck management API.
* Decks support create, read, update, delete.
* Official decks (`owner_id = NULL`) are seed/admin-only; no API path creates them.
* Duplicate deck titles per owner are rejected at creation time.

### Deck ↔ Flashcard Operations

* Implemented add flashcard to deck, remove flashcard from deck, and list flashcards in a deck.
* Position is auto-assigned on insert (append to end of deck).
* Duplicate flashcard entries within the same deck are rejected (409).
* Deck flashcard listing eager-loads flashcard data to avoid N+1 queries.

### Flashcard Fork-on-Edit (prepared, not yet wired to a route)

* Added `fork_flashcard_for_edit()` in the deck service.
* Editing an official or another user's flashcard will create a personal copy linked via `source_flashcard_id`, leaving the original untouched.
* Editing a flashcard the user already owns operates in place.
* No flashcard edit/delete endpoints exist yet — this is groundwork for upcoming Flashcard CRUD.

### Files Added

* `app/crud/crud_deck.py`
* `app/crud/crud_deck_flashcard.py`
* `app/schemas/flashcard.py`
* `app/services/deck_service.py`
* `app/routers/deck.py`

### Files Updated

* `app/schemas/deck.py` — added `DeckFlashcardCreate`, `DeckFlashcardResponse`, `DeckDetailResponse`
* `app/main.py` — registered deck router

### Testing

* Manually verified via curl: create deck, search word, add flashcard to deck, list deck contents, duplicate-add rejected with 409, remove flashcard, confirmed removal.

### Current Status

* Authentication completed.
* Intelligent flashcard search pipeline completed.
* Deck management completed (CRUD + flashcard operations).

### Next Milestone

* Flashcard CRUD (standalone create/edit/delete, wiring up fork-on-edit)
* Review Engine (SRS)
* Implemented add flashcard to deck, remove flashcard from deck, and list flashcards in a deck.
* Position is auto-assigned on insert (append to end of deck).
* Duplicate flashcard entries within the same deck are rejected (409).
* Deck flashcard listing eager-loads flashcard data to avoid N+1 queries.

### Flashcard Fork-on-Edit (prepared, not yet wired to a route)

* Added `fork_flashcard_for_edit()` in the deck service.
* Editing an official or another user's flashcard will create a personal copy linked via `source_flashcard_id`, leaving the original untouched.
* Editing a flashcard the user already owns operates in place.
* No flashcard edit/delete endpoints exist yet — this is groundwork for upcoming Flashcard CRUD.

### Files Added

* `app/crud/crud_deck.py`
* `app/crud/crud_deck_flashcard.py`
* `app/schemas/flashcard.py`
* `app/services/deck_service.py`
* `app/routers/deck.py`

### Files Updated

* `app/schemas/deck.py` — added `DeckFlashcardCreate`, `DeckFlashcardResponse`, `DeckDetailResponse`
* `app/main.py` — registered deck router

### Testing

* Manually verified via curl: create deck, search word, add flashcard to deck, list deck contents, duplicate-add rejected with 409, remove flashcard, confirmed removal.

### Current Status

* Authentication completed.
* Intelligent flashcard search pipeline completed.
* Deck management completed (CRUD + flashcard operations).

### Next Milestone

* Flashcard CRUD (standalone create/edit/delete, wiring up fork-on-edit)
* Review Engine (SRS)

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

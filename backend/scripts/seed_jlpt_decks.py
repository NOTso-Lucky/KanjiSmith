"""
Seeds official (owner_id=None) JLPT vocabulary decks: N5 through N1.

Unlike seed_official_decks.py (hiragana/katakana), this script does NOT
wipe the database — it's additive, and safe to re-run. If a level's deck
already exists, that level is skipped rather than re-seeded, so running
this twice won't violate the Deck (owner_id, title) unique constraint or
create duplicate flashcards.

Data source: elzup/jlpt-word-list (MIT licensed), derived from the
community-compiled tanos.co.uk JLPT reference lists. No official JLPT
vocabulary list exists — this is the best available approximation, same
lineage used by several other JLPT study tools.

Before running, download the source CSVs into scripts/data/:
    mkdir -p scripts/data
    curl -s https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n5.csv -o scripts/data/n5.csv
    curl -s https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n4.csv -o scripts/data/n4.csv
    curl -s https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n3.csv -o scripts/data/n3.csv
    curl -s https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n2.csv -o scripts/data/n2.csv
    curl -s https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n1.csv -o scripts/data/n1.csv

Then run from the backend/ folder:
    python -m scripts.seed_jlpt_decks

Example sentences are intentionally left blank here (example_sentence,
example_romaji, example_translation all None). They're backfilled lazily
via Gemini the first time a user actually reviews a card that's missing
one — see the backfill logic wired into the review flow — rather than
generating ~8,000 examples up front, which would take hours and likely
hit free-tier Gemini rate limits.
"""

import csv
import os

from app.db.database import SessionLocal
from app.models.deck import Deck
from app.models.deck_flashcard import DeckFlashcard
from app.models.flashcard import Flashcard
from app.models.enums import CardType, JLPTLevel
from app.services.romaji import to_romaji

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

LEVELS = [
    ("n5", JLPTLevel.N5, "JLPT N5 Vocabulary", "Beginner vocabulary for the JLPT N5 level."),
    ("n4", JLPTLevel.N4, "JLPT N4 Vocabulary", "Vocabulary for the JLPT N4 level."),
    ("n3", JLPTLevel.N3, "JLPT N3 Vocabulary", "Vocabulary for the JLPT N3 level."),
    ("n2", JLPTLevel.N2, "JLPT N2 Vocabulary", "Vocabulary for the JLPT N2 level."),
    ("n1", JLPTLevel.N1, "JLPT N1 Vocabulary", "Advanced vocabulary for the JLPT N1 level."),
]


def load_and_clean(csv_path: str, seen: set[tuple[str, str]]) -> list[dict]:
    """
    Reads one level's CSV, cleans messy rows, and skips any (expression,
    reading) pair already seen in an earlier (easier) level — `seen` is
    shared and mutated across all levels, processed N5 -> N1, so a word
    appearing in multiple levels keeps its easiest classification.
    """
    entries = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Some rows list alternates like "足; 脚" or "いく; ゆく" —
            # take the first (primary) alternative for both columns.
            expression = row["expression"].strip().split(";")[0].strip()
            reading = row["reading"].strip().split(";")[0].strip()
            meaning = row["meaning"].strip().replace("; ", ", ").replace(";", ", ")

            if not expression or not reading:
                continue

            key = (expression, reading)
            if key in seen:
                continue
            seen.add(key)

            entries.append({
                "expression": expression,
                "reading": reading,
                "meaning": meaning,
            })

    return entries


def seed_level(db, title: str, description: str, jlpt_level: JLPTLevel, entries: list[dict]) -> None:
    existing = (
        db.query(Deck)
        .filter(Deck.owner_id.is_(None), Deck.title == title)
        .first()
    )

    if existing:
        print(f"'{title}' already exists (deck id {existing.id}) — skipping.")
        return

    print(f"Seeding '{title}' ({len(entries)} words)...")

    deck = Deck(owner_id=None, title=title, description=description)
    db.add(deck)
    db.flush()

    flashcards = [
        Flashcard(
            owner_id=None,
            expression=entry["expression"],
            reading=entry["reading"],
            reading_romaji=to_romaji(entry["reading"]),
            meaning=entry["meaning"],
            example_sentence=None,
            example_romaji=None,
            example_translation=None,
            notes=None,
            jlpt_level=jlpt_level,
            card_type=CardType.VOCABULARY,
        )
        for entry in entries
    ]

    db.add_all(flashcards)
    db.flush()  # assigns ids to every flashcard in one batch

    deck_flashcards = [
        DeckFlashcard(deck_id=deck.id, flashcard_id=fc.id, position=i + 1)
        for i, fc in enumerate(flashcards)
    ]
    db.add_all(deck_flashcards)

    db.commit()
    print(f"'{title}' seeded ({len(flashcards)} cards).\n")


def main() -> None:
    db = SessionLocal()
    seen: set[tuple[str, str]] = set()

    try:
        for slug, jlpt_level, title, description in LEVELS:
            csv_path = os.path.join(DATA_DIR, f"{slug}.csv")

            if not os.path.exists(csv_path):
                print(f"Missing {csv_path} — did you run the curl download step? Skipping {title}.")
                continue

            entries = load_and_clean(csv_path, seen)
            seed_level(db, title, description, jlpt_level, entries)

        print("Done. JLPT N5-N1 official decks are live.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
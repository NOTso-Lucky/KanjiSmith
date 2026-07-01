"""
Seeds official (owner_id=None) content into the database.

WARNING: This wipes every table and rebuilds the schema from the current
SQLAlchemy models before seeding. This is destructive and intentional —
per project decision, official content seeding starts from a clean slate
(no leftover test users, decks, flashcards, or review history).

Run from the backend/ folder:
    python -m scripts.seed_official_decks

Currently seeds:
    - Hiragana deck (104 kana: base + dakuten + handakuten + yoon)
    - Katakana deck (same structure)

JLPT vocab decks (N5-N1) will be added in a follow-up pass once the
vocab source data is ready.
"""

import sys

from app.db.database import engine, SessionLocal
from app.models.base import Base
import app.models  # noqa: F401 - ensures every model is registered on Base.metadata

from app.models.deck import Deck
from app.models.deck_flashcard import DeckFlashcard
from app.models.flashcard import Flashcard
from app.models.enums import CardType

CONFIRM_PHRASE = "WIPE"


HIRAGANA_ENTRIES = [
    {"expression": 'あ', "reading": 'a', "meaning": 'Hiragana character "a"'},
    {"expression": 'い', "reading": 'i', "meaning": 'Hiragana character "i"'},
    {"expression": 'う', "reading": 'u', "meaning": 'Hiragana character "u"'},
    {"expression": 'え', "reading": 'e', "meaning": 'Hiragana character "e"'},
    {"expression": 'お', "reading": 'o', "meaning": 'Hiragana character "o"'},
    {"expression": 'か', "reading": 'ka', "meaning": 'Hiragana character "ka"'},
    {"expression": 'き', "reading": 'ki', "meaning": 'Hiragana character "ki"'},
    {"expression": 'く', "reading": 'ku', "meaning": 'Hiragana character "ku"'},
    {"expression": 'け', "reading": 'ke', "meaning": 'Hiragana character "ke"'},
    {"expression": 'こ', "reading": 'ko', "meaning": 'Hiragana character "ko"'},
    {"expression": 'さ', "reading": 'sa', "meaning": 'Hiragana character "sa"'},
    {"expression": 'し', "reading": 'shi', "meaning": 'Hiragana character "shi"'},
    {"expression": 'す', "reading": 'su', "meaning": 'Hiragana character "su"'},
    {"expression": 'せ', "reading": 'se', "meaning": 'Hiragana character "se"'},
    {"expression": 'そ', "reading": 'so', "meaning": 'Hiragana character "so"'},
    {"expression": 'た', "reading": 'ta', "meaning": 'Hiragana character "ta"'},
    {"expression": 'ち', "reading": 'chi', "meaning": 'Hiragana character "chi"'},
    {"expression": 'つ', "reading": 'tsu', "meaning": 'Hiragana character "tsu"'},
    {"expression": 'て', "reading": 'te', "meaning": 'Hiragana character "te"'},
    {"expression": 'と', "reading": 'to', "meaning": 'Hiragana character "to"'},
    {"expression": 'な', "reading": 'na', "meaning": 'Hiragana character "na"'},
    {"expression": 'に', "reading": 'ni', "meaning": 'Hiragana character "ni"'},
    {"expression": 'ぬ', "reading": 'nu', "meaning": 'Hiragana character "nu"'},
    {"expression": 'ね', "reading": 'ne', "meaning": 'Hiragana character "ne"'},
    {"expression": 'の', "reading": 'no', "meaning": 'Hiragana character "no"'},
    {"expression": 'は', "reading": 'ha', "meaning": 'Hiragana character "ha"'},
    {"expression": 'ひ', "reading": 'hi', "meaning": 'Hiragana character "hi"'},
    {"expression": 'ふ', "reading": 'fu', "meaning": 'Hiragana character "fu"'},
    {"expression": 'へ', "reading": 'he', "meaning": 'Hiragana character "he"'},
    {"expression": 'ほ', "reading": 'ho', "meaning": 'Hiragana character "ho"'},
    {"expression": 'ま', "reading": 'ma', "meaning": 'Hiragana character "ma"'},
    {"expression": 'み', "reading": 'mi', "meaning": 'Hiragana character "mi"'},
    {"expression": 'む', "reading": 'mu', "meaning": 'Hiragana character "mu"'},
    {"expression": 'め', "reading": 'me', "meaning": 'Hiragana character "me"'},
    {"expression": 'も', "reading": 'mo', "meaning": 'Hiragana character "mo"'},
    {"expression": 'や', "reading": 'ya', "meaning": 'Hiragana character "ya"'},
    {"expression": 'ゆ', "reading": 'yu', "meaning": 'Hiragana character "yu"'},
    {"expression": 'よ', "reading": 'yo', "meaning": 'Hiragana character "yo"'},
    {"expression": 'ら', "reading": 'ra', "meaning": 'Hiragana character "ra"'},
    {"expression": 'り', "reading": 'ri', "meaning": 'Hiragana character "ri"'},
    {"expression": 'る', "reading": 'ru', "meaning": 'Hiragana character "ru"'},
    {"expression": 'れ', "reading": 're', "meaning": 'Hiragana character "re"'},
    {"expression": 'ろ', "reading": 'ro', "meaning": 'Hiragana character "ro"'},
    {"expression": 'わ', "reading": 'wa', "meaning": 'Hiragana character "wa"'},
    {"expression": 'を', "reading": 'wo', "meaning": 'Hiragana character "wo"'},
    {"expression": 'ん', "reading": 'n', "meaning": 'Hiragana character "n"'},
    {"expression": 'が', "reading": 'ga', "meaning": 'Hiragana character "ga"'},
    {"expression": 'ぎ', "reading": 'gi', "meaning": 'Hiragana character "gi"'},
    {"expression": 'ぐ', "reading": 'gu', "meaning": 'Hiragana character "gu"'},
    {"expression": 'げ', "reading": 'ge', "meaning": 'Hiragana character "ge"'},
    {"expression": 'ご', "reading": 'go', "meaning": 'Hiragana character "go"'},
    {"expression": 'ざ', "reading": 'za', "meaning": 'Hiragana character "za"'},
    {"expression": 'じ', "reading": 'ji', "meaning": 'Hiragana character "ji"'},
    {"expression": 'ず', "reading": 'zu', "meaning": 'Hiragana character "zu"'},
    {"expression": 'ぜ', "reading": 'ze', "meaning": 'Hiragana character "ze"'},
    {"expression": 'ぞ', "reading": 'zo', "meaning": 'Hiragana character "zo"'},
    {"expression": 'だ', "reading": 'da', "meaning": 'Hiragana character "da"'},
    {"expression": 'ぢ', "reading": 'di', "meaning": 'Hiragana character "di"'},
    {"expression": 'づ', "reading": 'du', "meaning": 'Hiragana character "du"'},
    {"expression": 'で', "reading": 'de', "meaning": 'Hiragana character "de"'},
    {"expression": 'ど', "reading": 'do', "meaning": 'Hiragana character "do"'},
    {"expression": 'ば', "reading": 'ba', "meaning": 'Hiragana character "ba"'},
    {"expression": 'び', "reading": 'bi', "meaning": 'Hiragana character "bi"'},
    {"expression": 'ぶ', "reading": 'bu', "meaning": 'Hiragana character "bu"'},
    {"expression": 'べ', "reading": 'be', "meaning": 'Hiragana character "be"'},
    {"expression": 'ぼ', "reading": 'bo', "meaning": 'Hiragana character "bo"'},
    {"expression": 'ぱ', "reading": 'pa', "meaning": 'Hiragana character "pa"'},
    {"expression": 'ぴ', "reading": 'pi', "meaning": 'Hiragana character "pi"'},
    {"expression": 'ぷ', "reading": 'pu', "meaning": 'Hiragana character "pu"'},
    {"expression": 'ぺ', "reading": 'pe', "meaning": 'Hiragana character "pe"'},
    {"expression": 'ぽ', "reading": 'po', "meaning": 'Hiragana character "po"'},
    {"expression": 'きゃ', "reading": 'kya', "meaning": 'Hiragana character "kya"'},
    {"expression": 'きゅ', "reading": 'kyu', "meaning": 'Hiragana character "kyu"'},
    {"expression": 'きょ', "reading": 'kyo', "meaning": 'Hiragana character "kyo"'},
    {"expression": 'ぎゃ', "reading": 'gya', "meaning": 'Hiragana character "gya"'},
    {"expression": 'ぎゅ', "reading": 'gyu', "meaning": 'Hiragana character "gyu"'},
    {"expression": 'ぎょ', "reading": 'gyo', "meaning": 'Hiragana character "gyo"'},
    {"expression": 'にゃ', "reading": 'nya', "meaning": 'Hiragana character "nya"'},
    {"expression": 'にゅ', "reading": 'nyu', "meaning": 'Hiragana character "nyu"'},
    {"expression": 'にょ', "reading": 'nyo', "meaning": 'Hiragana character "nyo"'},
    {"expression": 'ひゃ', "reading": 'hya', "meaning": 'Hiragana character "hya"'},
    {"expression": 'ひゅ', "reading": 'hyu', "meaning": 'Hiragana character "hyu"'},
    {"expression": 'ひょ', "reading": 'hyo', "meaning": 'Hiragana character "hyo"'},
    {"expression": 'びゃ', "reading": 'bya', "meaning": 'Hiragana character "bya"'},
    {"expression": 'びゅ', "reading": 'byu', "meaning": 'Hiragana character "byu"'},
    {"expression": 'びょ', "reading": 'byo', "meaning": 'Hiragana character "byo"'},
    {"expression": 'ぴゃ', "reading": 'pya', "meaning": 'Hiragana character "pya"'},
    {"expression": 'ぴゅ', "reading": 'pyu', "meaning": 'Hiragana character "pyu"'},
    {"expression": 'ぴょ', "reading": 'pyo', "meaning": 'Hiragana character "pyo"'},
    {"expression": 'みゃ', "reading": 'mya', "meaning": 'Hiragana character "mya"'},
    {"expression": 'みゅ', "reading": 'myu', "meaning": 'Hiragana character "myu"'},
    {"expression": 'みょ', "reading": 'myo', "meaning": 'Hiragana character "myo"'},
    {"expression": 'りゃ', "reading": 'rya', "meaning": 'Hiragana character "rya"'},
    {"expression": 'りゅ', "reading": 'ryu', "meaning": 'Hiragana character "ryu"'},
    {"expression": 'りょ', "reading": 'ryo', "meaning": 'Hiragana character "ryo"'},
    {"expression": 'しゃ', "reading": 'sha', "meaning": 'Hiragana character "sha"'},
    {"expression": 'しゅ', "reading": 'shu', "meaning": 'Hiragana character "shu"'},
    {"expression": 'しょ', "reading": 'sho', "meaning": 'Hiragana character "sho"'},
    {"expression": 'じゃ', "reading": 'ja', "meaning": 'Hiragana character "ja"'},
    {"expression": 'じゅ', "reading": 'ju', "meaning": 'Hiragana character "ju"'},
    {"expression": 'じょ', "reading": 'jo', "meaning": 'Hiragana character "jo"'},
    {"expression": 'ちゃ', "reading": 'cha', "meaning": 'Hiragana character "cha"'},
    {"expression": 'ちゅ', "reading": 'chu', "meaning": 'Hiragana character "chu"'},
    {"expression": 'ちょ', "reading": 'cho', "meaning": 'Hiragana character "cho"'},
]

KATAKANA_ENTRIES = [
    {"expression": 'ア', "reading": 'a', "meaning": 'Katakana character "a"'},
    {"expression": 'イ', "reading": 'i', "meaning": 'Katakana character "i"'},
    {"expression": 'ウ', "reading": 'u', "meaning": 'Katakana character "u"'},
    {"expression": 'エ', "reading": 'e', "meaning": 'Katakana character "e"'},
    {"expression": 'オ', "reading": 'o', "meaning": 'Katakana character "o"'},
    {"expression": 'カ', "reading": 'ka', "meaning": 'Katakana character "ka"'},
    {"expression": 'キ', "reading": 'ki', "meaning": 'Katakana character "ki"'},
    {"expression": 'ク', "reading": 'ku', "meaning": 'Katakana character "ku"'},
    {"expression": 'ケ', "reading": 'ke', "meaning": 'Katakana character "ke"'},
    {"expression": 'コ', "reading": 'ko', "meaning": 'Katakana character "ko"'},
    {"expression": 'サ', "reading": 'sa', "meaning": 'Katakana character "sa"'},
    {"expression": 'シ', "reading": 'shi', "meaning": 'Katakana character "shi"'},
    {"expression": 'ス', "reading": 'su', "meaning": 'Katakana character "su"'},
    {"expression": 'セ', "reading": 'se', "meaning": 'Katakana character "se"'},
    {"expression": 'ソ', "reading": 'so', "meaning": 'Katakana character "so"'},
    {"expression": 'タ', "reading": 'ta', "meaning": 'Katakana character "ta"'},
    {"expression": 'チ', "reading": 'chi', "meaning": 'Katakana character "chi"'},
    {"expression": 'ツ', "reading": 'tsu', "meaning": 'Katakana character "tsu"'},
    {"expression": 'テ', "reading": 'te', "meaning": 'Katakana character "te"'},
    {"expression": 'ト', "reading": 'to', "meaning": 'Katakana character "to"'},
    {"expression": 'ナ', "reading": 'na', "meaning": 'Katakana character "na"'},
    {"expression": 'ニ', "reading": 'ni', "meaning": 'Katakana character "ni"'},
    {"expression": 'ヌ', "reading": 'nu', "meaning": 'Katakana character "nu"'},
    {"expression": 'ネ', "reading": 'ne', "meaning": 'Katakana character "ne"'},
    {"expression": 'ノ', "reading": 'no', "meaning": 'Katakana character "no"'},
    {"expression": 'ハ', "reading": 'ha', "meaning": 'Katakana character "ha"'},
    {"expression": 'ヒ', "reading": 'hi', "meaning": 'Katakana character "hi"'},
    {"expression": 'フ', "reading": 'fu', "meaning": 'Katakana character "fu"'},
    {"expression": 'ヘ', "reading": 'he', "meaning": 'Katakana character "he"'},
    {"expression": 'ホ', "reading": 'ho', "meaning": 'Katakana character "ho"'},
    {"expression": 'マ', "reading": 'ma', "meaning": 'Katakana character "ma"'},
    {"expression": 'ミ', "reading": 'mi', "meaning": 'Katakana character "mi"'},
    {"expression": 'ム', "reading": 'mu', "meaning": 'Katakana character "mu"'},
    {"expression": 'メ', "reading": 'me', "meaning": 'Katakana character "me"'},
    {"expression": 'モ', "reading": 'mo', "meaning": 'Katakana character "mo"'},
    {"expression": 'ヤ', "reading": 'ya', "meaning": 'Katakana character "ya"'},
    {"expression": 'ユ', "reading": 'yu', "meaning": 'Katakana character "yu"'},
    {"expression": 'ヨ', "reading": 'yo', "meaning": 'Katakana character "yo"'},
    {"expression": 'ラ', "reading": 'ra', "meaning": 'Katakana character "ra"'},
    {"expression": 'リ', "reading": 'ri', "meaning": 'Katakana character "ri"'},
    {"expression": 'ル', "reading": 'ru', "meaning": 'Katakana character "ru"'},
    {"expression": 'レ', "reading": 're', "meaning": 'Katakana character "re"'},
    {"expression": 'ロ', "reading": 'ro', "meaning": 'Katakana character "ro"'},
    {"expression": 'ワ', "reading": 'wa', "meaning": 'Katakana character "wa"'},
    {"expression": 'ヲ', "reading": 'wo', "meaning": 'Katakana character "wo"'},
    {"expression": 'ン', "reading": 'n', "meaning": 'Katakana character "n"'},
    {"expression": 'ガ', "reading": 'ga', "meaning": 'Katakana character "ga"'},
    {"expression": 'ギ', "reading": 'gi', "meaning": 'Katakana character "gi"'},
    {"expression": 'グ', "reading": 'gu', "meaning": 'Katakana character "gu"'},
    {"expression": 'ゲ', "reading": 'ge', "meaning": 'Katakana character "ge"'},
    {"expression": 'ゴ', "reading": 'go', "meaning": 'Katakana character "go"'},
    {"expression": 'ザ', "reading": 'za', "meaning": 'Katakana character "za"'},
    {"expression": 'ジ', "reading": 'ji', "meaning": 'Katakana character "ji"'},
    {"expression": 'ズ', "reading": 'zu', "meaning": 'Katakana character "zu"'},
    {"expression": 'ゼ', "reading": 'ze', "meaning": 'Katakana character "ze"'},
    {"expression": 'ゾ', "reading": 'zo', "meaning": 'Katakana character "zo"'},
    {"expression": 'ダ', "reading": 'da', "meaning": 'Katakana character "da"'},
    {"expression": 'ヂ', "reading": 'di', "meaning": 'Katakana character "di"'},
    {"expression": 'ヅ', "reading": 'du', "meaning": 'Katakana character "du"'},
    {"expression": 'デ', "reading": 'de', "meaning": 'Katakana character "de"'},
    {"expression": 'ド', "reading": 'do', "meaning": 'Katakana character "do"'},
    {"expression": 'バ', "reading": 'ba', "meaning": 'Katakana character "ba"'},
    {"expression": 'ビ', "reading": 'bi', "meaning": 'Katakana character "bi"'},
    {"expression": 'ブ', "reading": 'bu', "meaning": 'Katakana character "bu"'},
    {"expression": 'ベ', "reading": 'be', "meaning": 'Katakana character "be"'},
    {"expression": 'ボ', "reading": 'bo', "meaning": 'Katakana character "bo"'},
    {"expression": 'パ', "reading": 'pa', "meaning": 'Katakana character "pa"'},
    {"expression": 'ピ', "reading": 'pi', "meaning": 'Katakana character "pi"'},
    {"expression": 'プ', "reading": 'pu', "meaning": 'Katakana character "pu"'},
    {"expression": 'ペ', "reading": 'pe', "meaning": 'Katakana character "pe"'},
    {"expression": 'ポ', "reading": 'po', "meaning": 'Katakana character "po"'},
    {"expression": 'キャ', "reading": 'kya', "meaning": 'Katakana character "kya"'},
    {"expression": 'キュ', "reading": 'kyu', "meaning": 'Katakana character "kyu"'},
    {"expression": 'キョ', "reading": 'kyo', "meaning": 'Katakana character "kyo"'},
    {"expression": 'ギャ', "reading": 'gya', "meaning": 'Katakana character "gya"'},
    {"expression": 'ギュ', "reading": 'gyu', "meaning": 'Katakana character "gyu"'},
    {"expression": 'ギョ', "reading": 'gyo', "meaning": 'Katakana character "gyo"'},
    {"expression": 'ニャ', "reading": 'nya', "meaning": 'Katakana character "nya"'},
    {"expression": 'ニュ', "reading": 'nyu', "meaning": 'Katakana character "nyu"'},
    {"expression": 'ニョ', "reading": 'nyo', "meaning": 'Katakana character "nyo"'},
    {"expression": 'ヒャ', "reading": 'hya', "meaning": 'Katakana character "hya"'},
    {"expression": 'ヒュ', "reading": 'hyu', "meaning": 'Katakana character "hyu"'},
    {"expression": 'ヒョ', "reading": 'hyo', "meaning": 'Katakana character "hyo"'},
    {"expression": 'ビャ', "reading": 'bya', "meaning": 'Katakana character "bya"'},
    {"expression": 'ビュ', "reading": 'byu', "meaning": 'Katakana character "byu"'},
    {"expression": 'ビョ', "reading": 'byo', "meaning": 'Katakana character "byo"'},
    {"expression": 'ピャ', "reading": 'pya', "meaning": 'Katakana character "pya"'},
    {"expression": 'ピュ', "reading": 'pyu', "meaning": 'Katakana character "pyu"'},
    {"expression": 'ピョ', "reading": 'pyo', "meaning": 'Katakana character "pyo"'},
    {"expression": 'ミャ', "reading": 'mya', "meaning": 'Katakana character "mya"'},
    {"expression": 'ミュ', "reading": 'myu', "meaning": 'Katakana character "myu"'},
    {"expression": 'ミョ', "reading": 'myo', "meaning": 'Katakana character "myo"'},
    {"expression": 'リャ', "reading": 'rya', "meaning": 'Katakana character "rya"'},
    {"expression": 'リュ', "reading": 'ryu', "meaning": 'Katakana character "ryu"'},
    {"expression": 'リョ', "reading": 'ryo', "meaning": 'Katakana character "ryo"'},
    {"expression": 'シャ', "reading": 'sha', "meaning": 'Katakana character "sha"'},
    {"expression": 'シュ', "reading": 'shu', "meaning": 'Katakana character "shu"'},
    {"expression": 'ショ', "reading": 'sho', "meaning": 'Katakana character "sho"'},
    {"expression": 'ジャ', "reading": 'ja', "meaning": 'Katakana character "ja"'},
    {"expression": 'ジュ', "reading": 'ju', "meaning": 'Katakana character "ju"'},
    {"expression": 'ジョ', "reading": 'jo', "meaning": 'Katakana character "jo"'},
    {"expression": 'チャ', "reading": 'cha', "meaning": 'Katakana character "cha"'},
    {"expression": 'チュ', "reading": 'chu', "meaning": 'Katakana character "chu"'},
    {"expression": 'チョ', "reading": 'cho', "meaning": 'Katakana character "cho"'},
]


def wipe_database() -> None:
    print(
        "\nThis will PERMANENTLY DELETE every row in every table "
        "(users, decks, flashcards, review history, everything) and "
        "rebuild the schema fresh from the current models.\n"
    )
    response = input(f"Type '{CONFIRM_PHRASE}' to confirm, anything else to abort: ")

    if response != CONFIRM_PHRASE:
        print("Aborted. No changes made.")
        sys.exit(1)

    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)

    print("Recreating schema from current models...")
    Base.metadata.create_all(bind=engine)

    print("Database wiped and schema rebuilt.\n")


def seed_kana_deck(db, title: str, description: str, entries: list[dict]) -> None:
    print(f"Seeding '{title}' ({len(entries)} cards)...")

    deck = Deck(
        owner_id=None,
        title=title,
        description=description,
    )
    db.add(deck)
    db.flush()  # assigns deck.id without committing yet

    for position, entry in enumerate(entries, start=1):
        flashcard = Flashcard(
            owner_id=None,
            expression=entry["expression"],
            reading=entry["reading"],
            reading_romaji=entry["reading"].capitalize(),
            meaning=entry["meaning"],
            example_sentence=None,
            example_romaji=None,
            example_translation=None,
            notes=None,
            jlpt_level=None,
            card_type=CardType.KANA,
        )
        db.add(flashcard)
        db.flush()  # assigns flashcard.id

        db.add(
            DeckFlashcard(
                deck_id=deck.id,
                flashcard_id=flashcard.id,
                position=position,
            )
        )

    db.commit()
    print(f"'{title}' seeded.\n")


def main() -> None:
    wipe_database()

    db = SessionLocal()
    try:
        seed_kana_deck(
            db,
            title="Hiragana",
            description="All 104 hiragana characters: base, dakuten, handakuten, and yoon combos.",
            entries=HIRAGANA_ENTRIES,
        )
        seed_kana_deck(
            db,
            title="Katakana",
            description="All 104 katakana characters: base, dakuten, handakuten, and yoon combos.",
            entries=KATAKANA_ENTRIES,
        )
        print("Done. Hiragana and Katakana official decks are live.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
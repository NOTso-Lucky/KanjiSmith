"""add KANA to cardtype enum

Revision ID: 851ac937be5a
Revises: 77cdc0fd0db6
Create Date: 2026-07-01 23:15:51.092361

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '851ac937be5a'
down_revision: Union[str, Sequence[str], None] = '77cdc0fd0db6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE cardtype ADD VALUE IF NOT EXISTS 'KANA'")


def downgrade() -> None:
    """Downgrade schema."""
    # Postgres does not support removing values from an enum type directly.
    # Rebuild the type without KANA, remapping any KANA rows to VOCABULARY
    # first so column values stay valid during the swap.
    op.execute("ALTER TYPE cardtype RENAME TO cardtype_old")
    op.execute(
        "CREATE TYPE cardtype AS ENUM ('VOCABULARY', 'KANJI', 'GRAMMAR', 'EXPRESSION')"
    )
    op.execute("UPDATE flashcards SET card_type = 'VOCABULARY' WHERE card_type::text = 'KANA'")
    op.execute(
        "ALTER TABLE flashcards ALTER COLUMN card_type TYPE cardtype USING card_type::text::cardtype"
    )
    op.execute("DROP TYPE cardtype_old")
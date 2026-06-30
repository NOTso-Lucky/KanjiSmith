from pydantic import ConfigDict
from pydantic import BaseModel

from app.models.enums import CardType, JLPTLevel


class FlashcardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int | None
    source_flashcard_id: int | None

    expression: str
    reading: str
    meaning: str

    example_sentence: str | None
    example_translation: str | None
    notes: str | None

    jlpt_level: JLPTLevel | None
    card_type: CardType
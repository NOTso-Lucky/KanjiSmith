from pydantic import BaseModel
class ExampleSentence(BaseModel):
    japanese: str
    romaji: str
    english: str
class WordResponse(BaseModel):
    word: str
    reading: str
    romaji: str
    meaning: str

    jlpt: str | None=None
    
    example: ExampleSentence | None=None
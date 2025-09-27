from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from loguru import logger
from ..services.diary_service import get_diary_entry_by_date
from ..services.sentiment_service import analyze_sentiment

router = APIRouter(prefix="/sentiment", tags=["sentiment"])

class SentimentResponse(BaseModel):
    date: str
    sentiment: float

class AnalyzeSentimentRequest(BaseModel):
    text: str

class AnalyzeSentimentResponse(BaseModel):
    sentiment: float

@router.get("/{date}", response_model=SentimentResponse)
async def get_sentiment(date: str):
    """Get sentiment of diary entry for the given date (YYYY-MM-DD)."""
    try:
        entry = await get_diary_entry_by_date(date)
        if entry is None:
            raise HTTPException(status_code=404, detail="Diary entry not found for the given date.")
        # Extract the text after the date line
        lines = entry.split('\n', 1)
        if len(lines) > 1:
            text = lines[1].strip()
        else:
            text = entry.strip()
        sentiment = await analyze_sentiment(text)
        return SentimentResponse(date=date, sentiment=sentiment)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting sentiment: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze sentiment.")

@router.post("/analyze", response_model=AnalyzeSentimentResponse)
async def analyze_text_sentiment(request: AnalyzeSentimentRequest):
    """Analyze sentiment of provided text."""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty.")
        sentiment = await analyze_sentiment(request.text)
        return AnalyzeSentimentResponse(sentiment=sentiment)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze sentiment.")

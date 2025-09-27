from textblob import TextBlob
from typing import Optional
from loguru import logger

async def analyze_sentiment(text: str) -> float:
    """Analyze sentiment of the given text."""
    try:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity  # -1 (negative) to 1 (positive)
        logger.info(f"Sentiment analysis completed for text: polarity={polarity}")
        return polarity
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}")
        return 0.0

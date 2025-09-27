from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List
from loguru import logger
from ..services.diary_service import save_diary_entry, get_diary_entry_by_date, get_all_entries
from ..services.embeddings_service import update_embeddings
from ..services.sentiment_service import analyze_sentiment
from ..dependencies import get_db_manager
from ..db.chromadb import ChromaDBManager
import logging

router = APIRouter(prefix="/diary", tags=["diary"])

class DiaryEntry(BaseModel):
    entry: str

class DiaryResponse(BaseModel):
    status: str
    message: str

@router.post("/", response_model=DiaryResponse)
async def save_diary(entry: DiaryEntry, background_tasks: BackgroundTasks, db_manager: ChromaDBManager = Depends(get_db_manager)):
    """Save a diary entry and trigger background tasks for embeddings."""
    try:
        await save_diary_entry(entry.entry)
        # Add background task to update embeddings
        if db_manager:
            background_tasks.add_task(update_embeddings, db_manager)
        logger.info("Diary entry saved and background tasks scheduled.")
        return DiaryResponse(status="success", message="Diary entry saved successfully.")
    except Exception as e:
        logger.error(f"Error saving diary entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to save diary entry.")

@router.get("/all", response_model=List[str])
async def get_all_diary_entries():
    """Retrieve all diary entries."""
    try:
        entries = await get_all_entries()
        return entries
    except Exception as e:
        logger.error(f"Error retrieving all diary entries: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve diary entries.")

@router.get("/{date}", response_model=Optional[str])
async def get_diary(date: str):
    """Retrieve diary entry by date (YYYY-MM-DD)."""
    try:
        entry = await get_diary_entry_by_date(date)
        if entry is None:
            raise HTTPException(status_code=404, detail="Diary entry not found for the given date.")
        return entry
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving diary entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve diary entry.")

class AnalyzeRequest(BaseModel):
    query: str

@router.post("/analyze", response_model=str)
async def analyze_diary(query: AnalyzeRequest, db_manager: ChromaDBManager = Depends(get_db_manager)):
    """Analyze diary based on query, using sentiment or LLM."""
    try:
        entries = await get_all_entries()
        if not entries:
            return "No diary entries found. Please add some entries first."

        lower_query = query.query.lower()
        analyzed_entries = []

        if "happy" in lower_query or "joy" in lower_query:
            analyzed_entries = [entry for entry in entries if await analyze_sentiment(entry) > 0.5]
            if analyzed_entries:
                return f"You seemed happy or joyful in the following entries:\n{chr(10).join(analyzed_entries)}"
            else:
                return "I couldn't find any clear indications of happiness in your diary."

        elif "sad" in lower_query or "down" in lower_query:
            analyzed_entries = [entry for entry in entries if await analyze_sentiment(entry) < -0.5]
            if analyzed_entries:
                return f"You seemed sad or down in the following entries:\n{chr(10).join(analyzed_entries)}"
            else:
                return "I couldn't find any clear indications of sadness in your diary."

        elif "angry" in lower_query or "frustrated" in lower_query:
            analyzed_entries = [entry for entry in entries if -0.5 <= await analyze_sentiment(entry) < 0]
            if analyzed_entries:
                return f"You seemed angry or frustrated in the following entries:\n{chr(10).join(analyzed_entries)}"
            else:
                return "I couldn't find any clear indications of anger in your diary."

        elif "calm" in lower_query or "peaceful" in lower_query:
            analyzed_entries = [entry for entry in entries if 0 <= await analyze_sentiment(entry) <= 0.5]
            if analyzed_entries:
                return f"You seemed calm or peaceful in the following entries:\n{chr(10).join(analyzed_entries)}"
            else:
                return "I couldn't find any clear indications of calmness in your diary."

        # Default to LLM query
        from ..services.llm_service import query_llm
        return await query_llm(db_manager, query.query)

    except Exception as e:
        logger.error(f"Error analyzing diary: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze diary.")

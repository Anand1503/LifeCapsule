import aiofiles
import os
from datetime import datetime
from typing import Optional, List
from loguru import logger

DIARY_FILE_PATH = os.path.join(os.path.dirname(__file__), "../../data/diary.txt")

async def save_diary_entry(entry: str) -> None:
    """Save a diary entry asynchronously."""
    try:
        timestamp = datetime.now().strftime("%B %d, %Y")
        formatted_entry = f"{timestamp}:\n{entry.strip()}\n\n"
        async with aiofiles.open(DIARY_FILE_PATH, 'a') as file:
            await file.write(formatted_entry)
        logger.info(f"Diary entry saved for {timestamp}.")
    except Exception as e:
        logger.error(f"Error saving diary entry: {e}")
        raise

async def load_diary_entries() -> str:
    """Load all diary entries asynchronously."""
    try:
        if os.path.exists(DIARY_FILE_PATH):
            async with aiofiles.open(DIARY_FILE_PATH, 'r') as file:
                return await file.read()
        return ""
    except Exception as e:
        logger.error(f"Error loading diary entries: {e}")
        return ""

async def get_diary_entry_by_date(date_str: str) -> Optional[str]:
    """Get diary entry by date. Date format: YYYY-MM-DD."""
    try:
        # Parse date
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        formatted_date = date_obj.strftime("%B %d, %Y")

        content = await load_diary_entries()
        entries = content.split("\n\n")
        for entry in entries:
            if entry.startswith(formatted_date):
                return entry.strip()
        return None
    except ValueError:
        logger.error(f"Invalid date format: {date_str}")
        return None
    except Exception as e:
        logger.error(f"Error getting diary entry: {e}")
        return None

async def get_all_entries() -> List[str]:
    """Get all diary entries as list."""
    content = await load_diary_entries()
    if not content.strip():
        return []
    return [entry.strip() for entry in content.split("\n\n") if entry.strip()]

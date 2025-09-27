from loguru import logger
from ..db.chromadb import ChromaDBManager
from ..services.diary_service import load_diary_entries

async def update_embeddings(db_manager: ChromaDBManager) -> None:
    """Update embeddings from current diary content."""
    try:
        diary_content = await load_diary_entries()
        await db_manager.update_from_diary(diary_content)
        logger.info("Embeddings updated.")
    except Exception as e:
        logger.error(f"Error updating embeddings: {e}")
        raise

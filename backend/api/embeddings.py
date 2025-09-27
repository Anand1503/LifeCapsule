from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from loguru import logger
from ..services.embeddings_service import update_embeddings
from ..dependencies import get_db_manager
from ..db.chromadb import ChromaDBManager

router = APIRouter(prefix="/embeddings", tags=["embeddings"])

@router.post("/update")
async def update_embeddings_endpoint(background_tasks: BackgroundTasks, db_manager: ChromaDBManager = Depends(get_db_manager)):
    """Trigger background update of embeddings."""
    try:
        if not db_manager:
            raise HTTPException(status_code=500, detail="Database manager not available.")
        background_tasks.add_task(update_embeddings, db_manager)
        return {"status": "Embeddings update scheduled."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error scheduling embeddings update: {e}")
        raise HTTPException(status_code=500, detail="Failed to schedule embeddings update.")

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from loguru import logger
from ..services.llm_service import query_llm
from ..dependencies import get_db_manager
from ..db.chromadb import ChromaDBManager

router = APIRouter(prefix="/llm", tags=["llm"])

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@router.post("/query", response_model=QueryResponse)
async def llm_query(request: QueryRequest, db_manager: ChromaDBManager = Depends(get_db_manager)):
    """Query the LLM based on diary data."""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty.")
        if not db_manager:
            raise HTTPException(status_code=500, detail="Database manager not available.")
        answer = await query_llm(db_manager, request.query)
        return QueryResponse(answer=answer)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing LLM query: {e}")
        raise HTTPException(status_code=500, detail="Failed to process query.")

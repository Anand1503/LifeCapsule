from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any
from ..services.assistant_service import process_query
from ..dependencies import get_db_manager
from ..db.chromadb import ChromaDBManager

class QueryRequest(BaseModel):
    question: str

router = APIRouter(
    prefix="/api/assistant",
    tags=["assistant"]
)

@router.post("/query", response_model=Dict[str, Any])
async def query_assistant(
    request: QueryRequest,
    db_manager: ChromaDBManager = Depends(get_db_manager)
):
    """
    Query the personal assistant with a question about diary entries.
    """
    result = await process_query(request.question, db_manager)
    return result

from typing import Dict, Any, List
from langchain.schema import Document
from loguru import logger
from ..services.llm_service import create_qa_chain
from ..services.sentiment_service import analyze_sentiment
from ..db.chromadb import ChromaDBManager

async def process_query(question: str, db_manager: ChromaDBManager) -> Dict[str, Any]:
    """
    Process a user query using retrieval, LLM, and sentiment analysis.
    Returns structured response with answer, sources, and sentiment.
    """
    try:
        qa_chain = await create_qa_chain(db_manager)
        if not qa_chain:
            logger.warning("QA chain could not be created.")
            return {
                "answer": "Knowledge base is empty or error in setup. Please add diary entries.",
                "sources": [],
                "sentiment": "neutral"
            }

        result = await qa_chain.ainvoke({"query": question})
        answer = result.get("result", "I couldn't find a relevant answer in your diary.")
        
        # Extract sources as excerpts (first 100 chars)
        source_documents = result.get("source_documents", [])
        sources = [
            doc.page_content[:100] + "..." if len(doc.page_content) > 100 else doc.page_content
            for doc in source_documents
        ]
        
        # Analyze sentiment of the answer
        polarity = await analyze_sentiment(answer)
        sentiment = "positive" if polarity > 0.1 else "negative" if polarity < -0.1 else "neutral"
        
        logger.info(f"Assistant query processed: {question}, sentiment: {sentiment}")
        return {
            "answer": answer,
            "sources": sources,
            "sentiment": sentiment
        }
    except Exception as e:
        logger.error(f"Error processing assistant query: {e}")
        return {
            "answer": "Something went wrong while processing your query.",
            "sources": [],
            "sentiment": "neutral"
        }

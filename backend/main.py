from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
from .services.diary_service import load_diary_entries
from .services.embeddings_service import update_embeddings
from .api import diary, llm, sentiment, embeddings, dashboard, assistant
from .dependencies import get_db_manager, db_manager

# Configure logging with loguru
logger.add("backend/logs/lifecapsule.log", rotation="10 MB", retention="1 week", level="INFO")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI app.")
    try:
        diary_content = await load_diary_entries()
        if diary_content.strip():
            await db_manager.update_from_diary(diary_content)
            logger.info("Vectorstore initialized from existing diary.")
        else:
            logger.info("No existing diary entries.")
    except Exception as e:
        logger.error(f"Error initializing vectorstore: {e}")
    yield
    # Shutdown
    logger.info("Shutting down FastAPI app.")

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for db_manager
def get_db_manager():
    return db_manager

# Include routers
app.include_router(diary.router)
app.include_router(llm.router)
app.include_router(sentiment.router)
app.include_router(embeddings.router)
app.include_router(dashboard.router)
app.include_router(assistant.router)

@app.get("/")
async def root():
    return {"message": "LifeCapsule FastAPI Backend"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "LifeCapsule Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

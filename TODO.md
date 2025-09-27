# TODO for Personal Assistant Feature Implementation

## Backend
- [x] Create `backend/services/assistant_service.py`: Orchestrate query processing with retrieval, LLM, sentiment analysis, and structured response.
- [x] Create `backend/api/assistant.py`: New FastAPI router for `/api/assistant/query` endpoint.
- [x] Edit `backend/main.py`: Import and include the new assistant router.

## Frontend
- [x] Edit `src/pages/PersonalAssistant/PersonalAssistant.jsx`: Update API endpoint, parse response for answer/sources/sentiment, add sources display and sentiment badge.

## Verification
- [x] Check/update `backend/requirements.txt` for any missing dependencies (e.g., ensure textblob, langchain_ollama present).
- [ ] Test backend: Run server and verify endpoint response.
- [ ] Test frontend: Update UI and verify chat functionality with new features.

# LifeCapsule
LifeCapsule is a modern personal diary and AI assistant app. It allows users to log daily entries, analyze sentiments, query insights via LLM (Ollama + LangChain), and visualize data on a dashboard. Built with FastAPI (backend), React/Vite (frontend), CPU-only for accessibility.

## Features
- **Diary Entry**: Write and save entries to `data/diary.txt` with async file I/O.
- **Personal Assistant**: Chat-based LLM queries on diary data using Ollama (llama3.2) and ChromaDB vector store for RAG.
- **Sentiment Analysis**: TextBlob-powered mood tracking (happy/neutral/sad).
- **Dashboard**: Recharts visualizations (entries over time, mood pie, weekly bar) with axios integration.
- **UI/UX**: Tailwind CSS, framer-motion animations (transitions, typing effects), responsive sidebar (lucide-react icons).

## Tech Stack
- **Backend**: FastAPI 0.115.2, Uvicorn 0.32.0, LangChain 0.3.4 (with langchain-ollama, langchain-chroma), ChromaDB 0.5.11, TextBlob 0.18.0.post0, Loguru logging, Pydantic 2.9.2, Aiofiles 24.1.0. CPU-only (no GPU/Torch deps).
- **Frontend**: React 18.3.1, Vite 5.4.8, React Router, Axios, Framer Motion, Recharts, Lucide React, Tailwind CSS.
- **DB/Storage**: ChromaDB (vector embeddings), local `data/diary.txt`.
- **AI**: Ollama (run llama3.2 model), LangChain QA chain for retrieval-augmented generation.

## Setup & Run

### Prerequisites
- Python 3.11+ (venv recommended).
- Node.js 18+.
- Ollama installed (https://ollama.com/download) for LLM/embeddings (CPU-friendly).

### Backend
1. Create/activate virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```
2. Install dependencies (run as admin if permission issues on Windows):
   ```
   pip install -r backend/requirements.txt
   ```
   - If uvicorn.exe access denied: Close VSCode/terminals, run as admin, or recreate venv.
3. Run Ollama (in separate terminal):
   ```
   ollama run llama3.2
   ```
   - This pulls/starts the model for embeddings/LLM (first run downloads ~2GB).
4. Start server:
   ```
   uvicorn backend.main:app --reload --port 8000
   ```
   - Endpoints: `/docs` (Swagger UI), `/diary/entries` (GET all), `/diary/` (POST save), `/llm/query` (POST query), `/sentiment/analyze` (POST text).

### Frontend
1. Install dependencies:
   ```
   npm install
   ```
2. Start dev server:
   ```
   npm run dev
   ```
   - Opens http://localhost:5173. Routes: `/` → `/diary`, `/assistant`, `/dashboard`.
   - Sidebar navigation, smooth transitions.

### Integration & Testing
- Frontend calls backend via axios (localhost:8000).
- Test diary: POST entry via UI/curl, verify in `data/diary.txt` and ChromaDB (async update).
- Test assistant: Query e.g., "Summarize my week" – uses RAG on embeddings.
- Test dashboard: Loads entries/sentiments, charts update.
- CPU Notes: Ollama/Chroma run on CPU; no NVIDIA reqs. For production, consider Docker.

### Project Structure
- `backend/`: API (FastAPI routers), services (LLM/Chroma/sentiment/diary), db (Chroma manager).
- `src/`: React components/pages (DiaryEntry, PersonalAssistant, Dashboard, Sidebar/Cards).
- `public/`: Static assets.
- `data/`: Diary file (gitignore'd).
- `.gitignore`: node_modules/, venv/, chroma_db/, *.pyc, .env.

### Troubleshooting
- Ollama connection: Ensure `ollama run llama3.2` active; check logs for "model not found".
- Import errors: Verify langchain-chroma installed; restart server.
- Frontend routing: Check console for 404s; ensure ports match.
- Permissions (Windows): Run terminals as admin for pip/venv.
- Deps conflicts: Pin versions in requirements.txt/package.json; use `pip check`.

## Development
- Backend: Edit in `backend/`, auto-reload on save.
- Frontend: Hot reload on `src/` changes.
- Add features: Extend `/api/` routers, new React pages in `src/pages/`.

App is production-ready for local use. Contributions welcome!

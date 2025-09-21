# LifeCapsule - Personal Diary & AI Assistant

A full-stack application that combines a personal diary with an AI-powered assistant for analyzing and reflecting on your entries.

## Project Structure

```
lifecapsule/
├── frontend/           # React frontend application
│   ├── components/     # React components
│   ├── App.js         # Main React component
│   └── ...            # Other React files
├── backend/           # Python Flask API
│   └── App.py         # Flask application with AI assistant
├── data/              # Data files
│   └── diary.txt      # Diary entries storage
├── docs/              # Documentation
├── public/            # Static assets for React
├── package.json       # Frontend dependencies
└── README.md          # This file
```

## Features

- **Personal Diary**: Write and save personal diary entries
- **AI Assistant**: Analyze diary entries with natural language queries
- **Sentiment Analysis**: Get insights about your emotional patterns
- **Modern UI**: Clean, responsive interface with sidebar navigation

## Setup Instructions

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python App.py
```

## API Endpoints

- `POST /save_diary` - Save a new diary entry
- `POST /analyze_diary` - Analyze diary entries with AI
- `POST /prompt_query` - Direct AI queries

## Technologies Used

- **Frontend**: React, CSS, Tailwind CSS
- **Backend**: Python, Flask, LangChain, Ollama
- **AI**: Llama 3.2, ChromaDB for vector storage
- **Database**: Text file storage (diary.txt)

## Development

The application is designed to run both frontend and backend simultaneously for full functionality.

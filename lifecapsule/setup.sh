#!/bin/bash

echo "Setting up LifeCapsule project..."

# Create virtual environment for backend
echo "Setting up Python virtual environment..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && python App.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Make sure Ollama is running with: ollama serve"

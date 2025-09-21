@echo off
echo Setting up LifeCapsule project...

echo Setting up Python virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Setup complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && call venv\Scripts\activate.bat && python App.py
echo 2. Frontend: cd frontend && npm start
echo.
echo Make sure Ollama is running with: ollama serve
pause

@echo off
echo Starting LaRama Application Servers...
echo.

echo [1/3] Starting Backend Server...
start "LaRama Backend" cmd /k "cd /d C:\Users\user\OneDrive\Documents\Desktop\Web BootCamp\Project\LaRama\laRama_backend && npm run dev"

echo [2/3] Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "LaRama Frontend" cmd /k "cd /d C:\Users\user\OneDrive\Documents\Desktop\Web BootCamp\Project\LaRama\laRama_frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
@echo off
REM ====================================
REM Run Study Hub - BE + FE
REM ====================================

echo.
echo ================================
echo  Study Hub - Auto Start Script
echo ================================
echo.

REM Check if in correct directory
if not exist "backend" (
	echo ERROR: Please run this from the studyhub-react-demo directory
	echo Current: %cd%
	pause
	exit /b 1
)

REM Install backend dependencies
echo [1/4] Installing Backend Dependencies...
cd backend
if not exist "node_modules" (
	call npm install
) else (
	echo Backend dependencies already installed
)
cd ..

REM Install frontend dependencies  
echo [2/4] Installing Frontend Dependencies...
cd frontend
if not exist "node_modules" (
	call npm install
) else (
	echo Frontend dependencies already installed
)
cd ..

REM Start Backend in new window
echo [3/4] Starting Backend (port 4000)...
start "StudyHub Backend" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend in new window
echo [4/4] Starting Frontend (port 5173)...
start "StudyHub Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo  Started!
echo ================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:4000/api-docs
echo.
echo Press any key in the new windows to stop...
pause

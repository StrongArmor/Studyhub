#!/bin/bash

# ====================================
# Run Study Hub - BE + FE
# ====================================

echo ""
echo "================================"
echo " Study Hub - Auto Start Script"
echo "================================"
echo ""

# Check if in correct directory
if [ ! -d "backend" ]; then
	echo "ERROR: Please run this from the studyhub-react-demo directory"
	echo "Current: $(pwd)"
	exit 1
fi

# Install backend dependencies
echo "[1/4] Installing Backend Dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
	npm install
else
	echo "Backend dependencies already installed"
fi
cd ..

# Install frontend dependencies
echo "[2/4] Installing Frontend Dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
	npm install
else
	echo "Frontend dependencies already installed"
fi
cd ..

# Start Backend
echo "[3/4] Starting Backend (port 4000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo "[4/4] Starting Frontend (port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo " Started!"
echo "================================"
echo ""
echo "Backend:  http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:4000/api-docs"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID

echo "Services stopped."

#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

BE_LOG="$SCRIPT_DIR/backend.log"
FE_LOG="$SCRIPT_DIR/frontend.log"
DB_LOG="$SCRIPT_DIR/database.log"
BE_PID=""
FE_PID=""

DB_NAME="studyhub"
DB_USER="postgres"
DB_PASS="postgres"
DB_HOST="localhost"
DB_PORT="5432"

export DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

cleanup() {
  echo ""
  echo "Stopping services..."
  if [ -n "$BE_PID" ] && kill -0 "$BE_PID" 2>/dev/null; then
    kill -TERM -"$BE_PID" 2>/dev/null || kill "$BE_PID" 2>/dev/null
    echo "Backend stopped."
  fi
  if [ -n "$FE_PID" ] && kill -0 "$FE_PID" 2>/dev/null; then
    kill -TERM -"$FE_PID" 2>/dev/null || kill "$FE_PID" 2>/dev/null
    echo "Frontend stopped."
  fi
  exit 0
}
trap cleanup INT TERM

# --- Khởi động PostgreSQL nếu chưa chạy ---
if ! pg_isready -q 2>/dev/null; then
  echo "PostgreSQL not running. Starting..."
  if command -v service &>/dev/null; then
    sudo service postgresql start
  elif command -v pg_ctlcluster &>/dev/null; then
    sudo pg_ctlcluster "$(pg_lsclusters -h | awk '{print $1}' | head -1)" main start
  else
    echo "Cannot start PostgreSQL automatically. Please start it manually."
    exit 1
  fi
  sleep 2
fi
echo "PostgreSQL ready."

# --- Tạo database nếu chưa có ---
if command -v psql &>/dev/null; then
  if PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" \
      -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    echo "[$(date '+%F %T')] Database '$DB_NAME' already exists." | tee "$DB_LOG"
  else
    echo "[$(date '+%F %T')] Creating database '$DB_NAME'..." | tee "$DB_LOG"
    PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" \
      -c "CREATE DATABASE ${DB_NAME};" >> "$DB_LOG" 2>&1
    echo "[$(date '+%F %T')] Database '$DB_NAME' created." | tee -a "$DB_LOG"
  fi
  echo "Database '$DB_NAME' ready."
else
  echo "psql not in PATH — skipping DB check." | tee "$DB_LOG"
fi

# --- Install dependencies nếu chưa có ---
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# --- Start backend ---
echo "Starting backend on port 4000..."
npm run dev --workspace=backend > "$BE_LOG" 2>&1 &
BE_PID=$!

sleep 3
if ! kill -0 "$BE_PID" 2>/dev/null; then
  echo "Backend failed to start. Check backend.log:"
  tail -20 "$BE_LOG"
  exit 1
fi
echo "Backend running (PID $BE_PID) — logs: backend.log"

# --- Start frontend ---
echo "Starting frontend on port 5173..."
echo "Access: http://localhost:5173"
echo "Press Ctrl+C to stop all services."
echo ""
npm run dev --workspace=frontend > "$FE_LOG" 2>&1 &
FE_PID=$!

# Pipe frontend log ra stdout để thấy output
tail -f "$FE_LOG" &
TAIL_PID=$!

wait $FE_PID
kill "$TAIL_PID" 2>/dev/null
cleanup

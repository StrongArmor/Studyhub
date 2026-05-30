$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$DB_NAME = "studyhub"
$DB_USER = "postgres"
$DB_PASS = "postgres"
$DB_HOST = "localhost"
$DB_PORT = "5432"

$env:DATABASE_URL = "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
$env:PGPASSWORD = $DB_PASS

$BE_LOG = "$ScriptDir\backend.log"
$FE_LOG = "$ScriptDir\frontend.log"
$DB_LOG = "$ScriptDir\database.log"

# --- Tao database neu chua co ---
$psql = Get-Command psql -ErrorAction SilentlyContinue
if ($null -ne $psql) {
  try {
    $exists = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'"
    if ($exists.Trim() -ne "1") {
      Write-Host "Creating database '$DB_NAME'..."
      & psql -U $DB_USER -h $DB_HOST -p $DB_PORT postgres -c "CREATE DATABASE $DB_NAME;" | Out-File $DB_LOG
    }
    Write-Host "Database '$DB_NAME' ready."
  } catch {
    Write-Host "DB check skipped: $_"
  }
} else {
  Write-Host "psql not in PATH - skipping DB check."
}

# --- Install dependencies neu chua co ---
if ((-not (Test-Path "node_modules")) -or (-not (Test-Path "backend\node_modules")) -or (-not (Test-Path "frontend\node_modules"))) {
  Write-Host "Installing dependencies..."
  npm install
}

# --- Start backend ---
Write-Host "Starting backend on port 4000..."
$beProcess = Start-Process node -ArgumentList "backend/server.js" `
  -WorkingDirectory $ScriptDir `
  -RedirectStandardOutput $BE_LOG `
  -NoNewWindow -PassThru

Start-Sleep 2

if ($beProcess.HasExited) {
  Write-Host "Backend failed to start. Check backend.log:"
  Get-Content $BE_LOG -Tail 20
  exit 1
}
Write-Host "Backend running (PID $($beProcess.Id)) - logs: backend.log"

# --- Start frontend (foreground) ---
Write-Host "Starting frontend on port 5173..."
Write-Host "Access: http://localhost:5173"
Write-Host "Press Ctrl+C to stop all services."
Write-Host ""

try {
  npm run dev --workspace=frontend 2>&1 | Tee-Object $FE_LOG
} finally {
  Write-Host ""
  Write-Host "Stopping backend..."
  Stop-Process -Id $beProcess.Id -Force -ErrorAction SilentlyContinue
  Write-Host "Backend stopped."
}

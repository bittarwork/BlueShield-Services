# PowerShell Script: start-blueshield.ps1

Write-Host "-------------------------------------"
Write-Host "BlueShield-Services - Auto Start Script (PowerShell)" -ForegroundColor Cyan
Write-Host "-------------------------------------"

# Function to check if a command exists
function Command-Exists {
    param([string]$cmd)
    $exists = Get-Command $cmd -ErrorAction SilentlyContinue
    return $exists -ne $null
}

# Function to install dependencies if node_modules not found
function Install-Dependencies-If-Needed {
    param([string]$path)

    if (!(Test-Path "$path/node_modules")) {
        Write-Host "node_modules not found in $path. Installing dependencies..." -ForegroundColor Yellow
        Set-Location $path
        npm install
        Set-Location ..
    }
    else {
        Write-Host "Dependencies already installed in $path. Skipping npm install." -ForegroundColor Green
    }
}

# Check Node.js
if (!(Command-Exists "node")) {
    Write-Host "ERROR: Node.js is not installed. Please install it from https://nodejs.org/" -ForegroundColor Red
    Pause
    exit
}
Write-Host "Node.js is installed." -ForegroundColor Green

# Check npm
if (!(Command-Exists "npm")) {
    Write-Host "ERROR: npm is not installed. Please install Node.js (it includes npm)." -ForegroundColor Red
    Pause
    exit
}
Write-Host "npm is installed." -ForegroundColor Green

# Check backend folder
if (!(Test-Path "backend")) {
    Write-Host "ERROR: 'backend' folder not found!" -ForegroundColor Red
    Pause
    exit
}

# Check frontend folder
if (!(Test-Path "frontend")) {
    Write-Host "ERROR: 'frontend' folder not found!" -ForegroundColor Red
    Pause
    exit
}

# Install backend dependencies if needed
Install-Dependencies-If-Needed "backend"

# Install frontend dependencies if needed
Install-Dependencies-If-Needed "frontend"

# Start backend server
Write-Host "Starting backend server (node server.js)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD/backend'; node server.js"

# Start frontend server
Write-Host "Starting frontend server (npm run dev)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD/frontend'; npm run dev"

Write-Host "-------------------------------------"
Write-Host "Backend and frontend should now be running in separate windows." -ForegroundColor Cyan
Write-Host "-------------------------------------"

Pause
exit

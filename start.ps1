$env:PATH = "C:\21021\eclipse\.node\node-v22.11.0-win-x64;" + $env:PATH
Write-Host "Starting Hospital Management System on http://localhost:3000 ..." -ForegroundColor Cyan
& "C:\21021\eclipse\.node\node-v22.11.0-win-x64\npm.cmd" run dev

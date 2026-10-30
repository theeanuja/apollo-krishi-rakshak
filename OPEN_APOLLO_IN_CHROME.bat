@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Apollo Krishi Rakshak" cmd /c "py -m http.server 8765"
) else (
  start "Apollo Krishi Rakshak" cmd /c "python -m http.server 8765"
)
timeout /t 2 /nobreak >nul
start "" "chrome.exe" "http://localhost:8765/index.html"
echo Apollo Krishi Rakshak is available at http://localhost:8765/index.html
endlocal

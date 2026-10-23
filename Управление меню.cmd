@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
set "CHILLI_NODE=%ProgramFiles%\nodejs\node.exe"
if exist "%CHILLI_NODE%" goto run
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js and try again.
  pause
  exit /b 1
)
set "CHILLI_NODE=node"
:run
"%CHILLI_NODE%" "%~dp0admin\server.cjs" %*
if errorlevel 1 (
  echo The editor could not start. The error is shown above.
  pause
  exit /b 1
)

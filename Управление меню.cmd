@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Не найден Node.js. Установите Node.js и повторите запуск.
  pause
  exit /b 1
)
node admin\server.cjs
if errorlevel 1 pause

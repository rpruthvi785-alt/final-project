@echo off
title Travel Trackers - Dev Server
echo.
echo ==========================================
echo   Travel Trackers - Starting Dev Server
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please download and install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1 delims=v" %%i in ('node -v') do set NODEVERSION=%%i
echo Node.js detected: 
node -v
echo.

:: Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please reinstall Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Run the cross-platform dev orchestrator
node dev.js

:: If node dev.js exits with an error, pause to show the error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] The dev server exited with an error. See the message above.
    pause
)

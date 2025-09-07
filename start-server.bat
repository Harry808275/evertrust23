@echo off
echo Starting Style at Home E-commerce Server...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies...
npm install
echo.
echo Starting development server...
npm run dev
pause


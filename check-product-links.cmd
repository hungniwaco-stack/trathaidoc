@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\check-product-links.ps1"
echo.
pause

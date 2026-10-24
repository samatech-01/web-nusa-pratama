@echo off

start "Nusa Pratama - Backend" cmd /k "cd /d D:\xampp\htdocs\Project\web-nusa-pratama\backend && D:\xampp\htdocs\Project\.venv\Scripts\python.exe -m uvicorn server:app --reload"

start "Nusa Pratama - Frontend" cmd /k "cd /d D:\xampp\htdocs\Project\web-nusa-pratama\frontend && npm start"

timeout /t 5 /nobreak >nul
start "" http://localhost:3000

exit
@echo off

cd /d "D:\Classroom\B"
start "" /min npm start >nul 2>&1

cd /d "D:\Classroom\F"
start "" /min npm run dev >nul 2>&1

timeout /t 5 /nobreak >nul
start "" /min http://localhost:5173

start /b "" npm start >nul 2>&1

timeout /t 3 /nobreak >nul

exit

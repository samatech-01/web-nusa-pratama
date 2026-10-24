Set WshShell = CreateObject("WScript.Shell")

' Jalankan Backend secara tersembunyi
WshShell.Run "cmd /c cd /d D:\xampp\htdocs\Project\web-nusa-pratama\backend && D:\xampp\htdocs\Project\.venv\Scripts\python.exe -m uvicorn server:app", 0, False

' Jalankan Frontend secara tersembunyi
WshShell.Run "cmd /c cd /d D:\xampp\htdocs\Project\web-nusa-pratama\frontend && npm start", 0, False

' Tunggu server siap
WScript.Sleep 6000

' Buka website
WshShell.Run "http://localhost:3000"

Set WshShell = Nothing
@echo off
echo ========================================
echo   BUILDZEG - Installation des dependances
echo ========================================
echo.

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detecte!
echo.
echo Installation des dependances...
call npm install

if errorlevel 1 (
    echo.
    echo ERREUR lors de l'installation des dependances!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation terminee avec succes!
echo ========================================
echo.
echo Vous pouvez maintenant executer: npm run build
echo.
pause


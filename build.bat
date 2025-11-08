@echo off
echo ========================================
echo   BUILDZEG - Generation des fichiers
echo ========================================
echo.

if not exist "node_modules" (
    echo Les dependances ne sont pas installees.
    echo Execution de l'installation...
    call install.bat
    echo.
)

echo Generation des fichiers de production...
call npm run build

if errorlevel 1 (
    echo.
    echo ERREUR lors de la generation!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build termine avec succes!
echo ========================================
echo.
echo Les fichiers de production sont dans le dossier "dist/"
echo Deployez le contenu de ce dossier sur votre serveur.
echo.
pause


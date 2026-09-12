@echo off
chcp 65001 >nul
title Social Links - Servidor Local

echo ===================================================
echo           INICIANDO SOCIAL LINKS APP
echo ===================================================
echo.

:: Detectar y posicionarse en la carpeta del proyecto
if exist "%~dp0social-links-app\package.json" (
    cd /d "%~dp0social-links-app"
) else if exist "%~dp0package.json" (
    cd /d "%~dp0"
) else (
    echo [ERROR] No se encontro el archivo package.json del proyecto.
    echo Asegurate de que la carpeta 'social-links-app' este en el mismo directorio.
    echo.
    pause
    exit /b 1
)

:: Verificar si Node.js esta instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH del sistema.
    echo Por favor, descarga e instala Node.js desde https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Verificar si existen las dependencias (node_modules)
if not exist "node_modules" (
    echo [INFO] No se detectaron dependencias instaladas.
    echo Instalando dependencias con npm install...
    echo Esto puede tardar unos momentos la primera vez.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Ocurrio un problema al instalar las dependencias.
        pause
        exit /b 1
    )
    echo.
    echo Dependencias instaladas correctamente.
    echo.
)

echo [INFO] Abriendo la aplicacion en tu navegador predeterminado...
:: Abrir navegador de forma silenciosa tras 2 segundos en segundo plano
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

echo [INFO] Iniciando servidor de desarrollo Next.js...
echo [INFO] Tu aplicacion estara lista en: http://localhost:3000
echo.
echo ===================================================
echo  Presiona Ctrl + C en esta ventana para detener.
echo ===================================================
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] El servidor se ha detenido o ha ocurrido un error.
    pause
)

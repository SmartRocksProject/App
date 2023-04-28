@ECHO off
where /q docker
IF %ERRORLEVEL% NEQ 0 (
 ECHO Docker is not installed. Install docker at https://www.docker.com/ and ensure it is in your PATH.
) ELSE (
    set found=false
    FOR /F "tokens=*" %%A IN ('docker images -q "app-web"') DO (
        set found=true
        docker rmi --force %%A
    )
    IF "%found%"=="true" (
        ECHO Previous install found. Deleting and re-installing
    ) ELSE (
        ECHO "app-web" image not found
        ECHO Fresh install
    )
    docker compose build --no-cache
    ECHO Installation Complete!
)
pause

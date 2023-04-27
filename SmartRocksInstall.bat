@ECHO off
where /q docker
IF %ERRORLEVEL% NEQ 0 (
 ECHO Docker is not installed. Install docker at https://www.docker.com/ and ensure it is in your PATH.
) ELSE (
    docker compose build --no-cache
    ECHO Installation Complete!
)
pause

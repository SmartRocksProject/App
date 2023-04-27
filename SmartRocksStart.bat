@ECHO off
where /q docker
IF %ERRORLEVEL% NEQ 0 (
 ECHO Docker is not installed. Install docker at https://www.docker.com/ and ensure it is in your PATH.
) ELSE (
    docker compose up
    ECHO Smart Rocks App is now running. Check it out at http://localhost:3000
)
pause
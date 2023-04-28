@ECHO off
where /q docker
IF %ERRORLEVEL% NEQ 0 (
 ECHO Docker is not installed. Install docker at https://www.docker.com/ and ensure it is in your PATH.
) ELSE (
    set found=false
    FOR /F "tokens=*" %%A IN ('docker ps -a --filter "name=app-web-*" -q') DO (
        ECHO Previous install found. Uninstalling
        docker rm -f %%A
    )
    FOR /F "tokens=*" %%A IN ('docker images -q "app-web"') DO (
        ECHO Deleting image
        docker rmi --force %%A
    )
    
)
pause

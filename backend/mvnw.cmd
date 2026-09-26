@echo off
setlocal
set "MAVEN_VERSION=3.9.11"
set "MAVEN_HOME=%~dp0.mvn\wrapper\apache-maven-%MAVEN_VERSION%"
set "MAVEN_ZIP=%~dp0.mvn\wrapper\apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Maven %MAVEN_VERSION% not found. Downloading Maven...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'"
    if errorlevel 1 exit /b 1
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%~dp0.mvn\wrapper' -Force"
    if errorlevel 1 exit /b 1
    del /q "%MAVEN_ZIP%" >nul 2>&1
)
call "%MAVEN_HOME%\bin\mvn.cmd" %*
exit /b %ERRORLEVEL%

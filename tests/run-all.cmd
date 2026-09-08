@echo off
setlocal
set "SARDU_PXT=%~dp0..\..\..\.tools\pxt-cli\node_modules\.bin\pxt.cmd"

for /d %%D in ("%~dp0*") do if exist "%%D\pxt.json" (
    echo === %%~nxD: V1 ===
    pushd "%%D"
    call "%SARDU_PXT%" install || exit /b 1
    call "%SARDU_PXT%" build || exit /b 1
    echo === %%~nxD: V2 ===
    call "%SARDU_PXT%" build --hwvariant v2 || exit /b 1
    popd
)

echo All independent V1/V2 projects passed.

$ErrorActionPreference = "Stop"

$installerProjectDir = "Nammil.Installer"
$zipPath = "$installerProjectDir\Assets\app_payload.zip"

Write-Host "1. Building Electron App (Unpacked)..."
npm run build:pack

Write-Host "2. Zipping Electron App..."
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Ensure Assets folder exists
if (-Not (Test-Path "$installerProjectDir\Assets")) {
    New-Item -ItemType Directory -Force -Path "$installerProjectDir\Assets"
}

Compress-Archive -Path "release\win-unpacked\*" -DestinationPath $zipPath -Force

Write-Host "3. Building WinUI Custom Installer..."
Set-Location -Path $installerProjectDir

# Publish as an unpackaged, self-contained win-x64 application
dotnet publish -c Release -r win-x64 -p:WindowsPackageType=None -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true --self-contained true

Write-Host "Done! Setup.exe is ready in Nammil.Installer\bin\Release\net9.0-windows10.0.19041.0\win-x64\publish\"
Set-Location -Path ..

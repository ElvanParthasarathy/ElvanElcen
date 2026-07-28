# === FULL NUCLEAR CLEANUP & FRESH BUILD ===

# Kill any running instances
taskkill /F /IM "Elvan Nammil.exe" /T 2>$null
taskkill /F /IM "Elvan Nammil Pro.exe" /T 2>$null
taskkill /F /IM electron.exe /T 2>$null

# Remove ALL old app data folders (every variant we ever used)
Remove-Item -Recurse -Force "$env:APPDATA\nammil-electron" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\elvan-nammil" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\elvan-nammil-pro" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\elvan-nammil-app" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Elvan Nammil" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Elvan Nammil Pro" -ErrorAction SilentlyContinue

# Remove ALL old installation folders
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\Elvan Nammil" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\Elvan Nammil Pro" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\nammil-electron" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\elvan-nammil" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\elvan-nammil-pro" -ErrorAction SilentlyContinue

# Remove old Start Menu shortcuts
Remove-Item -Force "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Elvan Nammil.lnk" -ErrorAction SilentlyContinue
Remove-Item -Force "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Elvan Nammil Pro.lnk" -ErrorAction SilentlyContinue
Remove-Item -Force "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Electron.lnk" -ErrorAction SilentlyContinue

# Remove old Desktop shortcuts
Remove-Item -Force "$env:USERPROFILE\Desktop\Elvan Nammil.lnk" -ErrorAction SilentlyContinue
Remove-Item -Force "$env:USERPROFILE\Desktop\Elvan Nammil Pro.lnk" -ErrorAction SilentlyContinue
Remove-Item -Force "$env:USERPROFILE\Desktop\Electron.lnk" -ErrorAction SilentlyContinue

# Remove old build directory
Remove-Item -Recurse -Force "D:\nammil_build" -ErrorAction SilentlyContinue

# Remove old release folder
Remove-Item -Recurse -Force "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron\release" -ErrorAction SilentlyContinue

Write-Host "=== Old data completely wiped ==="

# Ensure build folder with icon
New-Item -ItemType Directory -Force -Path "build" | Out-Null
Copy-Item "src\assets\app_icon.ico" "build\icon.ico" -Force

# Create clean build environment
New-Item -ItemType Directory -Force -Path "D:\nammil_build" | Out-Null
robocopy "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron" "D:\nammil_build" /E /XD node_modules dist release .git

Set-Location "D:\nammil_build"
npm install
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
npm run dist

# Copy final installer back
New-Item -ItemType Directory -Force -Path "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron\release" | Out-Null
Copy-Item "release\Elvan Nammil Setup 1.0.0.exe" "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron\release\Elvan Nammil Setup.exe" -Force

Write-Host "=== CLEAN BUILD COMPLETE ==="

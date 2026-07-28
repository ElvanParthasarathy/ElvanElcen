taskkill /F /IM electron.exe /T 2>$null
New-Item -ItemType Directory -Force -Path "D:\nammil_build"
# Copy project excluding heavy or unnecessary dirs
robocopy "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron" "D:\nammil_build" /E /XD node_modules dist release .git
Set-Location "D:\nammil_build"
npm install
npm run dist
New-Item -ItemType Directory -Force -Path "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron\release"
Copy-Item "release\Elvan Nammil Setup 0.0.0.exe" "d:\Things\Padaippugal\Nadappil\Elvan Elcen\elvan-elcen\Nammil.Electron\release\Elvan Nammil Setup.exe" -Force
Write-Host "DONE"

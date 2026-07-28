<div align="center">
  <img src="src/assets/app_icon.png" alt="Elvan Nammil Logo" width="128" />
  <h1>Elvan Nammil</h1>
  <p><strong>A beautifully crafted, high-performance messaging client powered by React, Electron, and WinUI 3.</strong></p>
  <br/>
  <img src="src/assets/hero.png" alt="Elvan Nammil Hero Image" width="600" />
</div>

---

## ✨ Features

- **Modern UI/UX**: Built with React and styled with a custom design system for a fluid, responsive, and stunning visual experience.
- **Custom Typography**: Features the bespoke **Elvan Sans** font, giving the application a deeply personal and premium aesthetic.
- **Rich Localization**: Fully translated and localized with deep i18n support, featuring out-of-the-box language support for 6 different languages/scripts:
  - 🇺🇸 English
  - 🇮🇳 Tamil (தமிழ்)
  - 🇮🇳 Tamil Latin (Thamizh)
  - 🇮🇳 Malayalam (മലയാളം)
  - 🇮🇳 Malayalam Latin (Manglish)
  - 🔣 Neram
- **Electron Core**: Leverages the power of Electron for deep operating system integration, notifications, tray controls, and robust background services.
- **Custom Native Installer**: Includes a custom-built **WinUI 3** setup executable. Experience a flawless, native Windows 11 installation flow featuring Mica glass effects and intelligent setup routing.
- **Instant Launch**: Bypasses tedious first-boot configurations. The installer securely sets up your account and media paths on the fly, seamlessly dropping you into the app upon completion.

---

## ⚙️ App Configuration & Settings

Elvan Nammil offers deep configuration options managed through a robust internal `SettingsManager`:
- **Theme Engine**: Syncs with Windows system settings (Light/Dark/System) dynamically using Electron's `nativeTheme` API.
- **Multi-Account Support**: Manage multiple isolated profiles (e.g., Personal, Work) seamlessly.
- **Bespoke Notification Sounds**: Choose from high-quality custom notification chimes like *Kumizhi*, *Minnal*, *Alai*, *Thendral*, *Thuli*, and *Thullal*.
- **Per-Account Sounds**: Assign specific notification sounds to different accounts so you instantly know who received a message.
- **Dynamic Media Management**: Set up custom local media folders. The app automatically defaults to intelligently locating or creating an `Elvan Nammil\Media` directory inside your Documents folder.
- **Auto-Organization**: Toggleable media auto-organization with robust duplicate file handling (Skip/Overwrite).

---

## 🏗️ Architecture

- `src/` - React frontend code (Vite).
- `services/` - Core Electron backend services (Window management, Tray, Notifications).
- `Nammil.Installer/` - Native C# WinUI 3 Installer project.

---

## 🛠️ Build Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) & `npm`
- [.NET 9.0 SDK](https://dotnet.microsoft.com/)
- [Windows App SDK](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/)

### Compiling the App & Installer

We have integrated a seamless, one-click PowerShell pipeline that compiles the React app, zips the Electron binaries, injects them into the C# project, and publishes the final `Setup.exe`.

1. Open a PowerShell terminal as Administrator (to bypass execution policies).
2. Run the build script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\build_custom_installer.ps1
   ```
3. Once completed, the final standalone installer will be outputted to:
   `Nammil.Installer\bin\Release\net8.0-windows10.0.26100.0\win-x64\publish\Nammil.Installer.exe`

---

## 📝 License
Proprietary & Confidential - Created by Elvan Parthasarathy

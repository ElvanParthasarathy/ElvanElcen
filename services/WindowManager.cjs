const path = require('path');
const { BrowserWindow, nativeImage } = require('electron');

class WindowManager {
  constructor(app, nativeTheme, settingsManager) {
    this.app = app;
    this.nativeTheme = nativeTheme;
    this.settingsManager = settingsManager;
    this.mainWindow = null;
  }

  createWindow() {
    const isLight = this.nativeTheme.shouldUseDarkColors === false;
    const iconPath = path.join(__dirname, '..', 'src', 'assets', 'app_icon.ico');
    const settings = this.settingsManager ? this.settingsManager.getSettingsSync() : {};
    const isFirstBoot = settings.isFirstBoot === true;

    this.mainWindow = new BrowserWindow({
      width: isFirstBoot ? 780 : 1280,
      height: isFirstBoot ? 580 : 720,
      minWidth: isFirstBoot ? 780 : 940,
      minHeight: isFirstBoot ? 580 : 600,
      resizable: !isFirstBoot,
      maximizable: !isFirstBoot,
      show: false, // Hide until maximized
      center: true,
      backgroundColor: '#ffffff',
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: 'rgba(0,0,0,0)',
        symbolColor: isLight ? '#111b21' : '#e9edef',
        height: 48
      },
      icon: nativeImage.createFromPath(iconPath),
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload.cjs'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // Maximize and show when ready
    this.mainWindow.once('ready-to-show', () => {
      if (!isFirstBoot) {
        this.mainWindow.maximize();
      }
      this.mainWindow.show();
    });

    // Load frontend
    if (process.env.VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }

    // Register DevTools shortcuts
    import('electron').then(({ globalShortcut }) => {
      const toggleDevTools = () => {
        if (this.mainWindow && this.mainWindow.isFocused()) {
          this.mainWindow.webContents.toggleDevTools();
        }
      };
      globalShortcut.register('CommandOrControl+Shift+I', toggleDevTools);
      globalShortcut.register('F12', toggleDevTools);
    });

    // Lock zoom to 100% — disable all zoom shortcuts
    this.mainWindow.webContents.on('before-input-event', (event, input) => {
      // Block Ctrl+Plus, Ctrl+Minus, Ctrl+=, Ctrl+0, Ctrl+Shift+Plus
      if (input.control && !input.alt) {
        if (input.key === '+' || input.key === '=' || input.key === '-' || input.key === '_') {
          event.preventDefault();
        }
        if (input.shift && (input.key === '+' || input.key === '=')) {
          event.preventDefault();
        }
      }
    });

    // Also block Ctrl+Scroll zoom and force zoom level to 0 (100%)
    this.mainWindow.webContents.setZoomFactor(1);
    this.mainWindow.webContents.setZoomLevel(0);
    this.mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
    this.mainWindow.webContents.on('zoom-changed', () => {
      this.mainWindow.webContents.setZoomLevel(0);
    });

    return this.mainWindow;
  }
}

module.exports = WindowManager;

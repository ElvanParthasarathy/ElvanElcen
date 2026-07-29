const { ipcMain, dialog, shell, nativeTheme, nativeImage, protocol, net } = require('electron');

const SettingsManager = require('./SettingsManager.cjs');
const WindowManager = require('./WindowManager.cjs');
const TrayManager = require('./TrayManager.cjs');
const WhatsAppViewManager = require('./WhatsAppViewManager.cjs');
const NotificationManager = require('./NotificationManager.cjs');
const DownloadManager = require('./DownloadManager.cjs');

class AppOrchestrator {
  constructor(app) {
    this.app = app;
    this.settingsManager = null;
    this.windowManager = null;
    this.trayManager = null;
    this.whatsAppViewManager = null;
    this.notificationManager = null;
    this.downloadManager = null;
  }

  init() {
    this.app.userAgentFallback = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

    // 1. Initialize Services
    this.settingsManager = new SettingsManager(this.app, nativeTheme);
    this.windowManager = new WindowManager(this.app, nativeTheme, this.settingsManager);
    this.trayManager = new TrayManager(this.app, this);
    this.whatsAppViewManager = new WhatsAppViewManager(this.app, this);
    this.notificationManager = new NotificationManager(this.app, this);
    this.downloadManager = new DownloadManager(this.app, this);

    // 2. Register Protocols
    this.downloadManager.registerProtocols(protocol, nativeImage, net);

    // 3. Create Main Window & Tray
    const mainWindow = this.windowManager.createWindow();
    this.trayManager.createTray();

    // 4. Register IPCs across Services
    this.settingsManager.registerIPC(ipcMain, dialog, this);
    this.downloadManager.registerIPC(ipcMain, shell);
    this.notificationManager.registerIPC(ipcMain, dialog);
    this.whatsAppViewManager.registerIPC(ipcMain);

    // 5. General App Lifecycle IPCs
    ipcMain.on('restart-app', () => {
      this.app.isQuitting = true;
      this.app.relaunch();
      this.app.exit(0);
    });

    ipcMain.handle('reset-app', async () => {
      try {
        const { session } = require('electron');
        const settings = this.settingsManager.getSettingsSync();
        
        // 1. Clear session storage for all existing accounts
        for (const acc of settings.accounts) {
          const accSession = session.fromPartition(`persist:${acc.id}`);
          if (accSession) {
            await accSession.clearStorageData();
          }
        }
        
        // 2. Clear default session (main app UI)
        await session.defaultSession.clearStorageData();
        
        // 3. Reset settings to default with isFirstBoot=true, while preserving mediaFolder config if any
        const mediaFolder = settings.mediaFolder;
        const mediaFolderPath = settings.mediaFolderPath;
        
        const defaultSettings = { 
          language: 'en', 
          theme: 'system',
          autoOrganize: true, 
          duplicateAction: 'skip',
          notificationSound: 'kumizhi',
          accountSounds: {},
          isFirstBoot: true,
          accounts: [
            { id: 'account_1', name: 'Personal' }
          ]
        };
        
        if (mediaFolder) defaultSettings.mediaFolder = mediaFolder;
        if (mediaFolderPath) defaultSettings.mediaFolderPath = mediaFolderPath;
        
        this.settingsManager.saveSettingsSync(defaultSettings);
        
        // 4. Relaunch
        this.app.isQuitting = true;
        this.app.relaunch();
        this.app.exit(0);
        return { success: true };
      } catch (e) {
        console.error('Reset app failed:', e);
        return { success: false, error: e.toString() };
      }
    });

    ipcMain.handle('get-app-version', () => {
      return this.app.getVersion();
    });

    // 6. Create WebContentsViews for configured accounts
    const settings = this.settingsManager.getSettingsSync();
    settings.accounts.forEach(acc => {
      this.whatsAppViewManager.createView(acc.id, acc.name);
    });

    // Catch Ctrl+R and F5 globally across all views to refresh the ENTIRE app
    this.app.on('web-contents-created', (event, contents) => {
      contents.on('before-input-event', (event, input) => {
        if (
          (input.type === 'keyDown') &&
          (((input.control || input.meta) && input.key.toLowerCase() === 'r') || input.key === 'F5')
        ) {
          event.preventDefault();
          if (this.windowManager && this.windowManager.mainWindow) {
            this.windowManager.mainWindow.webContents.reload();
          }
          if (this.whatsAppViewManager && this.whatsAppViewManager.views) {
            Object.values(this.whatsAppViewManager.views).forEach(view => {
              if (view && view.webContents) {
                view.webContents.reload();
              }
            });
          }
        }
      });
    });

    // 7. Window Event Handlers
    mainWindow.webContents.once('did-finish-load', () => {
      this.whatsAppViewManager.resizeViews();
    });

    mainWindow.on('resize', () => this.whatsAppViewManager.resizeViews());
    mainWindow.on('maximize', () => this.whatsAppViewManager.resizeViews());
    mainWindow.on('unmaximize', () => this.whatsAppViewManager.resizeViews());

    mainWindow.on('close', (event) => {
      if (!this.app.isQuitting) {
        event.preventDefault();
        mainWindow.hide();
      }
      return false;
    });

    this.app.on('will-quit', () => {
      import('electron').then(({ globalShortcut }) => {
        globalShortcut.unregisterAll();
      });
    });

    return this;
  }
}

module.exports = AppOrchestrator;

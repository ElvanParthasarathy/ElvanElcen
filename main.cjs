const { app, protocol } = require('electron');
const path = require('path');
const AppOrchestrator = require('./services/AppOrchestrator.cjs');

// Detect dev vs release mode
const isDev = !!process.env.VITE_DEV_SERVER_URL;
const APP_ID = isDev ? 'com.nammil.elvan.dev' : 'com.nammil.elvan';

// In dev mode, use a separate userData folder so dev & release never share data
if (isDev) {
  app.setPath('userData', path.join(app.getPath('appData'), 'elvan-nammil-dev'));
}

// 1. Single Instance Lock — Ensure only one instance per mode runs at a time
const gotTheLock = app.requestSingleInstanceLock({ mode: isDev ? 'dev' : 'release' });
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// 2. Set Windows AppUserModelId for Native Windows Toast Notifications
app.setAppUserModelId(APP_ID);

// 3. Register Privileged Protocol Scheme for custom fonts, icons, and thumbnails
protocol.registerSchemesAsPrivileged([
  { scheme: 'nammil', privileges: { standard: true, secure: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true } }
]);

let orchestrator = null;

// 4. Handle second-instance launch (bring running Nammil instance to front)
app.on('second-instance', () => {
  if (orchestrator && orchestrator.windowManager && orchestrator.windowManager.mainWindow) {
    const mainWindow = orchestrator.windowManager.mainWindow;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

// 5. Boot the Orchestrator on App Ready
app.whenReady().then(() => {
  orchestrator = new AppOrchestrator(app).init();
});

// 6. Handle Quit & Close Events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

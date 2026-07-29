const { contextBridge, ipcRenderer, webFrame } = require('electron');

// Force zoom level to 100% and disable manual zooming
webFrame.setZoomLevel(0);
webFrame.setVisualZoomLevelLimits(1, 1);

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Existing APIs ──
  switchTab: (tabId) => ipcRenderer.send('switch-tab', tabId),
  onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (_event, value) => callback(value)),
  saveSetting: (key, value) => ipcRenderer.send('save-setting', key, value),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  getMediaFiles: (filter, accountName) => ipcRenderer.invoke('get-media', filter, accountName),
  openMedia: (filePath) => ipcRenderer.send('open-media', filePath),
  showInFolder: (filePath) => ipcRenderer.send('show-in-folder', filePath),
  updateAccounts: (newAccounts) => ipcRenderer.invoke('update-accounts', newAccounts),
  completeFirstBoot: (newAccounts, mediaFolder) => ipcRenderer.invoke('complete-first-boot', newAccounts, mediaFolder),
  updateTheme: (theme) => ipcRenderer.send('update-theme', theme),
  getBaseMediaDir: () => ipcRenderer.invoke('get-base-media-dir'),
  changeMediaFolder: () => ipcRenderer.invoke('change-media-folder'),
  onMigrationProgress: (callback) => {
    const handler = (_event, value) => callback(value);
    ipcRenderer.on('migration-progress', handler);
    return () => ipcRenderer.removeListener('migration-progress', handler);
  },
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  resetApp: () => ipcRenderer.invoke('reset-app'),

  // ── Notification APIs ──
  selectCustomSound: () => ipcRenderer.invoke('select-custom-sound'),
  previewSound: (soundType) => ipcRenderer.send('preview-sound', soundType),
  onPlayNotificationSound: (callback) => {
    const handler = (_event, soundType, customPath) => callback(soundType, customPath);
    ipcRenderer.on('play-notification-sound', handler);
    return () => ipcRenderer.removeListener('play-notification-sound', handler);
  },

  // ── General / System APIs ──
  setAutoStart: (enabled) => ipcRenderer.send('set-auto-start', enabled),
  getAutoStart: () => ipcRenderer.invoke('get-auto-start'),
  setHardwareAcceleration: (enabled) => ipcRenderer.send('set-hardware-acceleration', enabled),
  restartApp: () => ipcRenderer.send('restart-app'),
  onRestartRequired: (callback) => {
    const handler = (_event) => callback();
    ipcRenderer.on('restart-required', handler);
    return () => ipcRenderer.removeListener('restart-required', handler);
  },

  // ── About APIs ──
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onSwitchToAccountTab: (callback) => {
    const handler = (_event, tabId) => callback(tabId);
    ipcRenderer.on('switch-to-account-tab', handler);
    return () => ipcRenderer.removeListener('switch-to-account-tab', handler);
  },
  onReceivedNotification: (callback) => {
    const handler = (_event, item) => callback(item);
    ipcRenderer.on('nammil-received-notification', handler);
    return () => ipcRenderer.removeListener('nammil-received-notification', handler);
  },
});

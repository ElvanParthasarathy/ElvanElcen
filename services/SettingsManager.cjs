const fs = require('fs');
const path = require('path');

class SettingsManager {
  constructor(app, nativeTheme) {
    this.app = app;
    this.nativeTheme = nativeTheme;
    this.settingsPath = path.join(app.getPath('userData'), 'nammil_settings.json');
    this.settings = this.getSettingsSync();

    if (this.settings.theme === 'light' || this.settings.theme === 'dark') {
      this.nativeTheme.themeSource = this.settings.theme;
    } else {
      this.nativeTheme.themeSource = 'system';
    }
  }

  getSettingsSync() {
    let defaultSettings = { 
      language: 'system', 
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
    try {
      if (fs.existsSync(this.settingsPath)) {
        const raw = fs.readFileSync(this.settingsPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.notificationSound === 'default') {
          parsed.notificationSound = 'kumizhi';
        }
        if (!parsed.accountSounds) {
          parsed.accountSounds = {};
        }
        // If file exists and doesn't explicitly have isFirstBoot, it's not the first boot.
        if (parsed.isFirstBoot === undefined) {
          parsed.isFirstBoot = false;
        }
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.error('Error reading settings file, returning defaults', e);
    }
    return defaultSettings;
  }

  saveSettingsSync(newSettings) {
    try {
      this.settings = newSettings;
      fs.writeFileSync(this.settingsPath, JSON.stringify(newSettings, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error('Error saving settings file:', e);
      return false;
    }
  }

  getMediaFolder() {
    const s = this.getSettingsSync();
    if (s.mediaFolderPath && fs.existsSync(s.mediaFolderPath) && (s.mediaFolderPath.toLowerCase().endsWith('media') || s.mediaFolderPath.toLowerCase().includes('elvan nammil'))) {
      return s.mediaFolderPath;
    }
    if (s.mediaFolder && fs.existsSync(s.mediaFolder) && (s.mediaFolder.toLowerCase().endsWith('media') || s.mediaFolder.toLowerCase().includes('elvan nammil'))) {
      return s.mediaFolder;
    }
    const docsMedia = path.join(this.app.getPath('documents'), 'Elvan Nammil', 'Media');
    if (fs.existsSync(docsMedia)) {
      return docsMedia;
    }
    const userDataMedia = path.join(this.app.getPath('userData'), 'Media');
    return fs.existsSync(userDataMedia) ? userDataMedia : docsMedia;
  }

  setMediaFolder(newPath) {
    const s = this.getSettingsSync();
    s.mediaFolder = newPath;
    s.mediaFolderPath = newPath;
    this.saveSettingsSync(s);
  }

  renameAccountFolder(oldName, newName) {
    try {
      if (!oldName || !newName || oldName === newName) return null;
      const sanitize = name => name.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'Account';
      const safeOld = sanitize(oldName);
      const safeNew = sanitize(newName);
      if (safeOld === safeNew) return null;

      const baseDir = this.getMediaFolder();
      const oldDir = path.join(baseDir, safeOld);
      let newDir = path.join(baseDir, safeNew);

      if (!fs.existsSync(oldDir)) return null;

      if (fs.existsSync(newDir)) {
        let counter = 2;
        while (fs.existsSync(newDir)) {
          newDir = path.join(baseDir, `${safeNew} (${counter})`);
          counter++;
        }
      }

      fs.renameSync(oldDir, newDir);
      return path.basename(newDir);
    } catch (e) {
      console.error('Failed to rename account folder:', e);
      return null;
    }
  }

  registerIPC(ipcMain, dialog, orchestrator) {
    ipcMain.handle('get-settings', () => {
      return this.getSettingsSync();
    });

    ipcMain.on('save-setting', (event, key, value) => {
      let s = this.getSettingsSync();
      s[key] = value;
      this.saveSettingsSync(s);
    });

    ipcMain.handle('complete-first-boot', (event, newAccounts, mediaFolder) => {
      let settings = this.getSettingsSync();
      settings.accounts = newAccounts;
      settings.isFirstBoot = false;

      if (mediaFolder) {
        let finalPath = mediaFolder;
        if (!finalPath.toLowerCase().endsWith('media') && !finalPath.toLowerCase().includes('elvan nammil')) {
          finalPath = path.join(finalPath, 'Elvan Nammil', 'Media');
        }
        settings.mediaFolder = finalPath;
        settings.mediaFolderPath = finalPath;
        if (!fs.existsSync(finalPath)) {
          fs.mkdirSync(finalPath, { recursive: true });
        }
      }

      this.saveSettingsSync(settings);

      // Create views for the initial accounts
      newAccounts.forEach(acc => {
        orchestrator.whatsAppViewManager.createView(acc.id, acc.name);
      });
      
      const mainWindow = orchestrator.windowManager.mainWindow;
      if (mainWindow) {
        mainWindow.setResizable(true);
        mainWindow.setMaximizable(true);
        mainWindow.setMinimumSize(940, 600);
        mainWindow.setSize(1280, 720);
        mainWindow.center();
      }
      
      orchestrator.whatsAppViewManager.resizeViews();
      return settings.accounts;
    });

    ipcMain.handle('update-accounts', (event, newAccounts) => {
      let settings = this.getSettingsSync();
      const oldAccounts = settings.accounts;
      
      newAccounts.forEach(newAcc => {
        const oldAcc = oldAccounts.find(a => a.id === newAcc.id);
        if (oldAcc && oldAcc.name !== newAcc.name) {
          const actualName = this.renameAccountFolder(oldAcc.name, newAcc.name);
          if (actualName) newAcc.name = actualName;
          const v = orchestrator.whatsAppViewManager.getView(newAcc.id);
          if (v) v.accountName = newAcc.name;
        }
      });

      const oldIds = oldAccounts.map(a => a.id);
      const newIds = newAccounts.map(a => a.id);
      const removedIds = oldIds.filter(id => !newIds.includes(id));
      const addedAccounts = newAccounts.filter(a => !oldIds.includes(a.id));
      
      removedIds.forEach(id => {
        orchestrator.whatsAppViewManager.removeView(id);
      });

      addedAccounts.forEach(acc => {
        orchestrator.whatsAppViewManager.createView(acc.id, acc.name);
      });

      settings.accounts = newAccounts;
      this.saveSettingsSync(settings);
      orchestrator.whatsAppViewManager.resizeViews();
      return settings.accounts;
    });

    ipcMain.on('update-theme', (event, theme) => {
      let s = this.getSettingsSync();
      s.theme = theme;
      this.saveSettingsSync(s);

      if (theme === 'light' || theme === 'dark') {
        this.nativeTheme.themeSource = theme;
      } else {
        this.nativeTheme.themeSource = 'system';
      }

      const isLight = this.nativeTheme.shouldUseDarkColors === false;
      orchestrator.whatsAppViewManager.applyTheme(!isLight);

      if (orchestrator.windowManager.mainWindow) {
        orchestrator.windowManager.mainWindow.setTitleBarOverlay({
          color: 'rgba(0,0,0,0)',
          symbolColor: isLight ? '#111b21' : '#e9edef',
          height: 48
        });
      }
      orchestrator.whatsAppViewManager.resizeViews();
    });

    ipcMain.handle('get-auto-start', () => {
      return this.app.getLoginItemSettings().openAtLogin;
    });

    ipcMain.on('set-auto-start', (event, enabled) => {
      this.app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath
      });
    });

    ipcMain.on('set-hardware-acceleration', (event, enabled) => {
      let s = this.getSettingsSync();
      s.hardwareAcceleration = enabled;
      this.saveSettingsSync(s);
      const mainWindow = orchestrator.windowManager.mainWindow;
      if (mainWindow) {
        mainWindow.webContents.send('restart-required');
      }
    });

    ipcMain.handle('get-base-media-dir', () => {
      return this.getMediaFolder();
    });

    ipcMain.handle('pick-folder', async () => {
      const mainWindow = orchestrator.windowManager.mainWindow;
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Storage Location',
        properties: ['openDirectory', 'createDirectory']
      });
      if (canceled || filePaths.length === 0) return null;
      return filePaths[0];
    });

    ipcMain.handle('change-media-folder', async () => {
      const mainWindow = orchestrator.windowManager.mainWindow;
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Storage Location',
        properties: ['openDirectory', 'createDirectory']
      });

      if (canceled || filePaths.length === 0) return { success: false, reason: 'canceled' };

      const selectedRoot = filePaths[0];
      const newBase = (selectedRoot.toLowerCase().endsWith('media') || selectedRoot.toLowerCase().includes('elvan nammil'))
        ? selectedRoot
        : path.join(selectedRoot, 'Elvan Nammil', 'Media');
      const oldBase = this.getMediaFolder();

      if (newBase.toLowerCase() === oldBase.toLowerCase()) {
        return { success: false, reason: 'same_path' };
      }

      function getAllFiles(dir, fileList = []) {
        if (!fs.existsSync(dir)) return fileList;
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, fileList);
          } else {
            fileList.push(fullPath);
          }
        }
        return fileList;
      }

      try {
        if (mainWindow) mainWindow.webContents.send('migration-progress', { status: 'counting' });
        const filesToMove = getAllFiles(oldBase);
        const total = filesToMove.length;
        
        let current = 0;
        for (const oldPath of filesToMove) {
          const relativePath = path.relative(oldBase, oldPath);
          const newPath = path.join(newBase, relativePath);
          
          fs.mkdirSync(path.dirname(newPath), { recursive: true });
          
          if (mainWindow) {
            mainWindow.webContents.send('migration-progress', { 
              status: 'copying', 
              current, 
              total, 
              filename: path.basename(oldPath) 
            });
          }
          
          fs.copyFileSync(oldPath, newPath);
          current++;
        }

        if (mainWindow) mainWindow.webContents.send('migration-progress', { status: 'verifying' });
        const newFiles = getAllFiles(newBase);
        if (newFiles.length < total) {
          throw new Error("Verification failed: not all files were copied.");
        }

        if (mainWindow) mainWindow.webContents.send('migration-progress', { status: 'switching' });
        this.setMediaFolder(newBase);
        try {
          const { updateMediaBaseDir } = require('../database.js');
          updateMediaBaseDir(oldBase, newBase);
        } catch (dbErr) {
          console.error('Failed to update DB base dir:', dbErr);
        }

        if (mainWindow) mainWindow.webContents.send('migration-progress', { status: 'cleaning' });
        try {
          const rmRobust = (dirPath) => {
            if (!fs.existsSync(dirPath)) return;
            try {
              const entries = fs.readdirSync(dirPath);
              for (const entry of entries) {
                const fullPath = path.join(dirPath, entry);
                try {
                  const st = fs.lstatSync(fullPath);
                  if (st.isDirectory()) {
                    rmRobust(fullPath);
                  } else {
                    try { fs.chmodSync(fullPath, 0o666); } catch (e) {}
                    fs.unlinkSync(fullPath);
                  }
                } catch (errItem) {
                  console.error('Error unlinking item:', fullPath, errItem.message);
                }
              }
              fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
            } catch (errDir) {
              console.error('Error removing dir:', dirPath, errDir.message);
            }
          };
          rmRobust(oldBase);
          const parentDir = path.dirname(oldBase);
          if (path.basename(parentDir) === 'Elvan Nammil' && fs.existsSync(parentDir)) {
            try {
              if (fs.readdirSync(parentDir).length === 0) {
                fs.rmdirSync(parentDir);
              }
            } catch (e) {}
          }
        } catch (cleanErr) {
          console.error('Failed to clean old media folder:', cleanErr);
        }

        return { success: true, newPath: newBase };

      } catch (e) {
        console.error('Migration failed:', e);
        return { success: false, reason: 'error', error: e.message };
      }
    });
  }
}

module.exports = SettingsManager;

const path = require('path');
const { execFile } = require('child_process');

class NotificationManager {
  constructor(app, orchestrator) {
    this.app = app;
    this.orchestrator = orchestrator;
  }

  playNotificationSound(soundType, customPath) {
    if (!soundType || soundType === 'silent') return;

    const mainWindow = this.orchestrator.windowManager.mainWindow;
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
      mainWindow.webContents.send('play-notification-sound', soundType, customPath);
      return;
    }

    if (soundType === 'custom' && customPath) {
      const ps = `Add-Type -AssemblyName PresentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open([Uri]'${customPath.replace(/'/g, "''")}'); $player.Play(); Start-Sleep -Seconds 3`;
      execFile('powershell', ['-NoProfile', '-Command', ps], (err) => {
        if (err) console.error('Custom sound playback failed:', err.message);
      });
      return;
    }

    const bundledMp3s = ['thuli', 'thullal', 'thendral', 'minnal', 'kumizhi', 'alai'];
    if (bundledMp3s.includes(soundType)) {
      const mp3Path = path.join(__dirname, '..', 'public', 'sounds', `${soundType}.mp3`);
      const ps = `Add-Type -AssemblyName PresentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open([Uri]'${mp3Path.replace(/'/g, "''")}'); $player.Play(); Start-Sleep -Seconds 3`;
      execFile('powershell', ['-NoProfile', '-Command', ps], (err) => {
        if (err) console.error('Bundled sound playback failed:', err.message);
      });
      return;
    }

    const wavMap = {
      'default': 'C:\\Windows\\Media\\Windows Notify Messaging.wav',
      'beep': 'C:\\Windows\\Media\\Windows Ding.wav',
      'exclamation': 'C:\\Windows\\Media\\Windows Exclamation.wav',
      'critical': 'C:\\Windows\\Media\\Windows Critical Stop.wav',
      'question': 'C:\\Windows\\Media\\Windows Notify System Generic.wav'
    };

    const wavPath = wavMap[soundType] || 'C:\\Windows\\Media\\Windows Notify Messaging.wav';
    const ps = `
      $path = '${wavPath}';
      if (-not (Test-Path $path)) { $path = 'C:\\Windows\\Media\\notify.wav' }
      if (Test-Path $path) {
        (New-Object System.Media.SoundPlayer $path).PlaySync();
      } else {
        [System.Media.SystemSounds]::Asterisk.Play();
      }
    `;
    execFile('powershell', ['-NoProfile', '-Command', ps], (err) => {
      if (err) console.error('System sound playback failed:', err.message);
    });
  }

  registerIPC(ipcMain, dialog) {
    ipcMain.on('whatsapp-new-message', (event, data) => {
      const s = this.orchestrator.settingsManager.getSettingsSync();
      if (s.notificationsEnabled === false) return;

      const senderWebContentsId = event.sender.id;
      let accountName = 'WhatsApp';
      let accountId = null;
      const views = this.orchestrator.whatsAppViewManager.views;

      for (const accId in views) {
        const v = views[accId];
        if (v && v.webContents && v.webContents.id === senderWebContentsId) {
          accountName = v.accountName || accountName;
          accountId = accId;
          break;
        }
      }

      if (s.mutedAccounts && (s.mutedAccounts.includes(accountName) || (accountId && s.mutedAccounts.includes(accountId)))) return;

      const mainWindow = this.orchestrator.windowManager.mainWindow;
      if (s.flashTaskbar !== false && mainWindow) {
        mainWindow.flashFrame(true);
        const stopFlash = () => {
          mainWindow.flashFrame(false);
          mainWindow.removeListener('focus', stopFlash);
        };
        mainWindow.on('focus', stopFlash);
      }

      const soundToPlay = (accountId && s.accountSounds && s.accountSounds[accountId]) || s.notificationSound || 'kumizhi';
      this.playNotificationSound(soundToPlay, s.customSoundPath);

      if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
        mainWindow.webContents.send('nammil-received-notification', {
          id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          accountId: accountId || 'unknown',
          accountName: accountName || 'WhatsApp',
          title: data.sender || 'WhatsApp',
          body: data.preview || '',
          icon: data.icon || null,
          timestamp: Date.now()
        });
      }
    });

    ipcMain.on('whatsapp-notification-clicked', (event) => {
      const senderWebContentsId = event.sender.id;
      let accountId = null;
      const views = this.orchestrator.whatsAppViewManager.views;

      for (const accId in views) {
        const v = views[accId];
        if (v && v.webContents && v.webContents.id === senderWebContentsId) {
          accountId = accId;
          break;
        }
      }

      const mainWindow = this.orchestrator.windowManager.mainWindow;
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();

        if (accountId) {
          Object.values(views).forEach(view => {
            try { mainWindow.contentView.removeChildView(view); } catch(e){}
          });
          if (views[accountId]) {
            mainWindow.contentView.addChildView(views[accountId]);
            this.orchestrator.whatsAppViewManager.resizeViews();
          }
          mainWindow.webContents.send('switch-to-account-tab', `wa-${accountId}`);
        }
      }
    });

    ipcMain.handle('select-custom-sound', async () => {
      const mainWindow = this.orchestrator.windowManager.mainWindow;
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Notification Sound',
        filters: [{ name: 'Audio Files', extensions: ['wav', 'mp3', 'ogg', 'm4a'] }],
        properties: ['openFile']
      });
      if (canceled || filePaths.length === 0) return null;
      return filePaths[0];
    });

    ipcMain.on('preview-sound', (event, soundType) => {
      const s = this.orchestrator.settingsManager.getSettingsSync();
      this.playNotificationSound(soundType, s.customSoundPath);
    });
  }
}

module.exports = NotificationManager;

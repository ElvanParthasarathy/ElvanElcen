const path = require('path');
const { WebContentsView, Menu, MenuItem, shell } = require('electron');

const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const WHATSAPP_URL = 'https://web.whatsapp.com';

class WhatsAppViewManager {
  constructor(app, orchestrator) {
    this.app = app;
    this.orchestrator = orchestrator;
    this.views = {};
  }

  createWhatsAppView(partition, accountName, accountId) {
    const view = new WebContentsView({
      webPreferences: {
        partition: partition,
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'whatsapp_preload.cjs')
      }
    });

    const settings = this.orchestrator.settingsManager.getSettingsSync();
    if (settings.language && settings.language !== 'system') {
      let langCode = 'en-US';
      if (settings.language.startsWith('ta')) langCode = 'ta';
      else if (settings.language.startsWith('ml')) langCode = 'ml';
      view.webContents.session.setAcceptLanguages([langCode, 'en-US', 'en']);
    }

    view.webContents.setUserAgent(USER_AGENT);
    view.webContents.loadURL(WHATSAPP_URL);

    view.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      if (permission === 'media' || permission === 'notifications') {
        callback(true);
      } else {
        callback(false);
      }
    });

    view.webContents.session.setPermissionCheckHandler((webContents, permission) => {
      if (permission === 'media' || permission === 'notifications') {
        return true;
      }
      return false;
    });

    view.webContents.on('did-finish-load', () => {
      view.webContents.insertCSS(`
        @font-face {
          font-family: 'Elvan Sans';
          src: url('nammil://assets/Fonts/ElvanSans-Regular.ttf') format('truetype');
        }
        body, button, input, select, textarea, div { 
          font-family: 'Elvan Sans', sans-serif !important; 
        }
        [data-testid="chatlist-header"] {
          border-top-left-radius: 10px !important;
          position: relative;
        }
        [data-testid="banner"], [data-testid="download-banner"], [data-testid="prompt-banner"], [data-testid="native-app-prompt"] {
          display: none !important;
        }
      `).catch(() => {});

      const isDark = this.orchestrator.windowManager && this.orchestrator.windowManager.nativeTheme ? this.orchestrator.windowManager.nativeTheme.shouldUseDarkColors : true;
      view.webContents.executeJavaScript(`
        try {
          if (${isDark}) {
            document.body.classList.add('dark');
            window.localStorage.setItem('theme', '"dark"');
          } else {
            document.body.classList.remove('dark');
            window.localStorage.setItem('theme', '"light"');
          }
        } catch(e) {}
      `).catch(() => {});

      view.webContents.executeJavaScript(`
        (function() {
          try {
            Object.defineProperty(navigator, 'platform', { get: () => 'Linux x86_64' });
            if (navigator.userAgentData) {
              Object.defineProperty(navigator.userAgentData, 'platform', { get: () => 'Linux' });
            }
          } catch(e) {}

          try {
            const _Orig = window.Notification;
            if (!_Orig) return;

            const _recentAlerts = new Set();

            window.Notification = function(title, options) {
              var opts = Object.assign({}, options || {}, { silent: true });
              const n = new _Orig(title, opts);

              n.addEventListener('click', function() {
                try {
                  if (window.__nammilBridge && window.__nammilBridge.onNotificationClick) {
                    window.__nammilBridge.onNotificationClick();
                  }
                } catch(e) {}
              });

              try {
                const key = title + ':' + (options && options.body || '');
                if (!_recentAlerts.has(key)) {
                  _recentAlerts.add(key);
                  setTimeout(function() { _recentAlerts.delete(key); }, 5000);
                  if (window.__nammilBridge && window.__nammilBridge.onNewMessage) {
                    window.__nammilBridge.onNewMessage(title, options && options.body, options && options.icon);
                  }
                }
              } catch(e) {}

              return n;
            };

            Object.defineProperty(window.Notification, 'permission', {
              get: () => 'granted',
              configurable: true
            });
            window.Notification.requestPermission = () => Promise.resolve('granted');
            window.Notification.prototype = _Orig.prototype;

            var _OrigAudio = window.Audio;
            window.Audio = function(src) {
              var a = new _OrigAudio(src);
              a.volume = 0;
              return a;
            };
            window.Audio.prototype = _OrigAudio.prototype;
          } catch(e) {
            console.error('[Nammil] Notification main-world setup error:', e);
          }
        })();
      `).catch(() => {});
    });

    // Handle offline/load failures — retry automatically
    view.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      if (validatedURL && validatedURL.startsWith(WHATSAPP_URL)) {
        console.log(`[Nammil] WhatsApp view failed to load (${errorDescription}), retrying in 5s...`);
        setTimeout(() => {
          try {
            view.webContents.loadURL(WHATSAPP_URL);
          } catch(e) {}
        }, 5000);
      }
    });

    view.webContents.session.on('will-download', (event, item, webContents) => {
      const fileName = item.getFilename();
      const tempPath = path.join(this.app.getPath('temp'), fileName);
      item.setSavePath(tempPath);

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        }
      });

      item.once('done', async (event, state) => {
        if (state === 'completed') {
          const result = await this.orchestrator.downloadManager.processDownloadedFile(tempPath, fileName, view.accountName);
          const mainWindow = this.orchestrator.windowManager.mainWindow;
          if (mainWindow) {
            mainWindow.webContents.send('download-complete', result);
          }
          if (result.success && result.filePath) {
            shell.openPath(result.filePath);
          }
        }
      });
    });

    view.webContents.setWindowOpenHandler(({ url }) => {
      if (url.includes('web.whatsapp.com/call/')) {
        return { 
          action: 'allow',
          overrideBrowserWindowOptions: {
            autoHideMenuBar: true,
            titleBarStyle: 'default',
            width: 800,
            height: 600
          }
        };
      }
      shell.openExternal(url);
      return { action: 'deny' };
    });

    view.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith('https://web.whatsapp.com') && !url.startsWith('file://')) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });

    view.webContents.on('context-menu', (event, params) => {
      const menu = new Menu();
      if (params.hasImageContents) {
        menu.append(new MenuItem({ 
          label: 'Copy Image', 
          click: () => {
            view.webContents.copyImageAt(params.x, params.y);
          }
        }));
      }
      if (params.selectionText) {
        menu.append(new MenuItem({ label: 'Copy Text', role: 'copy' }));
      }
      if (params.isEditable) {
        menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
        menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
      }
      if (menu.items.length > 0) {
        menu.popup();
      }
    });

    view.accountName = accountName;
    view.accountId = accountId;
    return view;
  }

  createView(accountId, accountName) {
    this.views[accountId] = this.createWhatsAppView(`persist:${accountId}`, accountName, accountId);
    return this.views[accountId];
  }

  getView(accountId) {
    return this.views[accountId];
  }

  removeView(accountId) {
    const view = this.views[accountId];
    if (view) {
      const mainWindow = this.orchestrator.windowManager.mainWindow;
      if (mainWindow && mainWindow.contentView) {
        try { mainWindow.contentView.removeChildView(view); } catch(e){}
      }
      delete this.views[accountId];
    }
  }

  resizeViews() {
    const mainWindow = this.orchestrator.windowManager.mainWindow;
    if (!mainWindow) return;
    const bounds = mainWindow.getContentBounds();
    const titleBarHeight = 49;

    const rect = { 
      x: 0, 
      y: titleBarHeight, 
      width: bounds.width, 
      height: bounds.height - titleBarHeight 
    };

    Object.values(this.views).forEach(view => {
      try {
        view.setBounds(rect);
      } catch (e) {}
    });
  }

  applyTheme(isDark) {
    const code = `
      try {
        if (${isDark}) {
          document.body.classList.add('dark');
          window.localStorage.setItem('theme', '"dark"');
        } else {
          document.body.classList.remove('dark');
          window.localStorage.setItem('theme', '"light"');
        }
      } catch(e) {}
    `;
    Object.values(this.views).forEach(view => {
      if (view && view.webContents) {
        view.webContents.executeJavaScript(code).catch(() => {});
      }
    });
  }

  registerIPC(ipcMain) {
    ipcMain.on('switch-tab', (event, targetView) => {
      const mainWindow = this.orchestrator.windowManager.mainWindow;
      if (!mainWindow) return;

      Object.values(this.views).forEach(view => {
        try { mainWindow.contentView.removeChildView(view); } catch(e){}
      });

      if (this.views[targetView]) {
        mainWindow.contentView.addChildView(this.views[targetView]);
        this.resizeViews();
      }
    });
  }
}

module.exports = WhatsAppViewManager;

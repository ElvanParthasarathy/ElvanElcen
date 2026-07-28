const path = require('path');
const { Tray, Menu, nativeImage } = require('electron');

class TrayManager {
  constructor(app, orchestrator) {
    this.app = app;
    this.orchestrator = orchestrator;
    this.tray = null;
  }

  createTray() {
    const iconPath = path.join(__dirname, '..', 'src', 'assets', 'app_icon.ico');
    this.tray = new Tray(nativeImage.createFromPath(iconPath));
    const trayMenu = Menu.buildFromTemplate([
      { 
        label: 'Show Nammil', 
        click: () => { 
          const mainWindow = this.orchestrator.windowManager.mainWindow;
          if (mainWindow) {
            mainWindow.show(); 
            mainWindow.focus(); 
          }
        } 
      },
      { type: 'separator' },
      { 
        label: 'Quit', 
        click: () => { 
          this.app.isQuitting = true; 
          this.app.quit(); 
        } 
      }
    ]);
    this.tray.setToolTip('Elvan Nammil');
    this.tray.setContextMenu(trayMenu);
    this.tray.on('double-click', () => {
      const mainWindow = this.orchestrator.windowManager.mainWindow;
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
    return this.tray;
  }
}

module.exports = TrayManager;

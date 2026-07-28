// ═══════════════════════════════════════════════════════════════════
//  whatsapp_preload.cjs — Preload for WhatsApp WebContentsView
//
//  With contextIsolation: true, this script runs in an ISOLATED world.
//  Any modifications to window.Notification here do NOT reach WhatsApp
//  Web's main world. Instead, we:
//
//  1) Expose an IPC bridge to the main world via contextBridge
//  2) The actual Notification permission override + wrapper is injected
//     into the main world by main.js via executeJavaScript()
// ═══════════════════════════════════════════════════════════════════
const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal IPC bridge to the main world.
// main.js injects a Notification wrapper that calls this to trigger
// custom sound + taskbar flash when WhatsApp creates a notification.
contextBridge.exposeInMainWorld('__nammilBridge', {
  onNewMessage: (sender, preview, icon) => {
    ipcRenderer.send('whatsapp-new-message', {
      sender: sender || 'WhatsApp',
      preview: (preview || '').substring(0, 100),
      chatId: sender,
      icon: icon,
      unreadCount: 1
    });
  },
  onNotificationClick: () => {
    ipcRenderer.send('whatsapp-notification-clicked');
  }
});


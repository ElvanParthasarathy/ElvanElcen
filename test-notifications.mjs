// ═══════════════════════════════════════════════════════════════════
//  test-notifications.mjs — Electron Notification Diagnostic Tool
//  Tests all notification pathways to verify they work in dev mode.
//  Usage: npx electron test-notifications.mjs
// ═══════════════════════════════════════════════════════════════════
import { app, BrowserWindow, Notification, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Must be set before app.whenReady for Windows Toast Notifications
app.setAppUserModelId('com.nammil.app');

const results = [];
function log(label, pass, detail = '') {
  const icon = pass ? '✅' : '❌';
  const msg = `${icon} ${label}${detail ? ' — ' + detail : ''}`;
  results.push({ label, pass, detail });
  console.log(msg);
}

app.whenReady().then(async () => {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Nammil — Electron Notification Diagnostics');
  console.log('══════════════════════════════════════════════\n');

  // ── Test 1: Notification API available ──
  log('Notification class exists', typeof Notification === 'function');

  // ── Test 2: Notification.isSupported() ──
  const supported = Notification.isSupported();
  log('Notification.isSupported()', supported);

  if (!supported) {
    console.log('\n❌ FATAL: Notifications are not supported on this system.');
    console.log('   Possible causes:');
    console.log('   - Linux without libnotify');
    console.log('   - Windows notification service disabled');
    app.quit();
    return;
  }

  // ── Test 3: Main Process Notification ──
  try {
    const notif = new Notification({
      title: 'Nammil — Main Process Test',
      body: 'If you see this popup, main process notifications work!',
      icon: path.join(__dirname, 'public', 'logo.ico'),
      silent: false
    });

    let shown = false;
    notif.on('show', () => { shown = true; });
    notif.on('failed', (e, msg) => {
      log('Main Process Notification', false, `Failed: ${msg}`);
    });

    notif.show();

    // Wait a moment for the show event
    await new Promise(r => setTimeout(r, 1500));
    log('Main Process Notification', true, shown ? 'show event fired' : 'show() called (no error)');
  } catch (err) {
    log('Main Process Notification', false, err.message);
  }

  // ── Test 4: Renderer Process (Web API) Notification ──
  const testHTML = `data:text/html,
    <html><head><title>Notification Test</title></head>
    <body style="background:#1a1a2e;color:#eee;font-family:system-ui;padding:40px;">
      <h1>Nammil Notification Tester</h1>
      <pre id="log" style="font-size:14px;line-height:1.8;"></pre>
      <script>
        const { ipcRenderer } = require('electron');
        const el = document.getElementById('log');
        function addLog(msg) { el.textContent += msg + '\\n'; }

        async function runTests() {
          // Test: Notification API exists in renderer
          addLog(typeof Notification !== 'undefined'
            ? '✅ window.Notification exists in renderer'
            : '❌ window.Notification is MISSING in renderer');

          // Test: Permission
          const perm = Notification.permission;
          addLog(perm === 'granted'
            ? '✅ Notification.permission = granted'
            : '❌ Notification.permission = ' + perm);

          // Test: requestPermission
          try {
            const result = await Notification.requestPermission();
            addLog(result === 'granted'
              ? '✅ requestPermission() returned granted'
              : '❌ requestPermission() returned ' + result);
          } catch(e) {
            addLog('❌ requestPermission() threw: ' + e.message);
          }

          // Test: Create actual notification
          try {
            const n = new Notification('Nammil — Renderer Test', {
              body: 'If you see this popup, renderer notifications work!',
              tag: 'nammil-test'
            });
            addLog('✅ new Notification() created successfully');

            n.onshow = () => addLog('✅ Notification onshow fired');
            n.onerror = (e) => addLog('❌ Notification onerror: ' + e);
          } catch(e) {
            addLog('❌ new Notification() threw: ' + e.message);
          }

          // Send results to main process
          setTimeout(() => {
            ipcRenderer.send('renderer-tests-done', el.textContent);
          }, 2000);
        }

        runTests();
      </script>
    </body></html>`;

  const win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Grant notification permission for the renderer
  win.webContents.session.setPermissionRequestHandler((wc, perm, cb) => {
    cb(perm === 'notifications' || perm === 'media');
  });
  win.webContents.session.setPermissionCheckHandler((wc, perm) => {
    return perm === 'notifications' || perm === 'media';
  });

  win.loadURL(testHTML);

  ipcMain.on('renderer-tests-done', (event, logText) => {
    console.log('\n── Renderer Process Results ──');
    console.log(logText);

    console.log('\n══════════════════════════════════════════════');
    console.log('  Summary');
    console.log('══════════════════════════════════════════════');
    results.forEach(r => {
      console.log(`  ${r.pass ? '✅' : '❌'} ${r.label}${r.detail ? ' — ' + r.detail : ''}`);
    });
    console.log('\n  If you saw TWO notification popups (Main + Renderer),');
    console.log('  everything is working correctly!\n');
  });
});

app.on('window-all-closed', () => app.quit());

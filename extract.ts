import { k } from './src/i18n/k';
import { en } from './src/i18n/en';
import { ta } from './src/i18n/ta';
import { ta_Latn } from './src/i18n/ta-Latn';
import { ml } from './src/i18n/ml';
import { ml_Latn } from './src/i18n/ml-Latn';
import { ta_ml } from './src/i18n/ta-ml';
import fs from 'fs';
import path from 'path';

const langs = [
  { id: 'en', data: en },
  { id: 'ta', data: ta },
  { id: 'ta-Latn', data: ta_Latn },
  { id: 'ml', data: ml },
  { id: 'ml-Latn', data: ml_Latn },
  { id: 'ta-ml', data: ta_ml }
];

const keys = [
  // Settings
  k.GENERAL_TITLE, k.GENERAL_DESC, k.GENERAL_STARTUP, k.GENERAL_STARTUP_DESC, k.GENERAL_START_MINIMIZED,
  k.GENERAL_TRAY, k.GENERAL_TRAY_DESC, k.GENERAL_LOW_MEMORY, k.GENERAL_LOW_MEMORY_DESC, k.GENERAL_HW_ACCEL,
  k.GENERAL_HW_ACCEL_DESC, k.GENERAL_RESTART_REQUIRED, k.GENERAL_PERFORMANCE, k.GENERAL_RESTART_NOW,
  
  k.NOTIF_TITLE, k.NOTIF_DESC, k.NOTIF_ENABLE, k.NOTIF_ENABLE_DESC, k.NOTIF_FLASH, k.NOTIF_FLASH_DESC,
  k.NOTIF_SOUND_TITLE, k.NOTIF_SOUND_DEFAULT, k.NOTIF_SOUND_THULI, k.NOTIF_SOUND_THULLAL, k.NOTIF_SOUND_THENDRAL,
  k.NOTIF_SOUND_MINNAL, k.NOTIF_SOUND_KUMIZHI, k.NOTIF_SOUND_ALAI, k.NOTIF_SOUND_BEEP, k.NOTIF_SOUND_EXCLAMATION,
  k.NOTIF_SOUND_CRITICAL, k.NOTIF_SOUND_QUESTION, k.NOTIF_SOUND_SILENT, k.NOTIF_SOUND_CUSTOM, k.NOTIF_PER_ACCOUNT,
  
  k.ABOUT_TITLE, k.ABOUT_DESC, k.ABOUT_VERSION, k.ABOUT_DEVELOPER, k.ABOUT_DEV_NAME, k.ABOUT_BUILT_WITH,
  k.ABOUT_SHORTCUTS, k.ABOUT_SHORTCUT_DEVTOOLS, k.ABOUT_SHORTCUT_DEVTOOLS_ALT, k.ABOUT_COPYRIGHT,
  
  // Notification Page
  k.NOTIF_PAGE_TITLE, k.NOTIF_SIDEBAR_ALL, k.NOTIF_PLURAL, k.NOTIF_ALL_CAUGHT_UP, k.NOTIF_EMPTY_MSG_ALL,
  k.NOTIF_EMPTY_MSG_SINGLE, k.BTN_CLEAR
];

let md = '# Translations Review\n\n';
md += '| Key | ' + langs.map(l => l.id).join(' | ') + ' |\n';
md += '|---|' + langs.map(() => '---').join('|') + '|\n';

for (const key of keys) {
  if (!key) continue;
  md += `| \`${key}\` | ` + langs.map(l => `\`${(l.data as any)[key] || ''}\``).join(' | ') + ' |\n';
}

const outPath = 'C:\\\\Users\\\\Elvan\\\\.gemini\\\\antigravity\\\\brain\\\\a259e8fc-0f4a-4a5a-a9ab-2243b14861ac\\\\translations_review.md';
fs.writeFileSync(outPath, md);
console.log('Wrote to ' + outPath);

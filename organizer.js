// ═══════════════════════════════════════════════════════════════════
//  organizer.js — Download processor.
//  Receives a temp file from Electron's download interceptor,
//  delegates to storage.js for saving, then records metadata in DB.
// ═══════════════════════════════════════════════════════════════════
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { app } from 'electron';
import { saveFile } from './storage.js';
import { insertMedia } from './database.js';

// Re-export ensureDirectories from storage.js for backward compat
export { ensureDirectories } from './storage.js';

function computeHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export async function processDownloadedFile(filePath, fileName, accountName) {
  try {
    // Read user's duplicate preference
    let duplicateAction = 'skip';
    try {
      const settingsPath = path.join(app.getPath('userData'), 'nammil_settings.json');
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        duplicateAction = settings.duplicateAction || 'skip';
      }
    } catch (e) {}

    // Delegate ALL file operations to storage.js
    const result = saveFile(filePath, fileName, duplicateAction, accountName);

    if (result.success && !result.skipped) {
      // Only record metadata for genuinely new saves
      const hash = await computeHash(result.filePath);
      insertMedia(hash, result.fileName, result.filePath, result.type);

      // Extract thumbnail for PPTX/DOCX
      if (result.fileName.toLowerCase().endsWith('.pptx') || result.fileName.toLowerCase().endsWith('.docx')) {
        try {
          const AdmZip = (await import('adm-zip')).default;
          const zip = new AdmZip(result.filePath);
          const zipEntries = zip.getEntries();
          const thumbnailEntry = zipEntries.find(entry => entry.entryName.toLowerCase() === 'docprops/thumbnail.jpeg');
          if (thumbnailEntry) {
            const thumbnailData = thumbnailEntry.getData();
            const thumbPath = result.filePath + '_thumb.jpeg';
            fs.writeFileSync(thumbPath, thumbnailData);
          }
        } catch (e) {
          console.error('Failed to extract thumbnail:', e);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error processing file:', error);
    return { success: false, reason: 'error', error: error.message };
  }
}

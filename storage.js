// ═══════════════════════════════════════════════════════════════════
//  storage.js — The SINGLE source of truth for file existence.
//  Every file question goes through here. Never ask the database
//  whether a file exists — ask the disk.
// ═══════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const oldMediaDir = path.join(app.getPath('userData'), 'Media');
const newMediaDir = path.join(app.getPath('downloads'), 'Elvan Nammil', 'Media');

let BASE_MEDIA_DIR = fs.existsSync(oldMediaDir) ? oldMediaDir : newMediaDir;

export function setBaseMediaDir(newDir) {
  if (newDir) {
    BASE_MEDIA_DIR = newDir;
  }
}

export function getBaseMediaDir() {
  return BASE_MEDIA_DIR;
}

const SUBDIRS = ['Images', 'Videos', 'Documents', 'Audio'];

// Helper to get account-specific media dir
export function getAccountMediaDir(accountName) {
  return path.join(BASE_MEDIA_DIR, accountName || 'Default');
}

// ─── Ensure all media directories exist for an account ───
export function ensureDirectories(accountName) {
  const accountDir = getAccountMediaDir(accountName);
  for (const dir of SUBDIRS) {
    const p = path.join(accountDir, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }
}

// ─── Categorize a file by its extension ───
export function getFileType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return 'Images';
  if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) return 'Videos';
  if (['.mp3', '.wav', '.ogg', '.m4a', '.opus'].includes(ext)) return 'Audio';
  return 'Documents';
}



// ─── Find a file's full path by exact name (searches all subdirs for an account) ───
export function findFilePath(fileName, accountName) {
  const accountDir = getAccountMediaDir(accountName);
  for (const dir of SUBDIRS) {
    const p = path.join(accountDir, dir, fileName);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ─── Save a downloaded file. Handles duplicates cleanly. ───
// Returns: { success, fileName, filePath, type, skipped? }
export function saveFile(tempPath, fileName, duplicateAction, accountName) {
  ensureDirectories(accountName); // Make sure dirs exist just in time
  const type = getFileType(fileName);
  const destPath = path.join(getAccountMediaDir(accountName), type, fileName);
  const existingPath = findFilePath(fileName, accountName);

  // ── Case 1: File already exists on disk ──
  if (existingPath) {
    if (duplicateAction === 'skip') {
      // File is already there. Just discard the temp copy.
      try { fs.unlinkSync(tempPath); } catch (e) {}
      return { success: true, skipped: true, fileName, filePath: existingPath, type };
    } else if (duplicateAction === 'replace') {
      // Delete the old file first, then save the new one cleanly
      try { fs.unlinkSync(existingPath); } catch (e) {}
    }
  }

  // ── Case 2: Save the file ──
  try {
    fs.renameSync(tempPath, destPath);
    return { success: true, fileName, filePath: destPath, type };
  } catch (err) {
    // renameSync can fail across drives; fall back to copy + delete
    try {
      fs.copyFileSync(tempPath, destPath);
      fs.unlinkSync(tempPath);
      return { success: true, fileName, filePath: destPath, type };
    } catch (copyErr) {
      console.error('storage.saveFile failed:', copyErr);
      return { success: false, error: copyErr.message };
    }
  }
}

// ─── Rename an account folder (handles duplicate new names) ───
export function renameAccountFolder(oldName, newName) {
  // Defense in depth: sanitize on backend too
  const RESERVED = ['CON','PRN','AUX','NUL','COM1','COM2','COM3','COM4','COM5','COM6','COM7','COM8','COM9','LPT1','LPT2','LPT3','LPT4','LPT5','LPT6','LPT7','LPT8','LPT9'];
  let safeName = newName.replace(/[<>:"\/\\|?*]/g, '').replace(/^[\s.]+|[\s.]+$/g, '').substring(0, 50);
  if (!safeName || RESERVED.includes(safeName.toUpperCase())) {
    console.error('renameAccountFolder: invalid or reserved name:', newName);
    return null;
  }

  const oldPath = getAccountMediaDir(oldName);
  let baseNewPath = getAccountMediaDir(safeName);
  let finalNewPath = baseNewPath;
  let counter = 1;

  if (!fs.existsSync(oldPath)) return safeName; // No folder to rename, just update the display name

  // If old and new resolve to the same path (case-only rename or same name), skip
  if (oldPath.toLowerCase() === finalNewPath.toLowerCase()) return safeName;

  // Avoid collisions if the target folder already exists
  while (fs.existsSync(finalNewPath)) {
    finalNewPath = baseNewPath + ` (${counter})`;
    counter++;
  }

  try {
    fs.renameSync(oldPath, finalNewPath);
    return path.basename(finalNewPath); // Return the actual name used
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      console.error('renameAccountFolder: folder is locked, try closing apps using it:', err.code);
    } else {
      console.error('Failed to rename account folder:', err);
    }
    return null;
  }
}

// ─── Delete an account folder entirely ───
export function deleteAccountFolder(accountName) {
  const accountDir = getAccountMediaDir(accountName);
  try {
    if (fs.existsSync(accountDir)) {
      fs.rmSync(accountDir, { recursive: true, force: true });
    }
    return true;
  } catch (err) {
    console.error('Failed to delete account folder:', err);
    return false;
  }
}

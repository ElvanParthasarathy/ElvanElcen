// ═══════════════════════════════════════════════════════════════════
//  database.js — Metadata storage ONLY.
//  This module stores download history for the Media gallery tab.
//  It is NEVER used to decide whether a file exists on disk.
//  For file existence, always ask storage.js.
// ═══════════════════════════════════════════════════════════════════
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'media.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    type TEXT NOT NULL,
    download_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_size INTEGER DEFAULT 0
  )
`);

// Add file_size column if migrating from an older version
try {
  db.exec('ALTER TABLE media ADD COLUMN file_size INTEGER DEFAULT 0');
} catch (e) {
  // Column already exists
}

// ─── Record a download in the metadata database ───
export function insertMedia(hash, fileName, filePath, type) {
  const stmt = db.prepare(
    'INSERT OR REPLACE INTO media (hash, file_name, file_path, type) VALUES (?, ?, ?, ?)'
  );
  stmt.run(hash, fileName, filePath, type);
}

// ─── Get media list for the Media gallery tab ───
export function getMedia(filter, accountName) {
  try {
    let query = 'SELECT * FROM media WHERE 1=1';
    const params = [];

  if (filter && filter !== 'All') {
    let typeFilter = 'Images';
    if (filter === 'Videos') typeFilter = 'Videos';
    if (filter === 'Audio') typeFilter = 'Audio';
    if (filter === 'Documents') typeFilter = 'Documents';
    query += ` AND type = ?`;
    params.push(typeFilter);
  }

  if (accountName && accountName !== 'All') {
    // Check for both slash and backslash separators to be OS-agnostic
    query += ` AND (file_path LIKE ? OR file_path LIKE ?)`;
    params.push(`%/${accountName}/%`, `%\\${accountName}\\%`);
  }

  query += ` ORDER BY download_date DESC`;
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  
  const deleteMediaStmt = db.prepare('DELETE FROM media WHERE file_path = ?');
  const validRows = [];
  for (const r of rows) {
    let stats;
    try {
      stats = fs.statSync(r.file_path);
    } catch (e) {
      // Self-heal: the user deleted this file via Windows File Explorer.
      // Wipe it from the database so it never shows up as a broken link.
      deleteMediaStmt.run(r.file_path);
      continue;
    }
    
    let size = r.file_size;
    
    // If size is 0 (old DB entry), compute and cache it once
    if (!size) {
      size = stats.size;
      try {
        db.prepare('UPDATE media SET file_size = ? WHERE id = ?').run(size, r.id);
      } catch(err) {}
    }

    validRows.push({
      fileName: r.file_name,
      filePath: r.file_path,
      fileSize: size,
      downloadedAt: stats.mtime.getTime(),
      mediaType: r.type.toLowerCase()
    });
  }
  
  // console.log(`getMedia returned ${validRows.length} rows for account=${accountName}`);
  return validRows;
} catch (error) {
  console.error('getMedia FATAL ERROR:', error);
  return [];
}
}

export function deleteMediaByAccount(accountName) {
  const stmt = db.prepare('DELETE FROM media WHERE file_path LIKE ? OR file_path LIKE ?');
  stmt.run(`%/${accountName}/%`, `%\\${accountName}\\%`);
}

export function deleteMediaByPaths(filePaths) {
  if (!filePaths || filePaths.length === 0) return;
  const placeholders = filePaths.map(() => '?').join(',');
  const stmt = db.prepare(`DELETE FROM media WHERE file_path IN (${placeholders})`);
  stmt.run(...filePaths);
}

// ─── Update all file paths when the storage folder changes ───
export function updateMediaBaseDir(oldBase, newBase) {
  const stmt = db.prepare('UPDATE media SET file_path = REPLACE(file_path, ?, ?)');
  stmt.run(oldBase, newBase);
}

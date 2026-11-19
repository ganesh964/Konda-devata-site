import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs/promises';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
// SQLite database instance – generic parameters match sqlite3's Database and Statement types.
let db;
export async function initDb() {
    // Use DATA_DIR when configured.
    // Local default: ./data
    // Production: /var/data
    const configuredDir = process.env.DATA_DIR || './data';
    const dataDir = path.isAbsolute(configuredDir)
        ? configuredDir
        : path.resolve(process.cwd(), configuredDir);
    await fs.mkdir(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, 'gallery.db');
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    });
    await db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      title TEXT,
      "desc" TEXT,
      year INTEGER,
      type TEXT,
      isUploaded INTEGER DEFAULT 1
    )
  `);
    console.log('SQLite database initialized:', dbPath);
}
export async function getAllImages() {
    if (!db)
        throw new Error('Database not initialized');
    return db.all('SELECT * FROM images ORDER BY id DESC');
}
export async function addImage(data) {
    if (!db)
        throw new Error('Database not initialized');
    const result = await db.run(`INSERT INTO images
      (src, title, "desc", year, type, isUploaded)
     VALUES (?, ?, ?, ?, ?, 1)`, data.src, data.title, data.desc, data.year, data.type);
    const inserted = await db.get('SELECT * FROM images WHERE id = ?', result.lastID);
    if (!inserted) {
        throw new Error('Failed to retrieve inserted image');
    }
    return inserted;
}
export async function deleteImage(id) {
    if (!db)
        throw new Error('Database not initialized');
    await db.run('DELETE FROM images WHERE id = ?', id);
}
//# sourceMappingURL=db.js.map
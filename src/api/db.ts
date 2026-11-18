
// src/api/db.ts

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ImageRecord {
  id: number;
  src: string;
  title: string;
  desc: string;
  year: number;
  type: 'image' | 'video';
  isUploaded: number;
}

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initDb(): Promise<void> {
  const dbPath = path.resolve(__dirname, '../../gallery.db');

  await fs.mkdir(path.dirname(dbPath), { recursive: true });

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      title TEXT,
      "desc" TEXT,
      year INTEGER,
      type TEXT,
      isUploaded INTEGER
    )
  `);

  console.log('SQLite database initialized:', dbPath);
}

export async function getAllImages(): Promise<ImageRecord[]> {
  if (!db) throw new Error('Database not initialized');

  return db.all('SELECT * FROM images ORDER BY id DESC');
}

export async function addImage(data: {
  src: string;
  title: string;
  desc: string;
  year: number;
  type: 'image' | 'video';
}): Promise<ImageRecord> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.run(
    `INSERT INTO images
      (src, title, "desc", year, type, isUploaded)
     VALUES (?, ?, ?, ?, ?, 1)`,
    data.src,
    data.title,
    data.desc,
    data.year,
    data.type
  );

  const inserted = await db.get(
    'SELECT * FROM images WHERE id = ?',
    result.lastID
  );

  if (!inserted) {
    throw new Error('Failed to retrieve inserted image');
  }

  return inserted;
}

export async function deleteImage(id: number): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.run('DELETE FROM images WHERE id = ?', id);
}

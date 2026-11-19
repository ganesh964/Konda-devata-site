// src/api/db.ts

import path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export interface ImageRecord {
  id: number;
  src: string;
  title: string;
  desc: string;
  year: number;
  type: 'image' | 'video';
  isUploaded: number; // SQLite stores booleans as integers
}

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initDb() {
  // Store the DB in the project root, not inside src/api
  const dbPath = path.resolve(__dirname, '../../gallery.db');
  // Ensure the directory exists (project root always exists, but just in case)
  const dir = path.dirname(dbPath);
  try {
    // fs not imported; use node's built‑in fs via dynamic import to avoid extra import in this file
    const { promises: fs } = await import('fs');
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore – directory likely already exists
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
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
    `INSERT INTO images (src, title, "desc", year, type, isUploaded) VALUES (?, ?, ?, ?, ?, 1)`,
    data.src,
    data.title,
    data.desc,
    data.year,
    data.type
  );
  const inserted = await db.get('SELECT * FROM images WHERE id = ?', result.lastID);
  return inserted;
}

export async function deleteImage(id: number): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  await db.run('DELETE FROM images WHERE id = ?', id);
}

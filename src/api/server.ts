
import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import multer, { type FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { initDb, getAllImages, addImage, deleteImage } from './db.js';



const app = express();
const PORT = process.env.PORT || 4000;
const API_BASE = '/api';

app.use(cors());
app.use(express.json());


// Ensure uploads directory exists
const DATA_DIR = process.env.DATA_DIR || './data';

const dataDir = path.isAbsolute(DATA_DIR)
  ? DATA_DIR
  : path.resolve(process.cwd(), DATA_DIR);

const uploadDir = path.join(dataDir, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log('[API] Data directory:', dataDir);
console.log('[API] Upload directory:', uploadDir);

app.use('/uploads', express.static(uploadDir));

// ── File size limits ──────────────────────────────────────────────────────────
const IMAGE_SIZE_LIMIT = 25 * 1024 * 1024;  // 25 MB
const VIDEO_SIZE_LIMIT = 100 * 1024 * 1024; // 100 MB

// ── Accepted MIME types ───────────────────────────────────────────────────────
const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/heic', 'image/heif',
  'image/webp', 'image/gif', 'image/avif'
]);
const ACCEPTED_VIDEO_TYPES = new Set([
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
  'video/webm', 'video/3gpp', 'video/mpeg'
]);

// ── Multer disk storage ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  }
});

// ── File-type filter ──────────────────────────────────────────────────────────
function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (ACCEPTED_IMAGE_TYPES.has(file.mimetype) || ACCEPTED_VIDEO_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: images (JPEG, PNG, HEIC, WEBP) and videos (MP4, MOV, AVI, MKV, WEBM).`));
  }
}

// Use the larger video limit at multer level; enforce image-specific limit below
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: VIDEO_SIZE_LIMIT }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get(`${API_BASE}/gallery`, async (_req: Request, res: Response) => {
  try {
    const images = await getAllImages();
    res.json(images);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch gallery.' });
  }
});

app.post(`${API_BASE}/gallery`, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const isImage = ACCEPTED_IMAGE_TYPES.has(req.file.mimetype);
    const isVideo = ACCEPTED_VIDEO_TYPES.has(req.file.mimetype);
    const fileType: 'image' | 'video' = isVideo ? 'video' : 'image';

    // Enforce per-type size limits (secondary check after multer)
    if (isImage && req.file.size > IMAGE_SIZE_LIMIT) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({ error: 'Image too large. Maximum size is 25 MB.' });
    }
    if (isVideo && req.file.size > VIDEO_SIZE_LIMIT) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({ error: 'Video too large. Maximum size is 100 MB.' });
    }

    const { title = '', desc = '', year = '' } = req.body;
    // Build URL using the actual server port (not the proxied Vite host)
    const publicApiUrl = (
      process.env.PUBLIC_API_URL || `http://localhost:${PORT}`
    ).replace(/\/+$/, '');

    const fileUrl = `${publicApiUrl}/uploads/${req.file.filename}`;

    const newImg = await addImage({
      src: fileUrl,
      title: title as string,
      desc: desc as string,
      year: Number(year),
      type: fileType
    });

    res.status(201).json(newImg);
  } catch (err: any) {
    console.error('[POST /api/gallery] Error:', err);
    res.status(500).json({ error: err?.message || 'Upload failed.' });
  }
});

app.delete(`${API_BASE}/gallery/:id`, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteImage(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Delete failed.' });
  }
});

// ── Global error handler (must be AFTER all routes) ──────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Images max 25 MB, Videos max 100 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err?.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start: wait for DB to be ready BEFORE accepting requests ──────────────────
async function start() {
  try {
    await initDb();  // ← must await, DB must be ready before first request
    app.listen(PORT, () => {
      console.log(`🖼️  Gallery API listening on http://localhost:${PORT}`);
      console.log(`   • Images : up to 25 MB  (JPEG, PNG, HEIC, WEBP, GIF, AVIF)`);
      console.log(`   • Videos : up to 100 MB (MP4, MOV, AVI, MKV, WEBM, 3GP, MPEG)`);
      console.log(`   • Uploads stored in: ${uploadDir}`);
    });
  } catch (err) {
    console.error('Failed to initialise database:', err);
    process.exit(1);
  }
}

start();


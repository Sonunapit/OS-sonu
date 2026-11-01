import multer from 'multer';
import { HttpError } from '../utils/httpError.js';

function sniff(buf) {
  if (buf.slice(0, 4).toString() === '%PDF') return 'pdf';
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'image';
  if (buf.slice(1, 4).toString() === 'PNG') return 'image';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'image';
  return null;
}

const make = (label, maxMb, mimes) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxMb * 1024 * 1024, files: 12 },
    fileFilter: (_req, file, cb) => (mimes.includes(file.mimetype) ? cb(null, true) : cb(new HttpError(415, `Only ${label} files are allowed`))),
  });

export const imageUpload = make('JPEG, PNG or WebP image', 8, ['image/jpeg', 'image/png', 'image/webp']);
export const pdfUpload = make('PDF', 10, ['application/pdf']);

// Checks the real file signature, not just the client supplied mimetype.
export const verifyFiles = (kind) => (req, _res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files.length) return next(new HttpError(400, 'No file received'));
  if (files.some((f) => sniff(f.buffer) !== kind)) return next(new HttpError(415, 'File content does not match its type'));
  next();
};

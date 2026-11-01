import { ZodError } from 'zod';
import { env } from '../config/env.js';

export const notFound = (_req, res) => res.status(404).json({ message: 'Not found' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) return res.status(400).json({ message: 'Invalid input', issues: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`) });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'File is too large' });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 && env.prod ? 'Server error' : err.message });
}

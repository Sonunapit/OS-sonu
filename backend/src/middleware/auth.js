import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export function requireAdmin(req, _res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) throw new HttpError(401, 'Not signed in');
    req.admin = jwt.verify(token, env.jwtSecret);
    next();
  } catch (e) {
    next(e instanceof HttpError ? e : new HttpError(401, 'Session expired. Sign in again.'));
  }
}

// Blocks cross-site form posts: browsers cannot add custom headers without a CORS preflight.
export function requireCsrfHeader(req, _res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('x-requested-with') !== 'sonu-os') return next(new HttpError(403, 'Missing request header'));
  next();
}

export const cookieOptions = () => ({
  httpOnly: true,
  secure: env.prod,
  sameSite: env.prod ? 'none' : 'lax',
  maxAge: 12 * 60 * 60 * 1000,
  path: '/',
});

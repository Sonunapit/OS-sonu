import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { cookieOptions } from '../middleware/auth.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
// Compared when the email is unknown so response time does not reveal valid emails.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO8s0yG2S5k0n3b7p0m3nQz3Xq9v8q8aW';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() });
  const ok = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, 'Email or password is incorrect');
  const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: '12h' });
  res.cookie('token', token, cookieOptions()).json({ email: user.email });
});

export const logout = (_req, res) => res.clearCookie('token', { ...cookieOptions(), maxAge: undefined }).json({ ok: true });
export const me = (req, res) => res.json({ email: req.admin.email });

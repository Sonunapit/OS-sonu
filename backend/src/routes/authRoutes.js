import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me } from '../controllers/authController.js';
import { requireAdmin, requireCsrfHeader } from '../middleware/auth.js';

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts. Try again in 15 minutes.' } });

router.post('/login', loginLimiter, requireCsrfHeader, login);
router.post('/logout', requireCsrfHeader, logout);
router.get('/me', requireAdmin, me);
export default router;

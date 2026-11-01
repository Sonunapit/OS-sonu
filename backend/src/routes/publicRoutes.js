import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getAll, downloadResume, sendContact } from '../controllers/publicController.js';

const router = Router();
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many messages. Try again later.' } });

router.get('/all', getAll);
router.get('/resume/download', downloadResume);
router.post('/contact', contactLimiter, sendContact);
export default router;

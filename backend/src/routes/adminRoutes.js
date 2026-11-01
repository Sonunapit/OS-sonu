import { Router } from 'express';
import { requireAdmin, requireCsrfHeader } from '../middleware/auth.js';
import { imageUpload, pdfUpload, verifyFiles } from '../middleware/upload.js';
import { crud } from '../services/crud.js';
import { Project, Skill, Education, Experience, GalleryImage } from '../models/Collections.js';
import * as a from '../controllers/adminController.js';

const router = Router();
router.use(requireAdmin, requireCsrfHeader);

const one = [imageUpload.single('file'), verifyFiles('image')];
const many = [imageUpload.array('files', 12), verifyFiles('image')];

router.get('/profile', a.getProfile);
router.put('/profile', a.saveProfile);
router.post('/profile/image', ...one, a.uploadProfileImage);

router.get('/settings', a.getSettings);
router.put('/settings', a.saveSettings);
router.post('/settings/wallpaper', ...one, a.uploadWallpaper);

router.post('/gallery/upload', ...many, a.uploadGallery);
router.post('/gallery/:id/replace', ...one, a.replaceGalleryImage);

router.post('/projects/:id/image', ...one, a.uploadProjectImage);
router.delete('/projects/:id/screenshots/:shotId', a.removeProjectScreenshot);

router.get('/resumes', a.listResumes);
router.post('/resumes', pdfUpload.single('file'), verifyFiles('pdf'), a.uploadResume);
router.post('/resumes/:id/publish', a.publishResume);
router.delete('/resumes/:id', a.deleteResume);

router.get('/messages', a.listMessages);
router.delete('/messages/:id', a.deleteMessage);

const resources = { projects: Project, skills: Skill, education: Education, experience: Experience, gallery: GalleryImage };
for (const [path, Model] of Object.entries(resources)) {
  const h = crud(Model);
  router.get(`/${path}`, h.list);
  if (path !== 'gallery') router.post(`/${path}`, h.create);
  router.put(`/${path}/:id`, h.update);
  router.delete(`/${path}/:id`, h.remove);
}
export default router;

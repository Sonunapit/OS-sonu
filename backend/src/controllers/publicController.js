import { z } from 'zod';
import { Profile, Setting, Resume, Message } from '../models/Singletons.js';
import { Project, Skill, Education, Experience, GalleryImage } from '../models/Collections.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

const sorted = { order: 1, createdAt: -1 };

// Only published content leaves the server.
export const getAll = asyncHandler(async (_req, res) => {
  const [profile, settings, resume, projects, skills, education, experience, gallery] = await Promise.all([
    Profile.findOne().lean(),
    Setting.findOne().lean(),
    Resume.findOne({ active: true }).select('title url updatedAt').lean(),
    Project.find({ published: true }).sort(sorted).lean(),
    Skill.find({ published: true }).sort(sorted).lean(),
    Education.find({ published: true }).sort(sorted).lean(),
    Experience.find({ published: true }).sort(sorted).lean(),
    GalleryImage.find({ published: true }).sort(sorted).lean(),
  ]);
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ profile, settings, resume, projects, skills, education, experience, gallery });
});

export const downloadResume = asyncHandler(async (_req, res) => {
  const resume = await Resume.findOne({ active: true });
  if (!resume) throw new HttpError(404, 'No resume has been published yet');
  res.redirect(302, resume.url);
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(5).max(2000),
});

export const sendContact = asyncHandler(async (req, res) => {
  await Message.create(contactSchema.parse(req.body));
  res.status(201).json({ ok: true });
});

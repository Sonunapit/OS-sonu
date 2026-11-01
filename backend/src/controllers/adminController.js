import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Profile, Setting, Resume, Message } from '../models/Singletons.js';
import { GalleryImage, Project } from '../models/Collections.js';
import { uploadImage, removeImage, uploadPdf, removePdf } from '../services/storage.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

const urlOrEmpty = z.string().url().or(z.literal(''));
const profileSchema = z.object({
  name: z.string().max(120), headline: z.string().max(200), intro: z.string().max(600),
  bio: z.string().max(5000), goals: z.string().max(2000),
  interests: z.array(z.string().max(60)).max(40),
  socials: z.array(z.object({ label: z.string().max(40), url: urlOrEmpty })).max(12),
}).partial();

const settingsSchema = z.object({
  defaultMode: z.enum(['dark', 'light']), siteTitle: z.string().max(80), publicEmail: z.string().email().or(z.literal('')),
}).partial();

export const getProfile = asyncHandler(async (_req, res) => res.json((await Profile.findOne()) || {}));
export const saveProfile = asyncHandler(async (req, res) => {
  const data = profileSchema.parse(req.body);
  res.json(await Profile.findOneAndUpdate({}, data, { new: true, upsert: true, setDefaultsOnInsert: true }));
});
export const uploadProfileImage = asyncHandler(async (req, res) => {
  const current = await Profile.findOne();
  const img = await uploadImage(req.file.buffer, 'sonu-os/profile');
  if (current?.imagePublicId) await removeImage(current.imagePublicId);
  res.json(await Profile.findOneAndUpdate({}, { image: img.url, imagePublicId: img.publicId }, { new: true, upsert: true }));
});

export const getSettings = asyncHandler(async (_req, res) => res.json((await Setting.findOne()) || {}));
export const saveSettings = asyncHandler(async (req, res) => {
  res.json(await Setting.findOneAndUpdate({}, settingsSchema.parse(req.body), { new: true, upsert: true, setDefaultsOnInsert: true }));
});
export const uploadWallpaper = asyncHandler(async (req, res) => {
  const current = await Setting.findOne();
  const img = await uploadImage(req.file.buffer, 'sonu-os/wallpaper');
  if (current?.wallpaperPublicId) await removeImage(current.wallpaperPublicId);
  res.json(await Setting.findOneAndUpdate({}, { wallpaperUrl: img.url, wallpaperPublicId: img.publicId }, { new: true, upsert: true }));
});

// Gallery: several images in one request.
export const uploadGallery = asyncHandler(async (req, res) => {
  const category = z.string().trim().max(40).default('General').parse(req.body.category || undefined);
  const created = [];
  for (const f of req.files) {
    const img = await uploadImage(f.buffer, 'sonu-os/gallery');
    created.push(await GalleryImage.create({ url: img.url, publicId: img.publicId, category }));
  }
  res.status(201).json(created);
});
export const replaceGalleryImage = asyncHandler(async (req, res) => {
  const doc = await GalleryImage.findById(req.params.id);
  if (!doc) throw new HttpError(404, 'Image not found');
  const img = await uploadImage(req.file.buffer, 'sonu-os/gallery');
  await removeImage(doc.publicId);
  doc.url = img.url; doc.publicId = img.publicId;
  res.json(await doc.save());
});

// Project images (cover or screenshot).
export const uploadProjectImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new HttpError(404, 'Project not found');
  const img = await uploadImage(req.file.buffer, 'sonu-os/projects');
  if (req.query.kind === 'cover') {
    await removeImage(project.coverPublicId);
    project.cover = img.url; project.coverPublicId = img.publicId;
  } else project.screenshots.push(img);
  res.json(await project.save());
});
export const removeProjectScreenshot = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new HttpError(404, 'Project not found');
  const shot = project.screenshots.id(req.params.shotId);
  if (shot) { await removeImage(shot.publicId); shot.deleteOne(); }
  res.json(await project.save());
});

// Resume: upload stores the file; publish makes one version the public one.
export const listResumes = asyncHandler(async (_req, res) => res.json(await Resume.find().sort({ createdAt: -1 })));
export const uploadResume = asyncHandler(async (req, res) => {
  const file = await uploadPdf(req.file.buffer, req.file.originalname);
  const publish = req.body.publish !== 'false';
  if (publish) await Resume.updateMany({}, { active: false });
  res.status(201).json(await Resume.create({ title: req.file.originalname, url: file.url, path: file.path, active: publish }));
});
export const publishResume = asyncHandler(async (req, res) => {
  const doc = await Resume.findById(req.params.id);
  if (!doc) throw new HttpError(404, 'Resume not found');
  await Resume.updateMany({}, { active: false });
  doc.active = true;
  res.json(await doc.save());
});
export const deleteResume = asyncHandler(async (req, res) => {
  const doc = await Resume.findByIdAndDelete(req.params.id);
  if (doc) await removePdf(doc.path);
  res.json({ ok: true });
});

export const listMessages = asyncHandler(async (_req, res) => res.json(await Message.find().sort({ createdAt: -1 }).limit(200)));
export const deleteMessage = asyncHandler(async (req, res) => { await Message.findByIdAndDelete(req.params.id); res.json({ ok: true }); });

export const hashPassword = (pw) => bcrypt.hash(pw, 12);

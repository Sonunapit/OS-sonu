import mongoose from 'mongoose';
const { Schema } = mongoose;
const opt = { timestamps: true };

export const Project = mongoose.model('Project', new Schema({
  name: { type: String, required: true }, description: String,
  features: [String], techStack: [String], architecture: String,
  githubUrl: String, liveUrl: String,
  status: { type: String, enum: ['Planned', 'In progress', 'Completed', 'Maintained'], default: 'In progress' },
  cover: String, coverPublicId: String,
  screenshots: [{ url: String, publicId: String }],
  published: { type: Boolean, default: false }, order: { type: Number, default: 0 },
}, opt));

export const Skill = mongoose.model('Skill', new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Programming languages', 'Frontend', 'Backend', 'Databases', 'DevOps', 'Cloud', 'AI and GenAI', 'Tools', 'Computer science'] },
  published: { type: Boolean, default: true }, order: { type: Number, default: 0 },
}, opt));

export const Education = mongoose.model('Education', new Schema({
  institution: { type: String, required: true }, degree: String, field: String,
  start: String, end: String, coursework: [String], description: String,
  published: { type: Boolean, default: true }, order: { type: Number, default: 0 },
}, opt));

export const Experience = mongoose.model('Experience', new Schema({
  company: { type: String, required: true }, role: String,
  type: { type: String, enum: ['Full-time', 'Internship', 'Freelance', 'Open source'], default: 'Internship' },
  start: String, end: String, description: String, highlights: [String],
  published: { type: Boolean, default: true }, order: { type: Number, default: 0 },
}, opt));

export const GalleryImage = mongoose.model('GalleryImage', new Schema({
  url: { type: String, required: true }, publicId: String,
  category: { type: String, default: 'General' }, caption: String,
  published: { type: Boolean, default: true }, order: { type: Number, default: 0 },
}, opt));

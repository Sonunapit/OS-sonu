import mongoose from 'mongoose';
const { Schema } = mongoose;

export const Profile = mongoose.model('Profile', new Schema({
  name: String, headline: String, intro: String, bio: String, goals: String,
  interests: [String], image: String, imagePublicId: String,
  socials: [{ label: String, url: String }],
}, { timestamps: true }));

export const Setting = mongoose.model('Setting', new Schema({
  defaultMode: { type: String, enum: ['dark', 'light'], default: 'dark' },
  wallpaperUrl: String, wallpaperPublicId: String,
  siteTitle: { type: String, default: 'SONU OS' },
  publicEmail: String,
}, { timestamps: true }));

export const Resume = mongoose.model('Resume', new Schema({
  title: String, url: { type: String, required: true }, path: String, active: { type: Boolean, default: false },
}, { timestamps: true }));

export const Message = mongoose.model('Message', new Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 120 },
  message: { type: String, required: true, maxlength: 2000 },
  read: { type: Boolean, default: false },
}, { timestamps: true }));

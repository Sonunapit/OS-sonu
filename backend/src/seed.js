// Creates the admin user and starter content. Safe to run more than once.
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import User from './models/User.js';
import { Profile, Setting } from './models/Singletons.js';
import { Project, Skill } from './models/Collections.js';
import { hashPassword } from './controllers/adminController.js';
import mongoose from 'mongoose';

await connectDB();

if (!env.adminEmail || !env.adminPassword || env.adminPassword.length < 12) {
  console.error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in .env first.');
  process.exit(1);
}
await User.findOneAndUpdate({ email: env.adminEmail.toLowerCase() }, { passwordHash: await hashPassword(env.adminPassword) }, { upsert: true });

if (!(await Profile.countDocuments())) {
  await Profile.create({
    name: 'Sonu Kumar Napit',
    headline: 'Full Stack Developer',
    intro: 'Full stack and backend developer building with JavaScript, Node.js and microservices.',
    bio: 'Edit this biography from the admin dashboard.',
    interests: ['React.js', 'Node.js', 'Express.js', 'JavaScript', 'Microservices', 'REST APIs', 'MongoDB', 'PostgreSQL', 'Linux', 'Docker', 'DevOps', 'Cloud Computing', 'System Design', 'Data Structures and Algorithms', 'Generative AI'],
    socials: [
      { label: 'GitHub', url: 'https://github.com/sonunapit' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sonu-kumar-napit-988a152a1/' },
      { label: 'LeetCode', url: 'https://leetcode.com/u/Sonu_Kumar_napit/' },
      { label: 'HackerRank', url: 'https://www.hackerrank.com/profile/sonu714169' },
    ],
  });
}
if (!(await Setting.countDocuments())) await Setting.create({});
if (!(await Project.countDocuments())) {
  await Project.insertMany(['Online Marketplace Microservices', 'CivicVoice', 'TravelBharat'].map((name, order) => ({ name, order, published: true, description: 'Add the description, features and links from the admin dashboard.' })));
}
if (!(await Skill.countDocuments())) {
  const map = { Frontend: ['React.js', 'JavaScript (ES6+)'], Backend: ['Node.js', 'Express.js', 'REST APIs', 'Microservices'], Databases: ['MongoDB', 'PostgreSQL'], DevOps: ['Linux', 'Docker'], Cloud: ['Cloud Computing'], 'AI and GenAI': ['Generative AI'], 'Computer science': ['System Design', 'Data Structures and Algorithms'] };
  await Skill.insertMany(Object.entries(map).flatMap(([category, names]) => names.map((name, order) => ({ name, category, order }))));
}
console.log('Seed complete');
await mongoose.disconnect();

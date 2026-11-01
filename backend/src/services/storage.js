import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

const cloudReady = Object.values(env.cloudinary).every(Boolean);
const supaReady = Boolean(env.supabase.url && env.supabase.key);
if (cloudReady) cloudinary.config({ ...env.cloudinary, secure: true });
const supabase = supaReady ? createClient(env.supabase.url, env.supabase.key, { auth: { persistSession: false } }) : null;

export function uploadImage(buffer, folder = 'sonu-os') {
  if (!cloudReady) throw new HttpError(503, 'Cloudinary is not configured. Set CLOUDINARY_* variables.');
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (err, r) =>
        err ? reject(err) : resolve({ url: r.secure_url, publicId: r.public_id })
      )
      .end(buffer);
  });
}

export async function removeImage(publicId) {
  if (!cloudReady || !publicId) return;
  await cloudinary.uploader.destroy(publicId).catch(() => {});
}

export async function uploadPdf(buffer, name) {
  if (!supabase) throw new HttpError(503, 'Supabase Storage is not configured. Set SUPABASE_* variables.');
  const path = `resumes/${Date.now()}-${name.replace(/[^a-z0-9._-]/gi, '_')}`;
  const { error } = await supabase.storage.from(env.supabase.bucket).upload(path, buffer, { contentType: 'application/pdf', upsert: false });
  if (error) throw new HttpError(502, `Storage upload failed: ${error.message}`);
  const { data } = supabase.storage.from(env.supabase.bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function removePdf(path) {
  if (!supabase || !path) return;
  await supabase.storage.from(env.supabase.bucket).remove([path]).catch(() => {});
}

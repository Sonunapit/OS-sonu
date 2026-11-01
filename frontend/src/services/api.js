const BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, { method = 'GET', body, form } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: { 'X-Requested-With': 'sonu-os', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(json?.issues?.join(', ') || json?.message || res.statusText), { status: res.status });
  return json;
}

const fd = (file, extra = {}) => {
  const f = new FormData();
  (Array.isArray(file) ? file : [file]).forEach((x) => f.append(Array.isArray(file) ? 'files' : 'file', x));
  Object.entries(extra).forEach(([k, v]) => f.append(k, v));
  return f;
};

export const api = {
  publicAll: () => req('/public/all'),
  contact: (body) => req('/public/contact', { method: 'POST', body }),
  resumeDownloadUrl: `${BASE}/public/resume/download`,
  login: (body) => req('/auth/login', { method: 'POST', body }),
  logout: () => req('/auth/logout', { method: 'POST' }),
  me: () => req('/auth/me'),
  list: (r) => req(`/admin/${r}`),
  create: (r, body) => req(`/admin/${r}`, { method: 'POST', body }),
  update: (r, id, body) => req(`/admin/${r}/${id}`, { method: 'PUT', body }),
  remove: (r, id) => req(`/admin/${r}/${id}`, { method: 'DELETE' }),
  saveSingleton: (r, body) => req(`/admin/${r}`, { method: 'PUT', body }),
  uploadProfileImage: (file) => req('/admin/profile/image', { method: 'POST', form: fd(file) }),
  uploadWallpaper: (file) => req('/admin/settings/wallpaper', { method: 'POST', form: fd(file) }),
  uploadGallery: (files, category) => req('/admin/gallery/upload', { method: 'POST', form: fd(files, { category }) }),
  replaceGallery: (id, file) => req(`/admin/gallery/${id}/replace`, { method: 'POST', form: fd(file) }),
  uploadProjectImage: (id, file, kind) => req(`/admin/projects/${id}/image?kind=${kind}`, { method: 'POST', form: fd(file) }),
  removeScreenshot: (id, shotId) => req(`/admin/projects/${id}/screenshots/${shotId}`, { method: 'DELETE' }),
  uploadResume: (file) => req('/admin/resumes', { method: 'POST', form: fd(file) }),
  publishResume: (id) => req(`/admin/resumes/${id}/publish`, { method: 'POST' }),
};

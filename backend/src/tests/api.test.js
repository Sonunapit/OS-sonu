import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('API security', () => {
  it('health check works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
  it('rejects admin routes without a session', async () => {
    for (const path of ['/api/admin/profile', '/api/admin/projects', '/api/admin/resumes']) {
      expect((await request(app).get(path)).status).toBe(401);
    }
  });
  it('rejects admin writes without a session', async () => {
    const res = await request(app).post('/api/admin/projects').set('x-requested-with', 'sonu-os').send({ name: 'x' });
    expect(res.status).toBe(401);
  });
  it('rejects login without the request header', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.co', password: 'password123' });
    expect(res.status).toBe(403);
  });
  it('returns 404 for unknown routes', async () => {
    expect((await request(app).get('/api/nope')).status).toBe(404);
  });
});

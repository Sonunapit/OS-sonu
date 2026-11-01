import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

if (!env.jwtSecret || env.jwtSecret.length < 32) {
  console.error('JWT_SECRET must be set and at least 32 characters. See .env.example');
  process.exit(1);
}
await connectDB();
app.listen(env.port, () => console.log(`API listening on :${env.port}`));

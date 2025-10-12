import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually read JSON
const serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');
const serviceAccountJson = await fs.readFile(serviceAccountPath, 'utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

#!/usr/bin/env node
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const MONGO = process.env.MONGO_URI || process.env.MONGO_URL;
if (!MONGO) {
  console.error('MONGO_URI is not set. Set it and re-run.');
  process.exit(1);
}

const backupPath = path.resolve(process.cwd(), 'migrate-backup-users.json');

const run = async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo');

  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

  const users = await User.find({}).lean();
  console.log(`Found ${users.length} users`);

  // Backup existing users
  fs.writeFileSync(backupPath, JSON.stringify(users, null, 2));
  console.log(`Backed up users to ${backupPath}`);

  const plain = 'password';
  const saltRounds = 10;
  const hash = await bcrypt.hash(plain, saltRounds);

  let updated = 0;
  for (const u of users) {
    // Only update if user has no password field or if you want to overwrite uncomment
    if (!u.password) {
      await User.updateOne({ _id: u._id }, { $set: { password: hash } });
      updated++;
    }
  }

  console.log(`Updated ${updated} users with a hashed password (bcrypt of 'password')`);
  await mongoose.disconnect();
  console.log('Done');
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(2);
});

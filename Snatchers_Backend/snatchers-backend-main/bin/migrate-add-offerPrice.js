#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const APPLY = process.argv.includes('--apply') || process.env.APPLY_MIGRATION === 'true';
const uri = process.env.MONGO_URI;

function exitWith(code = 0) {
  try {
    mongoose.disconnect && mongoose.disconnect();
  } catch (e) {}
  process.exit(code);
}

if (!uri) {
  console.error('MONGO_URI is not set. Set MONGO_URI in env before running this script.');
  exitWith(2);
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  const query = { offerPrice: { $exists: false } };
  const count = await Product.countDocuments(query);
  console.log(`Products missing offerPrice: ${count}`);

  if (count === 0) {
    console.log('No migration required.');
    return exitWith(0);
  }

  if (!APPLY) {
    console.log('Dry run (no changes). Rerun with `--apply` or set APPLY_MIGRATION=true to apply updates.');
    return exitWith(0);
  }

  console.log('Applying migration: setting offerPrice=null for matching products...');
  const res = await Product.updateMany(query, { $set: { offerPrice: null } });
  // updateMany result shape depends on mongoose version; handle both
  const modified = (res.modifiedCount ?? res.nModified ?? res.modified) || 0;
  const matched = (res.matchedCount ?? res.n ?? res.matched) || modified;
  console.log(`Migration complete. Matched: ${matched}, Modified: ${modified}`);
  return exitWith(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  exitWith(1);
});

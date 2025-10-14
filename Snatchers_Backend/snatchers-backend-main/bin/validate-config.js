#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

function parseList(v) {
  return (v || '').split(',').map(s => s.trim()).filter(Boolean);
}

const required = [
  'COGNITO_CLIENT_ID',
  'COGNITO_USER_POOL_ID',
  'COGNITO_REGION',
  'COGNITO_REDIRECT_URI',
  'FRONTEND_URL'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('Missing required environment variables:\n  ' + missing.join('\n  '));
  process.exit(2);
}

const frontend = process.env.FRONTEND_URL;
const cognitoRedirects = parseList(process.env.COGNITO_REDIRECT_URI);
if (!cognitoRedirects.includes(frontend)) {
  console.error(`FRONTEND_URL (${frontend}) is not present in COGNITO_REDIRECT_URI list: ${JSON.stringify(cognitoRedirects)}`);
  console.error('Update your environment or add the frontend URL to the Cognito App Client redirect URIs.');
  process.exit(3);
}

console.log('OK: config validated');
process.exit(0);

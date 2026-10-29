import { randomBytes, scryptSync } from 'node:crypto';

const password = process.env.ADMIN_PASSWORD;
if (!password) {
  console.error('Set ADMIN_PASSWORD for this command; it is never written to disk.');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`);

#!/usr/bin/env node
/**
 * Generate RSA key pair + self-signed cert for Salesforce JWT.
 * Run: node scripts/salesforce-jwt/generate-keypair.js
 * Output: scripts/salesforce-jwt/server.key, scripts/salesforce-jwt/server.crt
 * Upload server.crt to your External Client App (JWT / certificate). Use server.key as SF_JWT_PRIVATE_KEY.
 */

const fs = require('fs');
const path = require('path');

let selfsigned;
try {
  selfsigned = require('selfsigned');
} catch {
  console.error('Run: npm install selfsigned --save-dev');
  process.exit(1);
}

const outDir = path.join(__dirname);
const attrs = [{ name: 'commonName', value: 'support-portal' }];
const notAfter = new Date();
notAfter.setFullYear(notAfter.getFullYear() + 10);
const opts = { keySize: 2048, notAfterDate: notAfter, algorithm: 'sha256' };

(async () => {
  const pems = await selfsigned.generate(attrs, opts);
  const keyPath = path.join(outDir, 'server.key');
  const certPath = path.join(outDir, 'server.crt');
  fs.writeFileSync(keyPath, pems.private, 'utf8');
  fs.writeFileSync(certPath, pems.cert, 'utf8');

  console.log('Created:', keyPath);
  console.log('Created:', certPath);
  console.log('');
  console.log('Next: In Salesforce External Client App → OAuth Settings → enable "Enable JWT Bearer Flow" and upload server.crt. Set SF_JWT_PRIVATE_KEY to the contents of server.key (and SF_USERNAME, SF_CLIENT_ID).');
})();

const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) fs.mkdirSync(sslDir);

console.log('Generating self-signed SSL cert...');
const pems = selfsigned.generate(
  [{ name: 'commonName', value: 'localhost' }],
  {
    days: 365,
    keySize: 2048,
  }
);

fs.writeFileSync(path.join(sslDir, 'key.pem'), pems.private);
fs.writeFileSync(path.join(sslDir, 'cert.pem'), pems.cert);
console.log('Done! ssl/key.pem and ssl/cert.pem created.');

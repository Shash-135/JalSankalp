const jwt = require('jsonwebtoken');

const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const secretMatch = envFile.match(/JWT_SECRET=(.+)/);
const secret = secretMatch ? secretMatch[1].trim() : 'your_jwt_secret';

const token = jwt.sign({ user: { id: 1, role: 'operator' } }, secret, { expiresIn: '1h' });

async function run() {
  try {
    const res = await fetch('http://localhost:5000/api/pump/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        logs: [
          { pump_id: 1, action: 'start', timestamp: new Date().toISOString(), notes: '' }
        ]
      })
    });
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', text);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
run();

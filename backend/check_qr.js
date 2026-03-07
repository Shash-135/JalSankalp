const pool = require('./database/db');

async function check() {
  const [pumps] = await pool.query('SELECT id, name, qr_code FROM Pump');
  console.log('\n=== Pumps in Database ===');
  pumps.forEach(p => console.log(`ID: ${p.id}  |  Name: ${p.name}  |  QR Code: "${p.qr_code}"`));
  process.exit();
}
check();

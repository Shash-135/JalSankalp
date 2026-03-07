const QRCode = require('qrcode');
const pool = require('./database/db');
const path = require('path');
const fs = require('fs');

async function generate() {
  const [pumps] = await pool.query('SELECT id, name, qr_code FROM Pump');
  
  const outDir = path.join(__dirname, 'qr_codes');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  for (const pump of pumps) {
    const file = path.join(outDir, `pump_${pump.id}_${pump.name.replace(/\s+/g,'_')}.png`);
    await QRCode.toFile(file, pump.qr_code, { width: 400 });
    console.log(`Generated: pump_${pump.id} - "${pump.name}"  QR: ${pump.qr_code}`);
  }

  console.log(`\nAll QR codes saved to: ${outDir}`);
  process.exit();
}

generate();

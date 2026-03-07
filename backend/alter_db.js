require('dotenv').config();
const pool = require('./database/db');

async function alterDB() {
  try {
    console.log('Altering PumpLog table...');
    await pool.query("ALTER TABLE PumpLog MODIFY COLUMN action ENUM('start', 'stop', 'report') NOT NULL");
    await pool.query("ALTER TABLE PumpLog ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255) NULL AFTER notes");
    console.log('Successfully altered PumpLog table.');
    process.exit(0);
  } catch (err) {
    console.error('Error altering DB:', err);
    process.exit(1);
  }
}

alterDB();

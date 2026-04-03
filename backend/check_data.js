require('dotenv').config();
const pool = require('./database/db');

(async () => {
    const [p] = await pool.query('SELECT id, flow_rate_lpm FROM Pump');
    p.forEach(r => console.log('Pump', r.id, 'flow:', r.flow_rate_lpm));

    const [l] = await pool.query("SELECT id, pump_id, action, duration, water_pumped_l FROM PumpLog WHERE action='stop' ORDER BY id DESC LIMIT 5");
    l.forEach(r => console.log('Log', r.id, 'pump:', r.pump_id, 'dur:', r.duration, 'water:', r.water_pumped_l));

    const [a] = await pool.query('SELECT id, name, capacity_kl FROM Area');
    a.forEach(r => console.log('Area', r.id, r.name, 'cap:', r.capacity_kl));

    process.exit(0);
})();

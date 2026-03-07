const pool = require('./database/db');

async function fixLogs() {
  try {
    console.log('Inserting dummy pump logs with durations...');
    
    // Pump IDs: 1 to 7, Operator IDs: 1 to 4
    const queries = [];
    for (let i = 0; i < 30; i++) {
        const pump_id = Math.floor(Math.random() * 4) + 1; // 1 to 4
        const operator_id = Math.floor(Math.random() * 3) + 1; // 1 to 3
        const duration = Math.floor(Math.random() * 120) + 15; // 15 to 135 mins
        
        queries.push(pool.query(
            "INSERT INTO PumpLog (pump_id, operator_id, action, duration, notes) VALUES (?, ?, 'stop', ?, ?)",
            [pump_id, operator_id, duration, 'Routine stop with duration']
        ));
    }

    await Promise.all(queries);
    console.log('Logs inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixLogs();

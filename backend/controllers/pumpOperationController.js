const pool = require('../database/db');

const getPumpByQR = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                p.*, 
                a.name as location,
                o.name as operator_name,
                (SELECT timestamp FROM PumpLog WHERE pump_id = p.id ORDER BY timestamp DESC LIMIT 1) as last_operation_time
            FROM Pump p 
            LEFT JOIN Area a ON p.area_id = a.id 
            LEFT JOIN Operator o ON p.area_id = o.assigned_area_id
            WHERE p.qr_code = ?
            LIMIT 1
        `;
        const [rows] = await pool.query(query, [req.params.qr_code]);
        if (rows.length === 0) return res.status(404).json({ message: 'Pump not found for this QR' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const startPump = async (req, res, next) => {
    try {
        const { pump_id, notes } = req.body;
        const operator_id = req.user.id;
        
        
        await pool.query(
            'INSERT INTO PumpLog (pump_id, operator_id, action, notes) VALUES (?, ?, "start", ?)', 
            [pump_id, operator_id, notes]
        );
        res.status(201).json({ message: 'Pump started successfully' });
    } catch (err) {
        next(err);
    }
};

const stopPump = async (req, res, next) => {
    try {
        const { pump_id, notes } = req.body;
        const operator_id = req.user.id;
        
        // Fetch the pump and its area to get flow rate and capacity
        const [pumpData] = await pool.query(`
            SELECT p.id, p.area_id, p.flow_rate_lpm, a.capacity_kl 
            FROM Pump p
            JOIN Area a ON p.area_id = a.id
            WHERE p.id = ?`, 
            [pump_id]
        );
        
        if (pumpData.length === 0) return res.status(404).json({ message: 'Pump not found' });
        const pump = pumpData[0];
        
        const [lastLog] = await pool.query(
            'SELECT * FROM PumpLog WHERE pump_id = ? AND action = "start" ORDER BY timestamp DESC LIMIT 1',
            [pump_id]
        );

        let duration = 0;
        if (lastLog.length > 0) {
            const startTime = new Date(lastLog[0].timestamp).getTime();
            const stopTime = new Date().getTime();
            duration = Math.floor((stopTime - startTime) / 60000); 
        }

        const flow_rate = parseFloat(pump.flow_rate_lpm) || 0;
        const water_pumped_l = duration * flow_rate;

        await pool.query(
            'INSERT INTO PumpLog (pump_id, operator_id, action, duration, water_pumped_l, notes) VALUES (?, ?, "stop", ?, ?, ?)', 
            [pump_id, operator_id, duration, water_pumped_l, notes]
        );

        // Check if area is exceeding capacity
        let capacityWarning = false;
        if (pump.capacity_kl > 0) {
            const [dailyUsage] = await pool.query(`
                SELECT SUM(water_pumped_l) as total_l
                FROM PumpLog pl
                JOIN Pump p ON pl.pump_id = p.id
                WHERE p.area_id = ? AND DATE(pl.timestamp) = CURDATE()
            `, [pump.area_id]);
            
            const totalPumpedKl = (dailyUsage[0].total_l || 0) / 1000;
            if (totalPumpedKl >= (pump.capacity_kl * 0.8)) {
                capacityWarning = true;
            }
        }

        res.status(201).json({ 
            message: 'Pump stopped successfully', 
            duration,
            water_pumped_l,
            capacityWarning 
        });
    } catch (err) {
        next(err);
    }
};

const syncLogs = async (req, res, next) => {
    
    try {
        const { logs } = req.body;
        const operator_id = req.user.id;
        if (!logs || !logs.length) return res.status(400).json({ message: 'No logs to sync' });

        for (const log of logs) {
            let water_pumped_l = 0;
            if (log.action === 'stop' && log.duration) {
                const [pumpData] = await pool.query('SELECT flow_rate_lpm FROM Pump WHERE id = ?', [log.pump_id]);
                if (pumpData.length > 0) {
                    water_pumped_l = (parseFloat(pumpData[0].flow_rate_lpm) || 0) * log.duration;
                }
            }

            await pool.query(
                'INSERT INTO PumpLog (pump_id, operator_id, action, timestamp, duration, water_pumped_l, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [log.pump_id, operator_id, log.action, log.timestamp ? new Date(log.timestamp) : new Date(), log.duration || 0, water_pumped_l, log.notes]
            );
        }
        res.json({ message: 'Logs synced successfully' });
    } catch (err) {
        next(err);
    }
};

const getPumpLogs = async (req, res, next) => {
    try {
        const operator_id = req.user.id;
        const [rows] = await pool.query(`
            SELECT pl.*, p.name as pump_name 
            FROM PumpLog pl 
            JOIN Pump p ON pl.pump_id = p.id
            WHERE pl.operator_id = ? 
            ORDER BY pl.timestamp DESC
        `, [operator_id]);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const reportMaintenance = async (req, res, next) => {
    try {
        const { pump_id, comment } = req.body;
        const operator_id = req.user.id;
        let photo_url = null;

        if (req.file) {
            photo_url = `/uploads/${req.file.filename}`;
        }

        await pool.query(
            'INSERT INTO PumpLog (pump_id, operator_id, action, notes, photo_url) VALUES (?, ?, "report", ?, ?)',
            [pump_id, operator_id, comment, photo_url]
        );

        res.status(201).json({ message: 'Maintenance report submitted successfully', photo_url });
    } catch (err) {
        next(err);
    }
};

const getPumpStatus = async (req, res, next) => {
    try {
        const { pump_id } = req.params;

        const [lastLog] = await pool.query(
            'SELECT action, timestamp FROM PumpLog WHERE pump_id = ? ORDER BY timestamp DESC LIMIT 1',
            [pump_id]
        );

        const [pumpData] = await pool.query(`
            SELECT p.flow_rate_lpm, p.motor_power_hp, a.capacity_kl, p.area_id
            FROM Pump p
            JOIN Area a ON p.area_id = a.id
            WHERE p.id = ?`, [pump_id]);

        let todayPumpedL = 0;
        if (pumpData.length > 0) {
            const [daily] = await pool.query(`
                SELECT COALESCE(SUM(water_pumped_l), 0) as total_l
                FROM PumpLog pl
                JOIN Pump p ON pl.pump_id = p.id
                WHERE p.area_id = ? AND DATE(pl.timestamp) = CURDATE()
            `, [pumpData[0].area_id]);
            todayPumpedL = parseFloat(daily[0].total_l) || 0;
        }

        const isRunning = lastLog.length > 0 && lastLog[0].action === 'start';

        res.json({
            isRunning,
            startedAt: isRunning ? lastLog[0].timestamp : null,
            flow_rate_lpm: pumpData.length > 0 ? parseFloat(pumpData[0].flow_rate_lpm) || 0 : 0,
            capacity_kl: pumpData.length > 0 ? parseFloat(pumpData[0].capacity_kl) || 0 : 0,
            today_pumped_l: todayPumpedL,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getPumpByQR, startPump, stopPump, syncLogs, getPumpLogs, reportMaintenance, getPumpStatus };


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
        
        // Log action start
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
        
        // Find last start action
        const [lastLog] = await pool.query(
            'SELECT * FROM PumpLog WHERE pump_id = ? AND action = "start" ORDER BY timestamp DESC LIMIT 1',
            [pump_id]
        );

        let duration = 0;
        if (lastLog.length > 0) {
            const startTime = new Date(lastLog[0].timestamp).getTime();
            const stopTime = new Date().getTime();
            duration = Math.floor((stopTime - startTime) / 60000); // minutes
        }

        // Log action stop
        await pool.query(
            'INSERT INTO PumpLog (pump_id, operator_id, action, duration, notes) VALUES (?, ?, "stop", ?, ?)', 
            [pump_id, operator_id, duration, notes]
        );

        res.status(201).json({ message: 'Pump stopped successfully', duration });
    } catch (err) {
        next(err);
    }
};

const syncLogs = async (req, res, next) => {
    // Basic array sync: [{pump_id, action, timestamp, duration, notes}]
    try {
        const { logs } = req.body;
        const operator_id = req.user.id;
        if (!logs || !logs.length) return res.status(400).json({ message: 'No logs to sync' });

        for (const log of logs) {
            await pool.query(
                'INSERT INTO PumpLog (pump_id, operator_id, action, timestamp, duration, notes) VALUES (?, ?, ?, ?, ?, ?)',
                [log.pump_id, operator_id, log.action, log.timestamp ? new Date(log.timestamp) : new Date(), log.duration || 0, log.notes]
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

module.exports = { getPumpByQR, startPump, stopPump, syncLogs, getPumpLogs, reportMaintenance };

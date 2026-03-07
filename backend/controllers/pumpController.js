const pool = require('../database/db');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const getAllPumps = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, a.name as location 
            FROM Pump p 
            LEFT JOIN Area a ON p.area_id = a.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getPumpById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Pump WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Pump not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getPumpByQR = async (req, res) => {
    try {
        const { qr } = req.params;
        const decodedQR = decodeURIComponent(qr).trim();
        
        console.log(`\n[QR SCAN] Raw param: "${qr}"`);
        console.log(`[QR SCAN] Decoded+Trimmed: "${decodedQR}"`);

        // Also print all QR codes in DB to compare
        const [all] = await pool.query('SELECT id, qr_code FROM Pump');
        console.log('[QR SCAN] All QR codes in DB:', all.map(p => `"${p.qr_code}"`).join(', '));

        const [rows] = await pool.query(
            'SELECT p.*, a.name as location FROM Pump p LEFT JOIN Area a ON p.area_id = a.id WHERE TRIM(p.qr_code) = ?',
            [decodedQR]
        );
        if (rows.length === 0) {
            console.log(`[QR SCAN] No match found for: "${decodedQR}"`);
            return res.status(404).json({ message: 'Pump not found for this QR code' });
        }
        console.log(`[QR SCAN] Match found! Pump ID: ${rows[0].id}`);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getPumpLogs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM PumpLog WHERE pump_id = ? ORDER BY timestamp DESC LIMIT 20',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const createPump = async (req, res) => {
    try {
        const { area_id, name, installation_date } = req.body;
        const qrContent = `QR_PUMP_${uuidv4()}`;

        // Just checking if Area exists
        const [areas] = await pool.query('SELECT id FROM Area WHERE id = ?', [area_id]);
        if (areas.length === 0) return res.status(400).json({ message: 'Invalid Area ID' });

        const [result] = await pool.query(
            'INSERT INTO Pump (area_id, qr_code, name, installation_date) VALUES (?, ?, ?, ?)',
            [area_id, qrContent, name, installation_date]
        );

        res.status(201).json({ id: result.insertId, qr_code: qrContent, message: 'Pump created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const updatePump = async (req, res) => {
    try {
        const { status, name } = req.body;
        await pool.query('UPDATE Pump SET status = COALESCE(?, status), name = COALESCE(?, name) WHERE id = ?', [status, name, req.params.id]);
        res.json({ message: 'Pump updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deletePump = async (req, res) => {
    try {
        await pool.query('DELETE FROM Pump WHERE id = ?', [req.params.id]);
        res.json({ message: 'Pump deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAllPumps, getPumpById, getPumpByQR, getPumpLogs, createPump, updatePump, deletePump };

const pool = require('../database/db');

const getAllComplaints = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, v.mobile as villager_mobile, v.name as villager_name, p.name as pump_name, a.name as location
            FROM Complaint c
            JOIN Villager v ON c.villager_id = v.id
            JOIN Pump p ON c.pump_id = p.id
            LEFT JOIN Area a ON p.area_id = a.id
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const createComplaint = async (req, res) => {
    try {
        // Assume Villager might be authenticated, or we use mobile from body to look them up.
        // Let's rely on standard logic: if auth token exists, use it, else require mobile in body.
        const { pump_id, issue_type, description, mobile, name } = req.body;
        let villager_id = req.user ? req.user.id : null;

        if (!villager_id && mobile) {
            // Check if Villager exists
            let [vRows] = await pool.query('SELECT id FROM Villager WHERE mobile = ?', [mobile]);
            if (vRows.length === 0) {
                const [ins] = await pool.query('INSERT INTO Villager (mobile, name) VALUES (?, ?)', [mobile, name || '']);
                villager_id = ins.insertId;
            } else {
                villager_id = vRows[0].id;
            }
        }

        if (!villager_id) return res.status(400).json({ message: 'Villager identification required (mobile number)' });

        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await pool.query(
            'INSERT INTO Complaint (villager_id, pump_id, issue_type, description, photo_url) VALUES (?, ?, ?, ?, ?)',
            [villager_id, pump_id, issue_type, description, photoUrl]
        );

        res.status(201).json({ id: result.insertId, message: 'Complaint registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const resolveComplaint = async (req, res) => {
    try {
        await pool.query(
            'UPDATE Complaint SET status = "resolved", resolved_at = CURRENT_TIMESTAMP WHERE id = ?', 
            [req.params.id]
        );
        res.json({ message: 'Complaint resolved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const trackComplaint = async (req, res) => {
    try {
        const { mobile, complaint_id } = req.body;
        if (!mobile || !complaint_id) {
            return res.status(400).json({ message: 'Mobile and Complaint ID are required' });
        }
        
        const [rows] = await pool.query(`
            SELECT c.id, c.status, c.created_at, c.resolved_at, p.name as pump_name, v.mobile 
            FROM Complaint c
            JOIN Villager v ON c.villager_id = v.id
            JOIN Pump p ON c.pump_id = p.id
            WHERE c.id = ? AND v.mobile = ?
        `, [complaint_id, mobile]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Complaint not found with this ID and Mobile combination.' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAllComplaints, createComplaint, resolveComplaint, trackComplaint };

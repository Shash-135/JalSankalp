const pool = require('../database/db');

const getAllComplaints = async (req, res, next) => {
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

const createComplaint = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        const { pump_id, issue_type, description, mobile, name } = req.body;

        // Only use villager id from JWT when the role is villager; operators should submit a mobile to link a villager record
        let villager_id = (req.user && req.user.role === 'villager') ? req.user.id : null;

        await connection.beginTransaction();

        if (!villager_id && mobile) {
            // Check if Villager exists
            let [vRows] = await connection.query('SELECT id FROM Villager WHERE mobile = ?', [mobile]);
            if (vRows.length === 0) {
                const [ins] = await connection.query('INSERT INTO Villager (mobile, name) VALUES (?, ?)', [mobile, name || '']);
                villager_id = ins.insertId;
            } else {
                villager_id = vRows[0].id;
            }
        }

        if (!villager_id) {
            await connection.rollback();
            return res.status(400).json({ message: 'Villager identification required (mobile number)' });
        }

        // Validate pump_id
        if (!pump_id) {
            await connection.rollback();
            return res.status(400).json({ error: 'Pump ID is required.' });
        }
        const [pRows] = await connection.query('SELECT id FROM Pump WHERE id = ?', [pump_id]);
        if (pRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Invalid Pump ID. Please check and try again.' });
        }

        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await connection.query(
            'INSERT INTO Complaint (villager_id, pump_id, issue_type, description, photo_url) VALUES (?, ?, ?, ?, ?)',
            [villager_id, pump_id, issue_type, description, photoUrl]
        );

        await connection.commit();
        res.status(201).json({ id: result.insertId, message: 'Complaint registered successfully' });
    } catch (err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
    }
};

const resolveComplaint = async (req, res, next) => {
    try {
        const { note } = req.body;
        const resolutionPhotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        await pool.query(
            `UPDATE Complaint 
             SET status = "resolved", 
                 admin_notes = ?,
                 resolution_photo_url = ?,
                 resolved_at = CURRENT_TIMESTAMP 
             WHERE id = ?`, 
            [note || null, resolutionPhotoUrl, req.params.id]
        );
        res.json({ message: 'Complaint resolved successfully' });
    } catch (err) {
        next(err);
    }
};

const trackComplaint = async (req, res, next) => {
    try {
        const { mobile, complaint_id } = req.body;
        if (!mobile || !complaint_id) {
            return res.status(400).json({ message: 'Mobile and Complaint ID are required' });
        }
        
        const [rows] = await pool.query(`
            SELECT 
                c.id, c.status, c.issue_type, c.description,
                c.photo_url, c.admin_notes, c.resolution_photo_url,
                c.created_at, c.resolved_at,
                p.name as pump_name,
                v.mobile, v.name as villager_name
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
        next(err);
    }
};

module.exports = { getAllComplaints, createComplaint, resolveComplaint, trackComplaint };

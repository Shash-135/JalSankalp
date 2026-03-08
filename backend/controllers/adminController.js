const pool = require('../database/db');
const bcrypt = require('bcryptjs');

const getAdminProfile = async (req, res, next) => {
    try {
        const adminId = req.user.id;
        const [rows] = await pool.query('SELECT id, name, email FROM Admin WHERE id = ?', [adminId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        // Provide consistent dummy data for role/phone since schema doesn't have it
        res.json({
            ...rows[0],
            role: 'Control Room Admin',
            phone: '+91 98765 43210'
        });
    } catch (err) {
        next(err);
    }
};

const updateAdminProfile = async (req, res, next) => {
    try {
        const adminId = req.user.id;
        const { name, email, password } = req.body;
        
        // Check if email is already taken by another admin
        const [existing] = await pool.query('SELECT id FROM Admin WHERE email = ? AND id != ?', [email, adminId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            await pool.query('UPDATE Admin SET name = ?, email = ?, password_hash = ? WHERE id = ?', [name, email, password_hash, adminId]);
        } else {
            await pool.query('UPDATE Admin SET name = ?, email = ? WHERE id = ?', [name, email, adminId]);
        }
        
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        next(err);
    }
};

const getAllLogs = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.id, l.action, l.timestamp as time, l.duration,
                p.name as pump_name, o.name as operator_name 
            FROM PumpLog l
            LEFT JOIN Pump p ON l.pump_id = p.id
            LEFT JOIN Operator o ON l.operator_id = o.id
            ORDER BY l.timestamp DESC 
            LIMIT 100
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { getAdminProfile, updateAdminProfile, getAllLogs };

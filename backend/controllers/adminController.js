const pool = require('../database/db');
const bcrypt = require('bcryptjs');

const getAdminProfile = async (req, res) => {
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
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const updateAdminProfile = async (req, res) => {
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
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAdminProfile, updateAdminProfile };

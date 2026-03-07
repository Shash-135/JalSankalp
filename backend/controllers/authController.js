const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = {
            user: { id: admin.id, role: 'admin' }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const operatorLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        
        const [rows] = await pool.query('SELECT * FROM Operator WHERE mobile = ? AND status = "active"', [mobile]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials or inactive account' });

        const operator = rows[0];
        const isMatch = await bcrypt.compare(password, operator.password_hash);
        
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = {
            user: { id: operator.id, role: 'operator' }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: operator.id, name: operator.name, mobile: operator.mobile, role: 'operator' } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { adminLogin, operatorLogin };

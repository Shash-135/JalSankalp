const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('FATAL: JWT_SECRET environment variable is not set.');

const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = { user: { id: admin.id, role: 'admin' } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
    } catch (err) {
        next(err);
    }
};

const operatorLogin = async (req, res, next) => {
    try {
        const { mobile, password } = req.body;
        
        const [rows] = await pool.query('SELECT * FROM Operator WHERE mobile = ? AND status = "active"', [mobile]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials or inactive account' });

        const operator = rows[0];
        const isMatch = await bcrypt.compare(password, operator.password_hash);
        
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = { user: { id: operator.id, role: 'operator' } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: operator.id, name: operator.name, mobile: operator.mobile, role: 'operator' } });
    } catch (err) {
        next(err);
    }
};

module.exports = { adminLogin, operatorLogin };

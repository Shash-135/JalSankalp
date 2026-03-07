const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const jwt = require('jsonwebtoken');

// A simple OTP generation securely stored or sent via SMS (Mocked for now)
router.post('/send', async (req, res) => {
    try {
        const { mobile_number } = req.body;
        const mobile = mobile_number; // Map it internally
        if (!mobile) return res.status(400).json({ message: 'Mobile number required' });

        // Logic to send actual SMS goes here. We return a mock success for now.
        // We ensure Villager exists or create one
        let [rows] = await pool.query('SELECT * FROM Villager WHERE mobile = ?', [mobile]);
        if (rows.length === 0) {
            await pool.query('INSERT INTO Villager (mobile) VALUES (?)', [mobile]);
        }

        res.json({ message: 'OTP sent successfully', mockOtp: '123456' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error sending OTP' });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { mobile_number, otp } = req.body;
        const mobile = mobile_number; // Map it internally
        // Mock verification
        if (otp !== '123456') {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const [rows] = await pool.query('SELECT * FROM Villager WHERE mobile = ?', [mobile]);
        if (rows.length === 0) return res.status(404).json({ message: 'Villager not found' });

        const villager = rows[0];
        const payload = { user: { id: villager.id, role: 'villager' } };

        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, villager: { id: villager.id, mobile: villager.mobile } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
});

module.exports = router;

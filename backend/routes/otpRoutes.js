const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const lastSendAt = new Map();
const otpStore = new Map();
const OTP_COOLDOWN_MS = 60_000;

// Reusable transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

router.post('/send', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email address required' });

        const last = lastSendAt.get(email) || 0;
        if (Date.now() - last < OTP_COOLDOWN_MS) {
            const waitMs = OTP_COOLDOWN_MS - (Date.now() - last);
            return res.status(429).json({ message: `OTP recently sent. Please retry in ${Math.ceil(waitMs / 1000)}s.` });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background-color: #2563eb; color: #ffffff; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">JalSankalp</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Secure Identity Verification</p>
            </div>
            <div style="padding: 32px 24px; background-color: #ffffff; text-align: left;">
                <p style="font-size: 16px; color: #333333; margin-top: 0;">Hello,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.5;">To verify your email address and continue with your JalSankalp grievance, please use the following One-Time Password (OTP):</p>
                <div style="margin: 32px 0; text-align: center;">
                    <span style="display: inline-block; background-color: #f3f4f6; color: #1e40af; font-size: 32px; font-weight: 800; padding: 16px 32px; border-radius: 8px; letter-spacing: 4px;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #777777; margin-bottom: 0;">This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">JalSankalp Water Pump Support Portal &copy; ${new Date().getFullYear()}</p>
            </div>
        </div>
        `;

        const mailOptions = {
            from: process.env.SMTP_FROM || 'JalSankalp <no-reply@jalsankalp.local>',
            to: email,
            subject: 'Your JalSankalp OTP Verification Code',
            text: `Your OTP for JalSankalp is: ${otp}. It is valid for 10 minutes.`,
            html: htmlTemplate
        };

        if (process.env.SMTP_USER) {
             await transporter.sendMail(mailOptions);
        } else {
            console.log(`[DEV MODE] Sending OTP ${otp} to ${email} (No SMTP configured)`);
        }

        otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });
        lastSendAt.set(email, Date.now());

        res.json({ message: 'OTP sent to email successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error sending OTP' });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const record = otpStore.get(email);
        if (!record || record.otp !== otp || Date.now() > record.expires) {
            // Also allow the hardcoded '123456' for rapid dev testing if you want, or remove.
            if (otp !== '123456') {
               return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
        }

        // On successful verify, clear OTP
        otpStore.delete(email);

        let [rows] = await pool.query('SELECT * FROM Villager WHERE email = ?', [email]);
        let villagerId;
        
        if (rows.length === 0) {
            const [ins] = await pool.query('INSERT INTO Villager (email) VALUES (?)', [email]);
            villagerId = ins.insertId;
        } else {
            villagerId = rows[0].id;
        }

        const payload = { user: { id: villagerId, role: 'villager' } };

        jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, villager: { id: villagerId, email: email } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
});

module.exports = router;

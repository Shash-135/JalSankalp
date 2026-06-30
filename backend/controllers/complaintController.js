const pool = require('../database/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const getAllComplaints = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, v.email as villager_email, v.name as villager_name, p.name as pump_name, a.name as location
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
        const { pump_id, issue_type, description, email, name } = req.body;

        
        let villager_id = (req.user && req.user.role === 'villager') ? req.user.id : null;

        await connection.beginTransaction();

        if (!villager_id && email) {
            let [vRows] = await connection.query('SELECT id FROM Villager WHERE email = ?', [email]);
            if (vRows.length === 0) {
                const [ins] = await connection.query('INSERT INTO Villager (email, name) VALUES (?, ?)', [email, name || '']);
                villager_id = ins.insertId;
            } else {
                if (name) {
                    await connection.query('UPDATE Villager SET name = ? WHERE id = ?', [name, vRows[0].id]);
                }
                villager_id = vRows[0].id;
            }
        } else if (villager_id && name) {
            // Update the villager's name using their authenticated ID
            await connection.query('UPDATE Villager SET name = ? WHERE id = ?', [name, villager_id]);
        }

        if (!villager_id) {
            await connection.rollback();
            return res.status(400).json({ message: 'Villager identification required (email address)' });
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

        const photoUrl = req.file ? req.file.path : null;

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
        const resolutionPhotoUrl = req.file ? req.file.path : null;
        const complaintId = req.params.id;
        
        // Fetch villager details to send email
        const [cRows] = await pool.query(`
            SELECT v.email, v.name, c.issue_type 
            FROM Complaint c 
            JOIN Villager v ON c.villager_id = v.id 
            WHERE c.id = ?`, 
            [complaintId]
        );
        
        await pool.query(
            `UPDATE Complaint 
             SET status = "resolved", 
                 admin_notes = ?,
                 resolution_photo_url = ?,
                 resolved_at = CURRENT_TIMESTAMP 
             WHERE id = ?`, 
            [note || null, resolutionPhotoUrl, complaintId]
        );

        if (cRows.length > 0) {
            const villager = cRows[0];
            const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background-color: #10b981; color: #ffffff; padding: 24px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">JalSankalp</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Grievance Resolved</p>
                </div>
                <div style="padding: 32px 24px; background-color: #ffffff; text-align: left;">
                    <p style="font-size: 16px; color: #333333; margin-top: 0;">Hello ${villager.name || 'Citizen'},</p>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">We are pleased to inform you that your water grievance request (<strong>Ticket #${complaintId}</strong>) regarding <em>${villager.issue_type}</em> has been officially marked as <strong>Resolved</strong> by our operations team.</p>
                    
                    <div style="margin: 24px 0; padding: 16px; background-color: #f3f4f6; border-left: 4px solid #10b981; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Resolution Notes:</strong><br/>${note || 'Issue addressed and resolved.'}</p>
                    </div>

                    <p style="font-size: 14px; color: #777777; margin-bottom: 0;">You can view the full details and photographic proof of the resolution by tracking your ticket on the JalSankalp portal.</p>
                </div>
                <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">JalSankalp Water Pump Support Portal &copy; ${new Date().getFullYear()}</p>
                </div>
            </div>
            `;

            const mailOptions = {
                from: process.env.SMTP_FROM || 'JalSankalp <no-reply@jalsankalp.local>',
                to: villager.email,
                subject: 'JalSankalp: Your Grievance is Resolved!',
                text: `Your grievance #${complaintId} (${villager.issue_type}) is resolved! Notes: ${note}`,
                html: htmlTemplate
            };

            if (process.env.SMTP_USER) {
                 await transporter.sendMail(mailOptions);
            } else {
                console.log(`[DEV MODE] Sending Resolution Email to ${villager.email} for Ticket #${complaintId}`);
            }
        }

        res.json({ message: 'Complaint resolved and villager notified' });
    } catch (err) {
        next(err);
    }
};

const trackComplaint = async (req, res, next) => {
    try {
        const { email, complaint_id } = req.body;
        if (!email || !complaint_id) {
            return res.status(400).json({ message: 'Email and Complaint ID are required' });
        }
        
        const [rows] = await pool.query(`
            SELECT 
                c.id, c.status, c.issue_type, c.description,
                c.photo_url, c.admin_notes, c.resolution_photo_url,
                c.created_at, c.resolved_at,
                p.name as pump_name,
                v.email, v.name as villager_name
            FROM Complaint c
            JOIN Villager v ON c.villager_id = v.id
            JOIN Pump p ON c.pump_id = p.id
            WHERE c.id = ? AND v.email = ?
        `, [complaint_id, email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Complaint not found with this ID and Email combination.' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllComplaints, createComplaint, resolveComplaint, trackComplaint };

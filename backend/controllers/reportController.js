const pool = require('../database/db');

const getPumpUsageReport = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.name, SUM(pl.duration) as total_duration_minutes, COUNT(pl.id) as total_logs
            FROM Pump p
            LEFT JOIN PumpLog pl ON p.id = pl.pump_id AND pl.action = 'stop'
            GROUP BY p.id, p.name
            ORDER BY total_duration_minutes DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getOperatorPerformance = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT o.id, o.name, COUNT(pl.id) as logs_submitted, SUM(pl.duration) as total_runtime_logged
            FROM Operator o
            LEFT JOIN PumpLog pl ON o.id = pl.operator_id AND pl.action = 'stop'
            GROUP BY o.id, o.name
            ORDER BY logs_submitted DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getComplaintReport = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_complaints,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_complaints,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_complaints,
                issue_type,
                COUNT(issue_type) as count_by_type
            FROM Complaint
            GROUP BY issue_type
        `);
        
        // Let's format it nicely
        const total = rows.reduce((acc, row) => acc + row.count_by_type, 0);
        const pending = rows.reduce((acc, row) => acc + parseInt(row.pending_complaints || 0), 0);
        const resolved = rows.reduce((acc, row) => acc + parseInt(row.resolved_complaints || 0), 0);
        
        res.json({
            summary: { total, pending, resolved },
            breakdownByType: rows.map(r => ({ type: r.issue_type, count: r.count_by_type }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getPumpUsageReport, getOperatorPerformance, getComplaintReport };

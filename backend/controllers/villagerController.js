const pool = require('../database/db');

const submitFeedback = async (req, res) => {
    try {
        const { rating, comments, mobile } = req.body;
        let villager_id = req.user ? req.user.id : null;

        if (!villager_id && mobile) {
            let [vRows] = await pool.query('SELECT id FROM Villager WHERE mobile = ?', [mobile]);
            if (vRows.length === 0) {
                const [ins] = await pool.query('INSERT INTO Villager (mobile) VALUES (?)', [mobile]);
                villager_id = ins.insertId;
            } else {
                villager_id = vRows[0].id;
            }
        }

        if (!villager_id) return res.status(400).json({ message: 'Villager identification required' });

        await pool.query(
            'INSERT INTO Feedback (villager_id, rating, comments) VALUES (?, ?, ?)',
            [villager_id, rating, comments]
        );

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { submitFeedback };

const pool = require('../database/db');




const submitFeedback = async (req, res) => {
  const { mobile, rating, comments } = req.body;

  if (!mobile || !rating) {
    return res.status(400).json({ error: 'Mobile number and rating are required' });
  }

  try {
    
    let [villagers] = await pool.query('SELECT id FROM Villager WHERE mobile = ?', [mobile]);
    let villager_id;

    if (villagers.length === 0) {
      const [insertVillager] = await pool.query('INSERT INTO Villager (mobile) VALUES (?)', [mobile]);
      villager_id = insertVillager.insertId;
    } else {
      villager_id = villagers[0].id;
    }

    const [result] = await pool.query(
      'INSERT INTO Feedback (villager_id, rating, comments) VALUES (?, ?, ?)',
      [villager_id, rating, comments]
    );

    res.status(201).json({ message: 'Feedback submitted successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error submitting feedback' });
  }
};




const getFeedback = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, v.mobile, v.name as villager_name 
      FROM Feedback f
      JOIN Villager v ON f.villager_id = v.id
      ORDER BY f.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching feedback' });
  }
};

module.exports = { submitFeedback, getFeedback };

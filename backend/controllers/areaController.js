const pool = require('../database/db');




const getAreas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Area ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching areas' });
  }
};




const createArea = async (req, res) => {
  const { name, pincode, capacity_kl } = req.body;

  if (!name || !pincode) {
    return res.status(400).json({ error: 'Name and pincode are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Area (name, pincode, capacity_kl) VALUES (?, ?, ?)',
      [name, pincode, capacity_kl || 0]
    );
    res.status(201).json({ id: result.insertId, name, pincode, capacity_kl: capacity_kl || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating area' });
  }
};

module.exports = { getAreas, createArea };

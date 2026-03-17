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
  const { name, pincode } = req.body;

  if (!name || !pincode) {
    return res.status(400).json({ error: 'Name and pincode are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Area (name, pincode) VALUES (?, ?)',
      [name, pincode]
    );
    res.status(201).json({ id: result.insertId, name, pincode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating area' });
  }
};

module.exports = { getAreas, createArea };

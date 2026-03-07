const pool = require('../database/db');
const bcrypt = require('bcryptjs');

const getAllOperators = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT o.id, o.name, o.mobile, o.status, o.created_at, a.name as region 
            FROM Operator o 
            LEFT JOIN Area a ON o.assigned_area_id = a.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const createOperator = async (req, res) => {
    try {
        const { name, mobile, password, assigned_area_id } = req.body;
        
        // Check if exists
        const [exists] = await pool.query('SELECT id FROM Operator WHERE mobile = ?', [mobile]);
        if (exists.length > 0) return res.status(400).json({ message: 'Operator with this mobile already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO Operator (name, mobile, password_hash, assigned_area_id) VALUES (?, ?, ?, ?)',
            [name, mobile, password_hash, assigned_area_id]
        );

        res.status(201).json({ id: result.insertId, message: 'Operator created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const updateOperator = async (req, res) => {
    try {
        const { name, mobile, status, assigned_area_id } = req.body;
        await pool.query(
            'UPDATE Operator SET name = COALESCE(?, name), mobile = COALESCE(?, mobile), status = COALESCE(?, status), assigned_area_id = COALESCE(?, assigned_area_id) WHERE id = ?', 
            [name, mobile, status, assigned_area_id, req.params.id]
        );
        res.json({ message: 'Operator updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteOperator = async (req, res) => {
    try {
        await pool.query('DELETE FROM Operator WHERE id = ?', [req.params.id]);
        res.json({ message: 'Operator deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAllOperators, createOperator, updateOperator, deleteOperator };

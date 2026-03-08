const pool = require('../database/db');
const bcrypt = require('bcryptjs');

const getAllOperators = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT o.id, o.name, o.mobile, o.status, o.created_at, a.name as region 
            FROM Operator o 
            LEFT JOIN Area a ON o.assigned_area_id = a.id
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const createOperator = async (req, res, next) => {
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
        next(err);
    }
};

const updateOperator = async (req, res, next) => {
    try {
        const { name, mobile, status, assigned_area_id } = req.body;
        await pool.query(
            'UPDATE Operator SET name = COALESCE(?, name), mobile = COALESCE(?, mobile), status = COALESCE(?, status), assigned_area_id = COALESCE(?, assigned_area_id) WHERE id = ?', 
            [name, mobile, status, assigned_area_id, req.params.id]
        );
        res.json({ message: 'Operator updated successfully' });
    } catch (err) {
        next(err);
    }
};

const deleteOperator = async (req, res, next) => {
    try {
        await pool.query('DELETE FROM Operator WHERE id = ?', [req.params.id]);
        res.json({ message: 'Operator deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const getOperatorPumps = async (req, res, next) => {
    try {
        const [operatorRows] = await pool.query('SELECT assigned_area_id FROM Operator WHERE id = ?', [req.params.id]);
        if (operatorRows.length === 0) return res.status(404).json({ message: 'Operator not found' });
        
        const areaId = operatorRows[0].assigned_area_id;
        if (!areaId) return res.json([]); // No area assigned
        
        const [pumps] = await pool.query('SELECT id, name, status, qr_code FROM Pump WHERE area_id = ?', [areaId]);
        res.json(pumps);
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllOperators, createOperator, updateOperator, deleteOperator, getOperatorPumps };

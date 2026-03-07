const express = require('express');
const router = express.Router();
const { getAreas, createArea } = require('../controllers/areaController');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adminAuth, getAreas);
router.post('/', authMiddleware, adminAuth, createArea);

module.exports = router;

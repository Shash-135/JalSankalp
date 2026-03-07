const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');
const pumpController = require('../controllers/pumpController');

// Public villager routes (read-only)
router.get('/', pumpController.getAllPumps);
router.get('/qr/:qr', pumpController.getPumpByQR);
router.get('/:id', pumpController.getPumpById);
router.get('/:id/logs', pumpController.getPumpLogs);

// Admin-only routes
router.post('/', authMiddleware, adminAuth, pumpController.createPump);
router.put('/:id', authMiddleware, adminAuth, pumpController.updatePump);
router.delete('/:id', authMiddleware, adminAuth, pumpController.deletePump);

module.exports = router;

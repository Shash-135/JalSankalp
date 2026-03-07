const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

// Admin protected routes for reports
router.get('/pump-usage', authMiddleware, adminAuth, reportController.getPumpUsageReport);
router.get('/operator-performance', authMiddleware, adminAuth, reportController.getOperatorPerformance);
router.get('/complaints', authMiddleware, adminAuth, reportController.getComplaintReport);

module.exports = router;

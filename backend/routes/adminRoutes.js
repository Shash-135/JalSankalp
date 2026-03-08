const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/authController');
const { getAdminProfile, updateAdminProfile, getAllLogs } = require('../controllers/adminController');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/me', authMiddleware, adminAuth, getAdminProfile);
router.put('/me', authMiddleware, adminAuth, updateAdminProfile);
router.get('/logs', authMiddleware, adminAuth, getAllLogs);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const complaintController = require('../controllers/complaintController');

// Admin Routes
router.get('/', authMiddleware, adminAuth, complaintController.getAllComplaints);
router.put('/:id/resolve', authMiddleware, adminAuth, complaintController.resolveComplaint);

// Villager / Public Routes (Assume JWT auth for villagers or open POST if no deep auth required, but standard is authMiddleware)
// The requirement: "Villager routes can be public" -> let's make POST /api/complaints public, or use villager JWT.
// We will allow villager JWT if present, or just trust the body. Based on OTP route, Villager gets a token.
router.post('/', optionalAuth, upload.single('photo'), complaintController.createComplaint);
router.post('/track', complaintController.trackComplaint);

module.exports = router;

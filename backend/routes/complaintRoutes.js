const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const complaintController = require('../controllers/complaintController');


router.get('/', authMiddleware, adminAuth, complaintController.getAllComplaints);
router.put('/:id/resolve', authMiddleware, adminAuth, upload.single('resolution_photo'), complaintController.resolveComplaint);




router.post('/', optionalAuth, upload.single('photo'), complaintController.createComplaint);
router.post('/track', complaintController.trackComplaint);

module.exports = router;

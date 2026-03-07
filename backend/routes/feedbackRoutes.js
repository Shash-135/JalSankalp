const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');

router.post('/', submitFeedback);
router.get('/', authMiddleware, adminAuth, getFeedback);

module.exports = router;

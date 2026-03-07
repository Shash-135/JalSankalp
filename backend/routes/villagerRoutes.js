const express = require('express');
const router = express.Router();
const villagerController = require('../controllers/villagerController');

// Villager Feedback
router.post('/feedback', villagerController.submitFeedback);

module.exports = router;

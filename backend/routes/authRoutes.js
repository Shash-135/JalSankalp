const express = require('express');
const router = express.Router();
const { adminLogin, operatorLogin } = require('../controllers/authController');

// For Operator App auth => POST /api/auth/login
router.post('/login', operatorLogin);

module.exports = router;

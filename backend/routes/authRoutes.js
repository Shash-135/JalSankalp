const express = require('express');
const router = express.Router();
const { adminLogin, operatorLogin } = require('../controllers/authController');


router.post('/login', operatorLogin);

module.exports = router;

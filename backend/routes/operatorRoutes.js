const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');
const operatorController = require('../controllers/operatorController');


router.get('/', authMiddleware, adminAuth, operatorController.getAllOperators);
router.post('/', authMiddleware, adminAuth, operatorController.createOperator);
router.put('/:id', authMiddleware, adminAuth, operatorController.updateOperator);
router.delete('/:id', authMiddleware, adminAuth, operatorController.deleteOperator);
router.get('/:id/pumps', authMiddleware, operatorController.getOperatorPumps);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware, operatorAuth } = require('../middleware/authMiddleware');
const pumpOperationController = require('../controllers/pumpOperationController');
const upload = require('../middleware/uploadMiddleware');


router.post('/start', authMiddleware, operatorAuth, pumpOperationController.startPump);
router.post('/stop', authMiddleware, operatorAuth, pumpOperationController.stopPump);
router.post('/sync', authMiddleware, operatorAuth, pumpOperationController.syncLogs);
router.get('/logs', authMiddleware, operatorAuth, pumpOperationController.getPumpLogs);
router.post('/report', authMiddleware, operatorAuth, upload.single('photo'), pumpOperationController.reportMaintenance);


router.get('/status/:pump_id', authMiddleware, operatorAuth, pumpOperationController.getPumpStatus);
router.get('/:qr_code', pumpOperationController.getPumpByQR);

module.exports = router;

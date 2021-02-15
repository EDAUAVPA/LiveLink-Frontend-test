const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController.js');
const verifyToken = require('../middleware/verifyToken.js');

// route: /api/trackRecord

router.post('/', verifyToken, trackController.getRecords);

router.post('/save/:user_id', verifyToken, trackController.saveRecord);

router.post('/detailed-record', verifyToken, trackController.getDetailedRecord);

router.post('/search/:user_id', trackController.getUserRecord);

module.exports = router;
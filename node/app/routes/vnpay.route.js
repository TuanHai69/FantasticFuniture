const express = require('express');
const vnpayController = require('../controllers/vnpay.controller');

const router = express.Router();

router.post('/create-payment', vnpayController.createPayment);
router.get('/callback', vnpayController.verifyPayment); 

module.exports = router;

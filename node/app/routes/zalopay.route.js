const express = require('express');
const zalopay = require('../controllers/zalopay.controller');

const router = express.Router();

router.post('/payment', zalopay.createPayment);
router.post('/callback', zalopay.handleCallback);
router.post('/order-status/:app_trans_id', zalopay.getOrderStatus);

module.exports = router;
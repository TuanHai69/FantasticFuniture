const express = require("express");
const zalopay = require("../controllers/zalopay.controller");

const router = express.Router();

router.route("/create-order")
    .post(zalopay.createOrder);

module.exports = router;
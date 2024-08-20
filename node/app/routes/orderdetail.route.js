const express = require("express");
const orderdetail = require("../controllers/orderdetail.controller");

const router = express.Router();

router.route("/")
    .get(orderdetail.findAll)
    .post(orderdetail.create)

router.route("/:id")
    .get(orderdetail.findOne)
    .put(orderdetail.update)
    .delete(orderdetail.delete)

router.route("/order/:id")
    .get(orderdetail.findByOrder)


module.exports = router;

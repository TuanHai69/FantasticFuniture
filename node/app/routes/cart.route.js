const express = require("express");
const cart = require("../controllers/cart.controller");

const router = express.Router();

router.route("/")
    .get(cart.findAll)
    .post(cart.create)

router.route("/:id")
    .get(cart.findOne)
    .put(cart.update)
    .delete(cart.delete)

router.route("/user/:id")
    .get(cart.findByuser)

router.route("/store/:id")
    .get(cart.findByStore)

router.route("/user/:userid/store/:storeid")
    .get(cart.findByUserIdAndStoreId)

router.route("/order/:orderid")
    .get(cart.findByOrderId);
module.exports = router;

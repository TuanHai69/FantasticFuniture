const express = require("express");
const price = require("../controllers/price.controller");

const router = express.Router();

router.route("/")
    .get(price.findAll)
    .post(price.create);

router.route("/:id")
    .get(price.findOne)
    .put(price.update)
    .delete(price.delete);

router.route("/product/:productid/no-end-date")
    .get(price.findByProductWithNoEndDate);

router.route("/product/:productid")
    .get(price.findByProduct);

module.exports = router;

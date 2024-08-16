const express = require("express");
const producttype = require("../controllers/producttype.controller");

const router = express.Router();

router.route("/")
    .get(producttype.findAll)
    .post(producttype.create)

router.route("/:id")
    .get(producttype.findOne)
    .put(producttype.update)
    .delete(producttype.delete)

router.route("/type/:id")
    .get(producttype.findByType)

router.route("/product/:id")
    .get(producttype.findByProduct)

module.exports = router;

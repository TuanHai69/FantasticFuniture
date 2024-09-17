const express = require("express");
const product = require("../controllers/product.controller");

const router = express.Router();

router.route("/")
    .get(product.findAll)
    .post(product.create)

router.route("/:id")
    .get(product.findOne)
    .put(product.update)
    .delete(product.delete)

router.route("/store/:id")
    .get(product.findByStore)
    
router.route("/state/:state")
    .get(product.findByState)

module.exports = router;

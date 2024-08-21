const express = require("express");
const coded = require("../controllers/coded.controller");

const router = express.Router();

router.route("/")
    .get(coded.findAll)
    .post(coded.create)

router.route("/:id")
    .get(coded.findOne)
    .put(coded.update)
    .delete(coded.delete)

router.route("/user/:id")
    .get(coded.findByuser)

router.route("/code/:id")
    .get(coded.findByCode)


module.exports = router;

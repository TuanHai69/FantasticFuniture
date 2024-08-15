const express = require("express");
const type = require("../controllers/type.controller");

const router = express.Router();

router.route("/")
    .get(type.findAll)
    .post(type.create)

router.route("/:id")
    .get(type.findOne)
    .put(type.update)
    .delete(type.delete)

router.route("/user/:id")
    .get(type.findByuser)

module.exports = router;

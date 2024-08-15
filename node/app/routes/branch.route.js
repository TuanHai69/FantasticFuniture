const express = require("express");
const branch = require("../controllers/branch.controller");

const router = express.Router();

router.route("/")
    .get(branch.findAll)
    .post(branch.create)

router.route("/:id")
    .get(branch.findOne)
    .put(branch.update)
    .delete(branch.delete)

router.route("/user/:id")
    .get(branch.findByuser)

module.exports = router;

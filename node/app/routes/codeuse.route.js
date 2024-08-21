const express = require("express");
const codeuse = require("../controllers/codeuse.controller");

const router = express.Router();

router.route("/")
    .get(codeuse.findAll)
    .post(codeuse.create)

router.route("/:id")
    .get(codeuse.findOne)
    .put(codeuse.update)
    .delete(codeuse.delete)

router.route("/user/:id")
    .get(codeuse.findByuser)

router.route("/code/:id")
    .get(codeuse.findByCode)


module.exports = router;

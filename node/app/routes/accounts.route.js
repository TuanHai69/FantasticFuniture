const express = require("express");
const accounts = require("../controllers/accounts.controller");

const router = express.Router();

router.route("/")
    .get(accounts.findAll)
    .post(accounts.create)

router.route("/:id")
    .get(accounts.findOne)
    .put(accounts.update)
    .delete(accounts.delete)

router.route("/login")
    .post(accounts.checkLogin)

module.exports = router;

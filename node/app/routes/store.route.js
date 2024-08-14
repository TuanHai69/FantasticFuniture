const express = require("express");
const store = require("../controllers/store.controller");

const router = express.Router();

router.route("/")
    .get(store.findAll)
    .post(store.create)

router.route("/:id")
    .get(store.findOne)
    .put(store.update)
    .delete(store.delete)

router.route("/user/:id")
    .get(store.findByuser)

router.route("/branch/:id")
    .get(store.findByBranch)

module.exports = router;

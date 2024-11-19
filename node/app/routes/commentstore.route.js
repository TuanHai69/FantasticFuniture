const express = require("express");
const commentstore = require("../controllers/commentstore.controller");

const router = express.Router();

router.route("/")
    .get(commentstore.findAll)
    .post(commentstore.create)

router.route("/:id")
    .get(commentstore.findOne)
    .put(commentstore.update)
    .delete(commentstore.delete)

router.route("/user/:id")
    .get(commentstore.findByuser)

router.route("/store/:id")
    .get(commentstore.findByStore)

router.route("/liked/:userid/:storeid")
    .get(commentstore.isLiked)

module.exports = router;

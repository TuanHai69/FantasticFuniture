const express = require("express");
const comment = require("../controllers/comment.controller");

const router = express.Router();

router.route("/")
    .get(comment.findAll)
    .post(comment.create)

router.route("/:id")
    .get(comment.findOne)
    .put(comment.update)
    .delete(comment.delete)

router.route("/user/:id")
    .get(comment.findByUser)

router.route("/product/:id")
    .get(comment.findByProduct)


module.exports = router;

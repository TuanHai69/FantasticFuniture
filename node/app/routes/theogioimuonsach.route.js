const express = require("express");
const theogioimuonsach = require("../controllers/theogioimuonsach.controller");

const router = express.Router();

router.route("/")
    .get(theogioimuonsach.findAll)
    .post(theogioimuonsach.create)
    .delete(theogioimuonsach.deleteAll);

router.route("/:id")
    .get(theogioimuonsach.findOne)
    .put(theogioimuonsach.update)
    .delete(theogioimuonsach.delete);

router.route("/madocgia/:madocgia")
    .get(theogioimuonsach.findmadocgia);
    
router.route("/findtrung/:madocgia/:masach/:ngaymuon")
    .get(theogioimuonsach.findtrung);

module.exports = router;
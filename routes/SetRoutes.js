const express = require("express");
const router = express.Router();
const SetController = require("../controllers/SetController");
const Set = require("../models/Set");

router.get("/:slug", SetController.getSet);
router.post("/:slug", SetController.postSetSuccess);

router.get("/:setslug/exercises/:lang/:slug", SetController.getExerciseInSet);
router.post("/:setslug/exercises/:lang/:slug", SetController.postExerciseInSet);

router.get("/", function (req, res) {
    Set.find({}, function (err, sets) {
        if (err) console.log(err);

        res.render("SeriesView", { sets });
    });
});
module.exports = router;
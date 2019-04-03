const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/ExerciseController");
const Exercise = require("../models/Exercise");
const { ensureAuthenticated } = require("./middlewares/Authenticated");
const User = require("../models/User");

router.get("/", (req, res) => {
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) throw (err);
        if (typeof req.user !== "undefined" && req.user.type === "teacher" && req.user.firsttime === true) {
            req.user.firsttime = false;
            User.findOneAndUpdate(req.user._id, { $set: { firsttime: req.user.firsttime } }, (err) => {
                if (err) throw err;
                res.render("BrowsingView", { tags, menu: "exercises", firsttime: true });
            });
        } else {
            res.render("BrowsingView", { tags, menu: "exercises", firsttime: false });
        }
    });
});

router.get("/:lang/:slug", ExerciseController.getExercise);
router.post("/:lang/:slug", ensureAuthenticated, ExerciseController.postExercise);

router.delete("/:id", ExerciseController.deleteExercise);

module.exports = router;
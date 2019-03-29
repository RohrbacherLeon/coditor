const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/ExerciseController");
const Exercise = require("../models/Exercise");
const { ensureAuthenticated } = require("./middlewares/Authenticated");

router.get("/", (req, res) => {
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);
        res.render("BrowsingView", { tags, menu: "exercises" });
    });
});

router.get("/:lang/:slug", ExerciseController.getExercise);
router.post("/:lang/:slug", ensureAuthenticated, ExerciseController.postExercise);

router.delete("/:id", ExerciseController.deleteExercise);

module.exports = router;
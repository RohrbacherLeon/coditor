const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/ExerciseController");
const { ensureAuthenticated } = require("./middlewares/Authenticated");

router.get("/", ExerciseController.getExoByLang);

router.get("/:lang/:slug", ExerciseController.getExercise);
router.post("/:lang/:slug", ensureAuthenticated, ExerciseController.postExercise);

router.delete("/:id", ExerciseController.deleteExercise);

module.exports = router;
const express = require("express");
const router = express.Router();
const SetController = require("../controllers/SetController");

router.get("/:slug", SetController.getSet);
router.get("/:setslug/exercises/:lang/:slug", SetController.getExerciseInSet);

module.exports = router;
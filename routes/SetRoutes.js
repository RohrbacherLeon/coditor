const express = require("express");
const router = express.Router();
const SetController = require("../controllers/SetController");

router.get("/:slug", SetController.getSet);
router.post("/:slug", SetController.postSetSuccess);

router.get("/:setslug/exercises/:lang/:slug", SetController.getExerciseInSet);
router.post("/:setslug/exercises/:lang/:slug", SetController.postExerciseInSet);

module.exports = router;
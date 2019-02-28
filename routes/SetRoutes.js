const express = require("express");
const router = express.Router();
const SetController = require("../controllers/SetController");

router.get("/:slug", SetController.getSet);

module.exports = router;




const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

router.get("/", (req, res) => {
    res.render("AdminView");
});

// router.post("/", AdminController.register_teacher);

module.exports = router;
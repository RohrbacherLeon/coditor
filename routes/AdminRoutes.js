const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { isAdmin } = require("./middlewares/Authenticated");

router.get("/register", (req, res) => {
    res.render('RegisterAdminView');
});

router.post("/register", AdminController.register_teacher);

module.exports = router;
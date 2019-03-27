const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AdminController = require("../controllers/AdminController");

router.get("/", (req, res) => {
    User.find({ pending: true }, (err, users) => {
        if (err) throw err;
        users.forEach(user => {
            delete user.profile.password;
        });
        console.log(users);
        res.render("AdminView", { requests: users });
    });
});

router.post("/:id", AdminController.register_teacher);

module.exports = router;
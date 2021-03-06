const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const passport = require("./middlewares/LocalConnection");
const googlePassport = require("./middlewares/GoogleConnection");
const githubPassport = require("./middlewares/GithubConnection");
const { notAuthenticated } = require("./middlewares/Authenticated");

router.get("/", (req, res) => {
    res.render("HomeView", { menu: "accueil" });
});

router.get("/login", notAuthenticated, (req, res) => {
    res.render("LoginView", { menu: "login" });
});
router.post("/login", passport.authenticate("local", { successRedirect: "/exercises", failureRedirect: "/login", failureFlash: "Adresse email ou mot de passe incorrecte." }));

router.get("/register", notAuthenticated, (req, res) => {
    res.render("RegisterView", { menu: "register" });
});
router.post("/register", UserController.register_post);

// Google auth
router.get("/auth/google", googlePassport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after google has authenticated the user
router.get("/auth/google/callback", googlePassport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/register"
}));

// Github auth
router.get("/auth/github", githubPassport.authenticate("github"));

// Callback after github has authenticated the user
router.get("/auth/github/callback", githubPassport.authenticate("github", {
    successRedirect: "/profile",
    failureRedirect: "/register"
}));

router.get("/register_teacher", (req, res) => {
    res.render("RegisterTeacherView");
});
router.post("/register_teacher", UserController.register_teacher);

router.get("/forgot_password", (req, res) => {
    res.render("ForgotPasswordView");
});

router.get("/logout", UserController.logout);

module.exports = router;
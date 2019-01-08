const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')
const passport = require('./middlewares/LocalConnection');

router.get('/', (req, res) => {
    res.render('HomeView');
});

router.get('/login', (req, res) => {
    res.render('LoginView');
});
router.post('/login', passport.authenticate('local', { successRedirect: '/exercises/', failureRedirect: '/login', failureFlash: true, failureFlash: 'Adresse email ou mot de passe incorrecte.', successFlash: 'Vous êtes maintenant connecté.' }));

router.get('/register', (req, res) => {
    res.render('RegisterView');
});
router.post('/register', UserController.register_post);

router.get('/register_teacher', (req, res) => {
    res.render('RegisterTeacherView');
});

router.get('/forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});

router.get('/logout', UserController.logout);

module.exports = router;